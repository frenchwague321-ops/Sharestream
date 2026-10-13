import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, Language, Reservation, User, AccountFormData } from '../types';
import { INITIAL_ACCOUNTS, DEFAULT_WHATSAPP_NUMBER } from '../data/initialData';
import { translations } from '../data/translations';
import { 
  db, 
  auth, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '../firebase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['fr']) => string;
  accounts: Account[];
  reservations: Reservation[];
  currentUser: User | null;
  activeTab: 'home' | 'admin' | 'profile' | 'code';
  setActiveTab: (tab: 'home' | 'admin' | 'profile' | 'code') => void;
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  addAccount: (account: AccountFormData) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addReservation: (accountId: string) => void;
  deleteReservation: (id: string) => void;
  generateWhatsAppLink: (account: Account) => string;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Auth
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  users: User[];
  deleteUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sharestream_lang');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sharestream_lang', lang);
  };

  const t = (key: keyof typeof translations['fr']): string => {
    return translations[language][key] || translations['fr'][key] || key;
  };

  // Tab & Selection State
  const [activeTab, setActiveTab] = useState<'home' | 'admin' | 'profile' | 'code'>('home');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // WhatsApp Number
  const [whatsappNumber, setWhatsappNumberState] = useState<string>(() => {
    return localStorage.getItem('sharestream_phone') || DEFAULT_WHATSAPP_NUMBER;
  });

  const setWhatsappNumber = (num: string) => {
    setWhatsappNumberState(num);
    localStorage.setItem('sharestream_phone', num);
    if (db) {
      setDoc(doc(db, 'settings', 'general'), { whatsappNumber: num }, { merge: true }).catch(() => {});
    }
  };

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sharestream_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sharestream_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Accounts state with local fallback
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('sharestream_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ACCOUNTS;
      }
    }
    return INITIAL_ACCOUNTS;
  });

  // Reservations state with local fallback
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('sharestream_reservations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('sharestream_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('sharestream_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sharestream_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sharestream_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sharestream_users_list', JSON.stringify(users));
  }, [users]);

  // Firebase Realtime Subscriptions
  useEffect(() => {
    if (!db) return;

    // Accounts Realtime Sync
    const unsubAccounts = onSnapshot(
      collection(db, 'accounts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Account[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as Account);
          });
          setAccounts(loaded);
        } else {
          // Seed initial data if Firestore collection is empty
          INITIAL_ACCOUNTS.forEach((acc) => {
            const { id, ...data } = acc;
            addDoc(collection(db, 'accounts'), data).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Firestore accounts error, using local fallback:', err.message);
      }
    );

    // Reservations Realtime Sync
    const unsubReservations = onSnapshot(
      collection(db, 'reservations'),
      (snapshot) => {
        const loaded: Reservation[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as Reservation);
        });
        setReservations(loaded);
      },
      (err) => {
        console.warn('Firestore reservations error, using local fallback:', err.message);
      }
    );

    // Settings Realtime Sync
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.whatsappNumber) {
            setWhatsappNumberState(data.whatsappNumber);
          }
        }
      },
      (err) => {
        console.warn('Firestore settings error:', err.message);
      }
    );

    // Users Realtime Sync
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const loaded: User[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as User);
        });
        if (loaded.length > 0) {
          setUsers(loaded);
        }
      },
      (err) => {
        console.warn('Firestore users error:', err.message);
      }
    );

    return () => {
      unsubAccounts();
      unsubReservations();
      unsubSettings();
      unsubUsers();
    };
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const userEmail = fbUser.email?.toLowerCase() || '';
        const isAdmin = userEmail === 'moussawague062@gmail.com';
        const userObj: User = {
          id: fbUser.uid,
          name: fbUser.displayName || (isAdmin ? 'Moussa Wagué (Admin)' : userEmail.split('@')[0] || 'Utilisateur'),
          email: userEmail,
          role: isAdmin ? 'admin' : 'user',
          phoneNumber: isAdmin ? '+221 77 705 91 02' : undefined,
          createdAt: Date.now(),
        };
        setCurrentUser(userObj);
      } else {
        // If logged out from Firebase
        if (currentUser && currentUser.id !== 'admin-fallback-1') {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Account Operations
  const addAccount = (accountData: AccountFormData) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      slotsAvailable: accountData.slotsAvailable ?? 5,
      slotsTotal: accountData.slotsTotal ?? 5,
      features: accountData.features || ['4K UHD', 'Multi-écrans', 'Garantie 30j'],
    };

    setAccounts((prev) => [newAccount, ...prev]);

    if (db) {
      const { id, ...data } = newAccount;
      addDoc(collection(db, 'accounts'), data)
        .then((docRef) => {
          setAccounts((prev) =>
            prev.map((acc) => (acc.id === newAccount.id ? { ...acc, id: docRef.id } : acc))
          );
        })
        .catch(() => {});
    }

    showToast(t('addAccountSuccess'), 'success');
  };

  const updateAccount = (id: string, accountData: Partial<Account>) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...accountData } : acc))
    );

    if (db) {
      updateDoc(doc(db, 'accounts', id), accountData).catch(() => {});
    }

    showToast(t('updateAccountSuccess'), 'success');
  };

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));

    if (db) {
      deleteDoc(doc(db, 'accounts', id)).catch(() => {});
    }

    showToast(t('deleteAccountSuccess'), 'info');
  };

  // Reservation Operations
  const addReservation = (accountId: string) => {
    const targetAccount = accounts.find((a) => a.id === accountId);
    if (!targetAccount) return;

    const newRes: Reservation = {
      id: Date.now().toString(),
      accountId: targetAccount.id,
      accountName: targetAccount.name,
      platform: targetAccount.platform,
      userEmail: currentUser?.email || 'visiteur@sharestream.app',
      userName: currentUser?.name || 'Visiteur WhatsApp',
      date: new Date().toISOString(),
      status: 'pending',
    };

    setReservations((prev) => [newRes, ...prev]);

    // Decrement slot or mark reserved
    const newSlots = Math.max(0, (targetAccount.slotsAvailable || 1) - 1);
    updateAccount(accountId, {
      slotsAvailable: newSlots,
      status: newSlots === 0 ? 'reserved' : targetAccount.status,
    });

    if (db) {
      const { id, ...data } = newRes;
      addDoc(collection(db, 'reservations'), data).catch(() => {});
    }

    showToast(t('reservationSuccess'), 'success');
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    if (db) {
      deleteDoc(doc(db, 'reservations', id)).catch(() => {});
    }
    showToast('Réservation annulée', 'info');
  };

  // WhatsApp Link Generator
  const generateWhatsAppLink = (account: Account): string => {
    const cleanPhone = whatsappNumber.replace(/[^0-9+]/g, '') || DEFAULT_WHATSAPP_NUMBER;
    const message = language === 'en'
      ? `Hello, I would like to rent ${account.name} for ${account.price.toLocaleString()} FCFA/month. Thank you!`
      : `Bonjour, je souhaite louer ${account.name} pour ${account.price.toLocaleString()} FCFA/mois. Merci !`;
    return `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
  };

  // Auth Operations (Strict Firebase Authentication + Firestore)
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
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
    const cleanEmail = (email || '').trim().toLowerCase();
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
        name: (name || '').trim() || cleanEmail.split('@')[0],
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
        return { success: false, error: 'Cet email est déjà utilisé. Veuillez vous connecter.' };
      }
      if (authErr.code === 'auth/invalid-email') {
        return { success: false, error: 'Format d\'adresse email invalide.' };
      }
      if (authErr.code === 'auth/weak-password') {
        return { success: false, error: 'Mot de passe trop faible. Utilisez au moins 6 caractères.' };
      }
      return { success: false, error: 'Erreur à l\'inscription : ' + (authErr.message || 'veuillez réessayer.') };
    }
  };

  const logout = () => {
    if (auth) {
      signOut(auth).catch(() => {});
    }
    setCurrentUser(null);
    setActiveTab('home');
    showToast(t('logoutSuccess'), 'info');
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (db) {
      deleteDoc(doc(db, 'users', userId)).catch(() => {});
    }
    showToast('Utilisateur supprimé', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        accounts,
        reservations,
        currentUser,
        activeTab,
        setActiveTab,
        selectedAccount,
        setSelectedAccount,
        whatsappNumber,
        setWhatsappNumber,
        addAccount,
        updateAccount,
        deleteAccount,
        addReservation,
        deleteReservation,
        generateWhatsAppLink,
        toasts,
        showToast,
        removeToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,
        users,
        deleteUser,
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

// Aliases for compatibility
export { AppContext };
export default AppContext;