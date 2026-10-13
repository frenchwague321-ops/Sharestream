import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    register,
    t,
    language,
    setActiveTab
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const validateEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((str || '').trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!validateEmail(email)) {
      setError(t('errInvalidEmail'));
      return;
    }

    if ((password || '').length < 6) {
      setError(t('errPasswordLength'));
      return;
    }

    if (!isLogin && !(name || '').trim()) {
      setError(t('errNameRequired'));
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          setIsAuthModalOpen(false);
          setActiveTab('home');
        } else {
          setError(res.error || 'Erreur lors de la connexion.');
        }
      } else {
        const res = await register(name, email, password);
        if (res.success) {
          setIsAuthModalOpen(false);
          setActiveTab('home');
        } else {
          setError(res.error || "Erreur lors de l'inscription.");
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0F0F12] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp"
      >
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {isLogin ? t('loginTitle') : t('registerTitle')}
          </h2>
          
          <p className="text-xs text-gray-400">
            {isLogin 
              ? 'Accédez à vos abonnements et réservations personnalisées' 
              : 'Créez votre compte pour réserver des accès streaming à prix solidaire'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-300">
                {t('nameLabel')} *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="auth-name-input"
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Moussa Wagué"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-300">
              {t('emailLabel')} *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@exemple.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-300">
                {t('passwordLabel')} *
              </label>
              <span className="text-[10px] text-gray-500">Min. 6 caractères</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="auth-password-input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all mt-2 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{isLogin ? t('loginButton') : t('registerButton')}</span>
            )}
          </button>

        </form>

        {/* Toggle Login / Register */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-gray-800/80">
          {isLogin ? (
            <p>
              Pas encore de compte ?{' '}
              <button
                onClick={() => {
                  setError(null);
                  setAuthModalMode('register');
                }}
                className="text-blue-400 font-bold hover:underline"
              >
                Inscrivez-vous gratuitement
              </button>
            </p>
          ) : (
            <p>
              Déjà inscrit ?{' '}
              <button
                onClick={() => {
                  setError(null);
                  setAuthModalMode('login');
                }}
                className="text-blue-400 font-bold hover:underline"
              >
                Connectez-vous ici
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};