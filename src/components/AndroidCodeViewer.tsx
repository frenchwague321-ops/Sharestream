import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STANDALONE_FILES } from '../data/standaloneFiles';
import { 
  Code2, 
  Copy, 
  Check, 
  FolderTree, 
  FileCode, 
  Smartphone, 
  Layers, 
  Flame, 
  Terminal,
  ExternalLink,
  Globe,
  Download
} from 'lucide-react';

export const AndroidCodeViewer: React.FC = () => {
  const { t, showToast } = useApp();
  const [projectType, setProjectType] = useState<'pwa' | 'android'>('pwa');
  const [selectedFile, setSelectedFile] = useState<string>('index.html');
  const [copied, setCopied] = useState(false);

  const files: Record<string, { lang: string; path: string; code: string; icon: string }> = {
    'Reservation.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/sharestream/app/data/model/Reservation.kt',
      icon: 'kt',
      code: `package com.sharestream.app.data.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.PropertyName

/**
 * Modèle de données Firestore pour les réservations
 * Collection : "reservations"
 * 
 * JSON Schema :
 * {
 *   "id": "auto",
 *   "userId": "uid_firebase",
 *   "accountId": "id_account",
 *   "accountName": "Netflix Premium",
 *   "reservedAt": timestamp,
 *   "status": "active" // ou "ended"
 * }
 */
data class Reservation(
    @DocumentId
    val id: String = "",
    
    val userId: String = "",
    val accountId: String = "",
    val accountName: String = "",
    
    val reservedAt: Timestamp = Timestamp.now(),
    
    @PropertyName("status")
    val status: String = STATUS_ACTIVE // "active" ou "ended"
) {
    val isActive: Boolean
        get() = status.equals(STATUS_ACTIVE, ignoreCase = true)
        
    val isEnded: Boolean
        get() = status.equals(STATUS_ENDED, ignoreCase = true)

    companion object {
        const val STATUS_ACTIVE = "active"
        const val STATUS_ENDED = "ended"
    }
}`
    },

    'Account.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/sharestream/app/data/model/Account.kt',
      icon: 'kt',
      code: `package com.sharestream.app.data.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.PropertyName

/**
 * Modèle de données Firestore pour les comptes de streaming
 * Collection : "accounts"
 */
data class Account(
    @DocumentId
    val id: String = "",
    
    val name: String = "",
    val platform: String = "",
    val price: Long = 0L, // Prix mensuel en FCFA
    val description: String = "",
    
    @PropertyName("status")
    val status: String = STATUS_AVAILABLE, // "available" ou "reserved"
    
    val imageUrl: String = "",
    val quality: String = "4K UHD",
    val profilesCount: Int = 5,
    
    val createdAt: Timestamp = Timestamp.now(),
    val updatedAt: Timestamp = Timestamp.now()
) {
    val isAvailable: Boolean
        get() = status.equals(STATUS_AVAILABLE, ignoreCase = true)
        
    val isReserved: Boolean
        get() = status.equals(STATUS_RESERVED, ignoreCase = true)

    companion object {
        const val STATUS_AVAILABLE = "available"
        const val STATUS_RESERVED = "reserved"
    }
}`
    },

    'AccountRepository.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/sharestream/app/data/repository/AccountRepository.kt',
      icon: 'kt',
      code: `package com.sharestream.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.snapshots
import com.sharestream.app.data.model.Account
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AccountRepository @Inject constructor(
    private val firestore: FirebaseFirestore
) {
    private val accountsCollection = firestore.collection("accounts")

    /**
     * Flux en temps réel des comptes streaming avec tri
     */
    fun getAccountsFlow(sortByPriceAsc: Boolean? = null): Flow<List<Account>> {
        var query: Query = accountsCollection.orderBy("createdAt", Query.Direction.DESCENDING)
        
        if (sortByPriceAsc != null) {
            query = accountsCollection.orderBy(
                "price", 
                if (sortByPriceAsc) Query.Direction.ASCENDING else Query.Direction.DESCENDING
            )
        }

        return query.snapshots().map { snapshot ->
            snapshot.toObjects(Account::class.java)
        }
    }

    suspend fun addAccount(account: Account): Result<String> = runCatching {
        val docRef = accountsCollection.add(account).await()
        docRef.id
    }

    suspend fun updateAccount(account: Account): Result<Unit> = runCatching {
        accountsCollection.document(account.id).set(account).await()
    }

    suspend fun toggleStatus(accountId: String, newStatus: String): Result<Unit> = runCatching {
        accountsCollection.document(accountId)
            .update("status", newStatus, "updatedAt", com.google.firebase.Timestamp.now())
            .await()
    }

    suspend fun deleteAccount(accountId: String): Result<Unit> = runCatching {
        accountsCollection.document(accountId).delete().await()
    }
}`
    },

    'AccountViewModel.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/sharestream/app/ui/viewmodel/AccountViewModel.kt',
      icon: 'kt',
      code: `package com.sharestream.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.sharestream.app.data.model.Account
import com.sharestream.app.data.repository.AccountRepository
import com.sharestream.app.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface AccountsUiState {
    object Loading : AccountsUiState
    data class Success(val accounts: List<Account>) : AccountsUiState
    data class Error(val message: String) : AccountsUiState
}

@HiltViewModel
class AccountViewModel @Inject constructor(
    private val accountRepository: AccountRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _selectedFilter = MutableStateFlow("Tous")
    val selectedFilter: StateFlow<String> = _selectedFilter.asStateFlow()

    private val _sortAscending = MutableStateFlow<Boolean?>(null)
    val sortAscending: StateFlow<Boolean?> = _sortAscending.asStateFlow()

    val uiState: StateFlow<AccountsUiState> = combine(
        accountRepository.getAccountsFlow(),
        _selectedFilter,
        _sortAscending
    ) { allAccounts, filter, sortAsc ->
        var filtered = if (filter == "Tous") {
            allAccounts
        } else if (filter == "Autres") {
            allAccounts.filter { it.platform !in listOf("Netflix", "Spotify", "Disney+") }
        } else {
            allAccounts.filter { it.platform.equals(filter, ignoreCase = true) }
        }

        if (sortAsc != null) {
            filtered = if (sortAsc) filtered.sortedBy { it.price } else filtered.sortedByDescending { it.price }
        }

        AccountsUiState.Success(filtered)
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = AccountsUiState.Loading
    )

    fun setFilter(filter: String) {
        _selectedFilter.value = filter
    }

    fun setSort(ascending: Boolean?) {
        _sortAscending.value = ascending
    }

    fun markReserved(accountId: String) = viewModelScope.launch {
        accountRepository.toggleStatus(accountId, Account.STATUS_RESERVED)
    }

    fun markAvailable(accountId: String) = viewModelScope.launch {
        accountRepository.toggleStatus(accountId, Account.STATUS_AVAILABLE)
    }

    fun deleteAccount(accountId: String) = viewModelScope.launch {
        accountRepository.deleteAccount(accountId)
    }
}`
    },

    'WhatsAppHelper.kt': {
      lang: 'kotlin',
      path: 'app/src/main/java/com/sharestream/app/util/WhatsAppHelper.kt',
      icon: 'kt',
      code: `package com.sharestream.app.util

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import com.sharestream.app.data.model.Account
import java.net.URLEncoder

object WhatsAppHelper {
    
    // Numéro WhatsApp de support (Modifiable)
    const val DEFAULT_WHATSAPP_PHONE = "+221777059102"

    /**
     * Ouvre WhatsApp avec le message pré-rempli officiel
     * "Bonjour, je souhaite louer [nom du compte] pour [prix] FCFA/mois. Merci !"
     */
    fun openWhatsAppChat(
        context: Context,
        account: Account,
        phoneNumber: String = DEFAULT_WHATSAPP_PHONE
    ) {
        val cleanPhone = phoneNumber.replace("+", "").replace(" ", "")
        val rawMessage = "Bonjour, je souhaite louer \${account.name} pour \${account.price} FCFA/mois. Merci !"
        val encodedMessage = URLEncoder.encode(rawMessage, "UTF-8")
        
        val uri = Uri.parse("https://wa.me/\$cleanPhone?text=\$encodedMessage")
        val intent = Intent(Intent.ACTION_VIEW, uri)

        try {
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(
                context,
                "WhatsApp n'est pas installé sur cet appareil.",
                Toast.LENGTH_SHORT
            ).show()
        }
    }
}`
    },

    'strings.xml (FR)': {
      lang: 'xml',
      path: 'app/src/main/res/values-fr/strings.xml',
      icon: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Nom de l'application -->
    <string name="app_name">ShareStream</string>
    <string name="app_tagline">Location &amp; partage de comptes streaming</string>

    <!-- Filtres -->
    <string name="filter_all">Tous</string>
    <string name="filter_netflix">Netflix</string>
    <string name="filter_spotify">Spotify</string>
    <string name="filter_disney">Disney+</string>
    <string name="filter_others">Autres</string>

    <!-- Tri -->
    <string name="sort_price_asc">Prix croissant</string>
    <string name="sort_price_desc">Prix décroissant</string>

    <!-- Statuts -->
    <string name="status_available">Disponible</string>
    <string name="status_reserved">Réservé</string>

    <!-- Boutons & Actions -->
    <string name="btn_contact_whatsapp">Contacter sur WhatsApp</string>
    <string name="btn_rent_now">Louer maintenant</string>
    <string name="btn_admin">Administration</string>
    <string name="btn_mark_reserved">Marquer réservé</string>
    <string name="btn_mark_available">Marquer disponible</string>
    <string name="btn_add_account">Ajouter un compte</string>
    <string name="btn_delete">Supprimer</string>

    <!-- Message WhatsApp Pré-rempli -->
    <string name="whatsapp_message_template">Bonjour, je souhaite louer %1$s pour %2$d FCFA/mois. Merci !</string>
</resources>`
    },

    'strings.xml (EN)': {
      lang: 'xml',
      path: 'app/src/main/res/values/strings.xml',
      icon: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- App Name -->
    <string name="app_name">ShareStream</string>
    <string name="app_tagline">Trusted streaming account rentals</string>

    <!-- Filters -->
    <string name="filter_all">All</string>
    <string name="filter_netflix">Netflix</string>
    <string name="filter_spotify">Spotify</string>
    <string name="filter_disney">Disney+</string>
    <string name="filter_others">Others</string>

    <!-- Sorting -->
    <string name="sort_price_asc">Price: Low to High</string>
    <string name="sort_price_desc">Price: High to Low</string>

    <!-- Statuses -->
    <string name="status_available">Available</string>
    <string name="status_reserved">Reserved</string>

    <!-- Actions -->
    <string name="btn_contact_whatsapp">Contact on WhatsApp</string>
    <string name="btn_rent_now">Rent now</string>
    <string name="btn_admin">Administration</string>
    <string name="btn_mark_reserved">Mark Reserved</string>
    <string name="btn_mark_available">Mark Available</string>
    <string name="btn_add_account">Add an account</string>
    <string name="btn_delete">Delete</string>

    <!-- WhatsApp Pre-filled message -->
    <string name="whatsapp_message_template">Hello, I would like to rent %1$s for %2$d FCFA/month. Thank you!</string>
</resources>`
    }
  };

  const currentFilesMap = projectType === 'pwa' ? STANDALONE_FILES : files;
  const currentFileData = currentFilesMap[selectedFile] || (projectType === 'pwa' ? STANDALONE_FILES['index.html'] : files['Account.kt']);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFileData.code);
    setCopied(true);
    showToast('Code source copié !', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSwitchProject = (type: 'pwa' | 'android') => {
    setProjectType(type);
    setSelectedFile(type === 'pwa' ? 'index.html' : 'Account.kt');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* Project Architecture Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-[#16161D] border border-gray-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSwitchProject('pwa')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              projectType === 'pwa'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>PWA Standalone (HTML / JS / CSS)</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 text-[10px]">8 fichiers</span>
          </button>

          <button
            onClick={() => handleSwitchProject('android')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              projectType === 'android'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Natif (Kotlin MVVM)</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 text-[10px]">6 fichiers</span>
          </button>
        </div>

        {projectType === 'pwa' && (
          <a
            href="/standalone/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-gray-700 transition-all ml-auto"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Tester la PWA Standalone</span>
          </a>
        )}
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#0F0F12] border border-gray-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            {projectType === 'pwa' ? <Globe className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {projectType === 'pwa' ? 'Structure PWA Standalone (Production)' : 'Code Source Android Kotlin (MVVM)'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                {projectType === 'pwa' ? 'Zero Build Tool' : 'SDK API 26+'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {projectType === 'pwa'
                ? 'Projet pur HTML5, CSS3, JS ES6, Service Worker PWA et Cloud Firestore prêt pour Firebase Hosting.'
                : 'Architecture native Kotlin avec Firebase Firestore, Auth, Storage, Coroutines & Strings bilingues.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyCode}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-95"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copié !' : 'Copier ce fichier'}</span>
        </button>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* File Tree Explorer */}
        <div className="p-4 rounded-2xl bg-[#16161D] border border-gray-800 space-y-3 lg:col-span-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-800">
            <FolderTree className="w-4 h-4 text-blue-400" />
            <span>{projectType === 'pwa' ? 'Fichiers Standalone (/)' : 'Fichiers Android'}</span>
          </div>

          <div className="space-y-1">
            {Object.keys(currentFilesMap).map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedFile(filename)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                  selectedFile === filename
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <FileCode className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{filename}</span>
              </button>
            ))}
          </div>

          {/* Architecture Summary Info */}
          <div className="mt-6 pt-4 border-t border-gray-800 space-y-2 text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Stack Technique</span>
            </div>
            {projectType === 'pwa' ? (
              <ul className="space-y-1 list-disc list-inside text-gray-400">
                <li>HTML5 sémantique & responsive</li>
                <li>CSS3 moderne (Variables & Glass)</li>
                <li>ES6 Modules & Firebase SDK v10</li>
                <li>Service Worker Cache Hors-ligne</li>
                <li>Dictionnaire bilingue FR / EN</li>
                <li>Déploiement Firebase Hosting</li>
              </ul>
            ) : (
              <ul className="space-y-1 list-disc list-inside text-gray-400">
                <li>Kotlin 1.9+ & Coroutines Flow</li>
                <li>Firebase Firestore & Auth</li>
                <li>Jetpack Compose UI</li>
                <li>Dagger Hilt Dependency Injection</li>
                <li>Architecture MVVM Unidirectional</li>
              </ul>
            )}
          </div>
        </div>

        {/* Code Content View */}
        <div className="rounded-2xl bg-[#0A0A0C] border border-gray-800 overflow-hidden lg:col-span-3 flex flex-col shadow-2xl">
          
          {/* File Path Header */}
          <div className="px-5 py-3 bg-[#0F0F12] border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-300 truncate">
              {currentFileData.path}
            </span>
            <span className="text-[11px] uppercase font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-600/10 border border-blue-500/20">
              {currentFileData.lang}
            </span>
          </div>

          {/* Code Block */}
          <div className="p-5 overflow-x-auto font-mono text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#0A0A0C] flex-1">
            <pre>
              <code>{currentFileData.code}</code>
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};