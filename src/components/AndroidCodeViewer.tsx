import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STANDALONE_FILES } from '../data/standaloneFiles';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  Download, 
  FolderTree, 
  Smartphone,
  Layers,
  Sparkles
} from 'lucide-react';

export const AndroidCodeViewer: React.FC = () => {
  const { showToast, whatsappNumber } = useApp();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = STANDALONE_FILES[selectedFileIndex] || STANDALONE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    showToast(`Code copié : ${activeFile.name}`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Fichier téléchargé : ${activeFile.name}`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      
      {/* En-tête de Présentation Technique */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-[#16161D] to-[#0A0A0C] border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] tracking-tight">
              Architecture & Code Source Standalone
            </h2>
            <p className="text-xs text-gray-400">
              Code source complet pour le déploiement HTML/JS autonome ou l'intégration Android Kotlin MVVM.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger</span>
          </button>
        </div>
      </div>

      {/* Explorateur de Fichiers & Visionneuse de Code */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Liste des Fichiers Disponibles */}
        <div className="lg:col-span-1 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Fichiers du projet
          </h4>
          <div className="space-y-1">
            {STANDALONE_FILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  selectedFileIndex === idx
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#16161D] text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">
                  {file.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Visionneuse avec coloration syntaxique */}
        <div className="lg:col-span-3 rounded-3xl bg-[#0B0B0E] border border-gray-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="px-4 py-3 bg-[#121217] border-b border-gray-800 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span className="text-white font-semibold">{activeFile.path || activeFile.name}</span>
            <span>{activeFile.content.split('\n').length} lignes</span>
          </div>

          <pre className="p-5 overflow-x-auto text-xs font-mono leading-relaxed text-gray-300 max-h-[600px] scrollbar-none">
            <code>{activeFile.content}</code>
          </pre>
        </div>

      </div>

    </div>
  );
};