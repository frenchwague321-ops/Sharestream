import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    setActiveTab,
    login, 
    register, 
    t
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const validateEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!validateEmail(email)) {
      setError(t('errInvalidEmail'));
      return;
    }

    if (password.length < 6) {
      setError(t('errPasswordLength'));
      return;
    }

    if (!isLogin && !name.trim()) {
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
          setError(res.error || t('errLoginFailed'));
        }
      } else {
        const res = await register(name, email, password);
        if (res.success) {
          setIsAuthModalOpen(false);
          setActiveTab('home');
        } else {
          setError(res.error || 'Erreur lors de la création du compte.');
        }
      }
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-md bg-[#0F0F12] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8"
      >
        {/* Close button */}
        <button
          id="close-auth-modal-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
            {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
            {isLogin ? t('authTitleLogin') : t('authTitleRegister')}
          </h3>
          <p className="text-xs text-gray-400">
            {isLogin ? t('authSubtitleLogin') : t('authSubtitleRegister')}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-[#0A0A0C] p-1 rounded-xl border border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              isLogin 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('navLogin')}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              !isLogin 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('navRegister')}
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Sign Up only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                {t('inputName')} *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('inputNamePlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
              {t('inputEmail')} *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('inputEmailPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
              {t('inputPassword')} *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('inputPasswordPlaceholder')}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : isLogin ? t('btnLoginSubmit') : t('btnRegisterSubmit')}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 pt-5 border-t border-gray-800 text-center">
          <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Authentification sécurisée par Firebase Auth & chiffrement TLS</span>
          </p>
        </div>

      </div>
    </div>
  );
};