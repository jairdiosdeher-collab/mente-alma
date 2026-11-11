import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 rounded-lg hover:bg-emerald-900/60 transition whitespace-nowrap shrink-0"
        title="Instalar como aplicación nativa en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App PWA</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700 rounded-lg hover:bg-slate-700 transition whitespace-nowrap shrink-0"
        >
          <Share2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-white">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Instalar PastoralMente en iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <p>Para una experiencia clínica de pantalla completa sin barras de navegador:</p>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-teal-400 font-bold">1.</span>
                    <span>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en la barra inferior de Safari.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-teal-400 font-bold">2.</span>
                    <span>Desplaza hacia abajo y selecciona <strong>«Agregar a Inicio»</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-teal-400 font-bold">3.</span>
                    <span>Toca <strong>«Agregar»</strong> en la esquina superior derecha.</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">PastoralMente funcionará con persistencia de datos local offline segura.</p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-semibold text-white transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
