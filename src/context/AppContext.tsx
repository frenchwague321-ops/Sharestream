import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, User, Reservation, Language, AccountStatus } from '../types';
import { INITIAL_ACCOUNTS, INITIAL_USERS, INITIAL_RESERVATIONS, DEFAULT_WHATSAPP_NUMBER } from '../data/initialData';
import { t as translate, translations } from '../i18n/translations';
import confetti from 'canvas-confetti';
import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['fr'], params?: Record<string, string | number>) => string;
  
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  accounts: Account[];
  addAccount: (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  toggleAccountStatus: (id: string, newStatus: AccountStatus) => void;
  
  reservations: Reservation[];
  reserveAccount: (accountId: string) => { success: boolean; error?: string };
  
  selectedAccount: Account | null;
  setSelectedAccount: (acc: Account | null) => void;
  
  activeTab: 'home' | 'admin' | 'profile' | 'code';
  setActiveTab: (tab: 'home' | 'admin' | 'profile' | 'code') => void;
  
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  generateWhatsAppLink: (account: Account) => string;
  
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  mobileFrameMode: boolean;
  setMobileFrameMode: (enabled: boolean) => void;

  isCloudSyncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'sharestream_lang',
  USER: 'sharestream_current_user',
  ACCOUNTS: 'sharestream_accounts',
  USERS: 'sharestream_users',
  RESERVATIONS: 'sharestream_reservations',
  WHATSAPP: 'sharestream_whatsapp_num',
  FRAME_MODE: 'sharestream_mobile_frame',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  // Current User (initialized null or from stored session, validated by Firebase Auth)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  // Registered Users from Firestore
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Accounts
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (saved) {
        const parsed: Reservation[] = JSON.parse(saved);
        const hasJeanRes = parsed.some(r => r.userId === 'uid_firebase' || r.userEmail?.toLowerCase() === 'jean@email.com');
        if (!hasJeanRes) {
          const jeanReservation = INITIAL_RESERVATIONS.find(r => r.userId === 'uid_firebase');
          return jeanReservation ? [jeanReservation, ...parsed] : parsed;
        }
        return parsed;
      }
      return INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  // WhatsApp contact number
  const [whatsappNumber, setWhatsappNumberState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WHATSAPP);
    if (!saved || saved.replace(/[^0-9]/g, '') === '221770000000') {
      return DEFAULT_WHATSAPP_NUMBER;
    }
    return saved;
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'home' | 'admin' | 'profile' | 'code'>('home');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(true);
  const [mobileFrameMode, setMobileFrameMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FRAME_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  // Real-time Firestore synchronization with offline fallback
  useEffect(() => {
    let unsubscribeAccounts: () => void = () => {};
    let unsubscribeUsers: () => void = () => {};
    let unsubscribeReservations: () => void = () => {};
    let unsubscribeSettings: () => void = () => {};
    let unsubscribeAuth: () => void = () => {};

    try {
      // 0. Live Firebase Authentication state
      if (auth) {
        unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser && fbUser.email) {
            const cleanEmail = fbUser.email.toLowerCase();
            const isAdmin = cleanEmail === 'moussawague062@gmail.com' || cleanEmail === 'admin@sharestream.com';
            const userObj: User = {
              id: fbUser.uid,
              name: fbUser.displayName || (isAdmin ? 'Moussa Wagué' : cleanEmail.split('@')[0]),
              email: cleanEmail,
              role: isAdmin ? 'admin' : 'user',
              phoneNumber: isAdmin ? '+221 77 705 91 02' : undefined,
              createdAt: Date.now(),
            };
            setCurrentUser(userObj);
          }
        });
      }
      // 1. Live Accounts
      const accountsCol = collection(db, 'accounts');
      unsubscribeAccounts = onSnapshot(accountsCol, async (snapshot) => {
        setIsCloudSyncing(false);
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_ACCOUNTS.forEach((acc) => {
              batch.set(doc(db, 'accounts', acc.id), acc);
            });
            await batch.commit();
          } catch (err) {
            console.warn('Could not seed initial accounts:', err);
          }
        } else {
          const loadedAccounts: Account[] = [];
          const seenIds = new Set<string>();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Partial<Account>;
            const rawId = data.id || docSnap.id || `acc-${Math.random().toString(36).substring(2, 9)}`;
            let uniqueId = rawId;
            let counter = 1;
            while (seenIds.has(uniqueId)) {
              uniqueId = `${rawId}-${counter}`;
              counter++;
            }
            seenIds.add(uniqueId);
            loadedAccounts.push({
              ...(data as Account),
              id: uniqueId,
            });
          });
          loadedAccounts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setAccounts(loadedAccounts);
        }
      }, (error) => {
        console.warn('Firestore accounts sync error:', error);
        setIsCloudSyncing(false);
      });

      // 2. Live Users
      const usersCol = collection(db, 'users');
      unsubscribeUsers = onSnapshot(usersCol, async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_USERS.forEach((usr) => {
              batch.set(doc(db, 'users', usr.id), usr);
            });
            await batch.commit();
          } catch (err) {
            console.warn('Could not seed initial users:', err);
          }
        } else {
          const loadedUsers: User[] = [];
          const seenUserIds = new Set<string>();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Partial<User>;
            const rawId = data.id || docSnap.id || `usr-${Math.random().toString(36).substring(2, 9)}`;
            let uniqueId = rawId;
            let counter = 1;
            while (seenUserIds.has(uniqueId)) {
              uniqueId = `${rawId}-${counter}`;
              counter++;
            }
            seenUserIds.add(uniqueId);
            loadedUsers.push({
              ...(data as User),
              id: uniqueId,
            });
          });
          
          // Guarantee Moussa Wagué (admin) & Jean Dupont exist
          const hasAdmin = loadedUsers.some(u => u.email.toLowerCase() === 'moussawague062@gmail.com');
          const hasJean = loadedUsers.some(u => u.email.toLowerCase() === 'jean@email.com');
          if (!hasAdmin) {
            setDoc(doc(db, 'users', 'usr-admin'), INITIAL_USERS[0], { merge: true }).catch(() => {});
          }
          if (!hasJean) {
            const jean = INITIAL_USERS.find(u => u.email.toLowerCase() === 'jean@email.com');
            if (jean) {
              setDoc(doc(db, 'users', jean.id), jean, { merge: true }).catch(() => {});
            }
          }
          setUsers(loadedUsers);
        }
      }, (error) => {
        console.warn('Firestore users sync error:', error);
      });

      // 3. Live Reservations
      const reservationsCol = collection(db, 'reservations');
      unsubscribeReservations = onSnapshot(reservationsCol, async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_RESERVATIONS.forEach((res) => {
              batch.set(doc(db, 'reservations', res.id), res);
            });
            await batch.commit();
          } catch (err) {
            console.warn('Could not seed initial reservations:', err);
          }
        } else {
          const loadedRes: Reservation[] = [];
          const seenResIds = new Set<string>();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Partial<Reservation>;
            const rawId = data.id || docSnap.id || `res-${Math.random().toString(36).substring(2, 9)}`;
            let uniqueId = rawId;
            let counter = 1;
            while (seenResIds.has(uniqueId)) {
              uniqueId = `${rawId}-${counter}`;
              counter++;
            }
            seenResIds.add(uniqueId);
            loadedRes.push({
              ...(data as Reservation),
              id: uniqueId,
            });
          });

          // Guarantee Jean Dupont reservation exists in Firestore
          const hasJeanRes = loadedRes.some(r => r.userId === 'uid_firebase' || r.userEmail?.toLowerCase() === 'jean@email.com');
          if (!hasJeanRes) {
            const jeanRes = INITIAL_RESERVATIONS.find(r => r.userId === 'uid_firebase');
            if (jeanRes) {
              setDoc(doc(db, 'reservations', jeanRes.id), jeanRes, { merge: true }).catch(() => {});
            }
          }

          loadedRes.sort((a, b) => (b.reservedAt || 0) - (a.reservedAt || 0));
          setReservations(loadedRes);
        }
      }, (error) => {
        console.warn('Firestore reservations sync error:', error);
      });

      // 4. Live Settings (WhatsApp & Config)
      const settingsDoc = doc(db, 'settings', 'general');
      unsubscribeSettings = onSnapshot(settingsDoc, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.whatsappNumber) {
            setWhatsappNumberState(data.whatsappNumber);
          }
        }
      }, (error) => {
        console.warn('Firestore settings sync error:', error);
      });

    } catch (err) {
      console.warn('Firestore subscription error:', err);
      setIsCloudSyncing(false);
    }

    return () => {
      unsubscribeAccounts();
      unsubscribeUsers();
      unsubscribeReservations();
      unsubscribeSettings();
      unsubscribeAuth();
    };
  }, []);

  // Persist storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WHATSAPP, whatsappNumber);
  }, [whatsappNumber]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FRAME_MODE, JSON.stringify(mobileFrameMode));
  }, [mobileFrameMode]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  const t = (key: keyof typeof translations['fr'], params?: Record<string, string | number>) => {
    return translate(language, key, params);
  };

  // WhatsApp Link Generator
  const generateWhatsAppLink = (account: Account) => {
    const cleanPhone = whatsappNumber.replace(/[^0-9+]/g, '');
    const message = language === 'en'
      ? `Hello, I would like to rent ${account.name} for ${account.price.toLocaleString()} FCFA/month. Thank you!`
      : `Bonjour, je souhaite louer ${account.name} pour ${account.price.toLocaleString()} FCFA/mois. Merci !`;
    return `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
  };

  // Auth Operations (Strict Firebase Authentication + Firestore)
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!password) {
      return { success: false, error: 'Veuillez renseigner votre mot de passe.' };
    }

    if (!auth) {
      return { success: false, error: 'Service d\'authentification indisponible.' };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;
      const isAdmin = cleanEmail === 'moussawague062@gmail.com';
      const userObj: User = {
        id: fbUser.uid,
        name: fbUser.displayName || (isAdmin ? 'Moussa Wagué (Admin)' : cleanEmail.split('@')[0]),
        email: cleanEmail,
        role: isAdmin ? 'admin' : 'user',
        phoneNumber: isAdmin ? '+221 77 705 91 02' : undefined,
        createdAt: Date.now(),
      };
      setCurrentUser(userObj);
      setDoc(doc(db, 'users', fbUser.uid), userObj, { merge: true }).catch(() => {});
      showToast(t('loginSuccess'), 'success');
      return { success: true };
    } catch (authErr: any) {
      console.warn('Firebase Auth sign-in error:', authErr.code, authErr.message);
      if (authErr.code === 'auth/wrong-password' || authErr.code === 'auth/invalid-credential') {
        return { success: false, error: 'Email ou mot de passe incorrect.' };
      }
      if (authErr.code === 'auth/user-not-found') {
        return { success: false, error: 'Aucun compte trouvé avec cet email. Veuillez vous inscrire.' };
      }
      if (authErr.code === 'auth/too-many-requests') {
        return { success: false, error: 'Trop de tentatives échouées. Veuillez patienter avant de réessayer.' };
      }
      return { success: false, error: 'Erreur d\'authentification : ' + (authErr.message || 'identifiants invalides.') };
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === 'moussawague062@gmail.com';
    
    if (!password || password.length < 6) {
      return { success: false, error: 'Le mot de passe doit comporter au moins 6 caractères.' };
    }

    if (!auth) {
      return { success: false, error: 'Service d\'authentification indisponible.' };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      const newUser: User = {
        id: fbUser.uid,
        name: name.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: isAdmin ? 'admin' : 'user',
        phoneNumber: isAdmin ? '+221 77 705 91 02' : undefined,
        createdAt: Date.now(),
      };

      setUsers((prev) => [newUser, ...prev.filter(u => u.email !== cleanEmail)]);
      setCurrentUser(newUser);
      setDoc(doc(db, 'users', fbUser.uid), newUser, { merge: true }).catch(() => {});
      showToast(t('registerSuccess'), 'success');
      return { success: true };
    } catch (authErr: any) {
      console.warn('Firebase Auth createUser error:', authErr.code, authErr.message);
      if (authErr.code === 'auth/email-already-in-use') {
        return { success: false, error: 'Cet email est déjà enregistré. Veuillez vous connecter avec votre mot de passe.' };
      }
      if (authErr.code === 'auth/weak-password') {
        return { success: false, error: 'Le mot de passe doit comporter au moins 6 caractères.' };
      }
      return { success: false, error: 'Erreur d\'inscription : ' + (authErr.message || 'veuillez vérifier vos informations.') };
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setCurrentUser(null);
    if (activeTab === 'admin' || activeTab === 'profile') {
      setActiveTab('home');
    }
    showToast(t('logoutSuccess'), 'info');
  };

  // Account Operations (Admin) - Synchronized with Firestore
  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAcc: Account = {
      ...accountData,
      id: `acc-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setAccounts((prev) => [newAcc, ...prev]);
    setDoc(doc(db, 'accounts', newAcc.id), newAcc).catch((err) => {
      console.warn('Firestore addAccount error:', err);
    });
    showToast(t('accountSaved'), 'success');
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    const timestamp = Date.now();
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates, updatedAt: timestamp } : acc))
    );
    if (selectedAccount?.id === id) {
      setSelectedAccount((prev) => (prev ? { ...prev, ...updates, updatedAt: timestamp } : null));
    }
    setDoc(doc(db, 'accounts', id), { ...updates, updatedAt: timestamp }, { merge: true }).catch((err) => {
      console.warn('Firestore updateAccount error:', err);
    });
    showToast(t('accountSaved'), 'success');
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    if (selectedAccount?.id === id) {
      setSelectedAccount(null);
    }
    deleteDoc(doc(db, 'accounts', id)).catch((err) => {
      console.warn('Firestore deleteAccount error:', err);
    });
    showToast(t('deleteSuccess'), 'info');
  };

  const toggleAccountStatus = (id: string, newStatus: AccountStatus) => {
    const timestamp = Date.now();
    let slots = 0;
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          slots = newStatus === 'reserved' ? 0 : (acc.slotsTotal || 1);
          return {
            ...acc,
            status: newStatus,
            slotsAvailable: slots,
            updatedAt: timestamp,
          };
        }
        return acc;
      })
    );
    if (selectedAccount?.id === id) {
      setSelectedAccount((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              slotsAvailable: newStatus === 'reserved' ? 0 : (prev.slotsTotal || 1),
              updatedAt: timestamp,
            }
          : null
      );
    }
    setDoc(doc(db, 'accounts', id), {
      status: newStatus,
      slotsAvailable: slots,
      updatedAt: timestamp,
    }, { merge: true }).catch((err) => {
      console.warn('Firestore toggleAccountStatus error:', err);
    });
    showToast(t('statusUpdated'), 'success');
  };

  // Reservation Operation - Synchronized with Firestore
  const reserveAccount = (accountId: string): { success: boolean; error?: string } => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, error: t('mustBeLoggedInToReserve') };
    }

    const targetAccount = accounts.find((a) => a.id === accountId);
    if (!targetAccount) return { success: false, error: 'Account not found' };

    // Create reservation record
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      accountId: targetAccount.id,
      accountName: targetAccount.name,
      platform: targetAccount.platform,
      price: targetAccount.price,
      reservedAt: Date.now(),
      status: 'active',
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Save reservation to Firestore
    setDoc(doc(db, 'reservations', newReservation.id), newReservation).catch((err) => {
      console.warn('Firestore reservation creation error:', err);
    });

    // Update account status to reserved
    toggleAccountStatus(accountId, 'reserved');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore in environments without canvas
    }

    showToast(t('reserveSuccessMessage', { accountName: targetAccount.name }), 'success');
    return { success: true };
  };

  const handleSetWhatsappNumber = (num: string) => {
    setWhatsappNumberState(num);
    setDoc(doc(db, 'settings', 'general'), { whatsappNumber: num }, { merge: true }).catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        currentUser,
        users,
        login,
        register,
        logout,
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        toggleAccountStatus,
        reservations,
        reserveAccount,
        selectedAccount,
        setSelectedAccount,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        whatsappNumber,
        setWhatsappNumber: handleSetWhatsappNumber,
        generateWhatsAppLink,
        toasts,
        showToast,
        removeToast,
        mobileFrameMode,
        setMobileFrameMode,
        isCloudSyncing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Alias de compatibilité
export const useAppContext = useApp;
export { AppContext };
export default useApp;