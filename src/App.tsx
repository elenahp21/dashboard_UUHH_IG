import React, { useState, useEffect } from 'react';
import { UnitData, UnitId } from './types';
import DashboardView from './components/DashboardView';
import UnitForm from './components/UnitForm';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  RotateCcw, 
  Trash2, 
  Calendar, 
  Clock, 
  FileDown, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { toPng } from 'html-to-image';

// Default mock values matching the reference image precisely
const DEFAULT_UNITS: UnitData[] = [
  {
    id: 'UH1',
    name: 'Unitat d\'Hospitalització 1',
    ingressats: 35,
    quedenAvui: 30,
    altes: 1,
    pases: 1,
    recMitja: 0,
    recElevat: 0,
    barthelMitja: 40.31,
    traqueo: 2,
    vm: 1,
    pulseraErrant: 0,
    pacientPostQuirurgic: 0,
  },
  {
    id: 'UH2',
    name: 'Unitat d\'Hospitalització 2',
    ingressats: 13,
    quedenAvui: 13,
    altes: 0,
    pases: 0,
    recMitja: 1,
    recElevat: 0,
    barthelMitja: 30.76,
    traqueo: 0,
    vm: 0,
    pulseraErrant: 0,
    pacientPostQuirurgic: 0,
  },
  {
    id: 'UH4',
    name: 'Unitat d\'Hospitalització 4',
    ingressats: 35,
    quedenAvui: 32,
    altes: 0,
    pases: 3,
    recMitja: 0,
    recElevat: 0,
    barthelMitja: 37.57,
    traqueo: 4,
    vm: 2,
    pulseraErrant: 1,
    pacientPostQuirurgic: 0,
  },
  {
    id: 'UH5',
    name: 'Unitat d\'Hospitalització 5',
    ingressats: 29,
    quedenAvui: 28,
    altes: 1,
    pases: 0,
    recMitja: 1,
    recElevat: 0,
    barthelMitja: 42.59,
    traqueo: 1,
    vm: 0,
    pulseraErrant: 1,
    pacientPostQuirurgic: 0,
  },
];

export default function App() {
  const [units, setUnits] = useState<UnitData[]>(() => {
    const saved = localStorage.getItem('guttmann_guardia_units');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading units from localStorage, using defaults', e);
      }
    }
    return DEFAULT_UNITS;
  });

  // Calculate default next Friday date
  const getNextFridayString = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 5 is Friday
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7; // if today is Friday, get next Friday (7 days)
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    
    return nextFriday.toISOString().split('T')[0];
  };

  const [shiftDate, setShiftDate] = useState<string>(() => {
    const savedDate = localStorage.getItem('guttmann_guardia_date');
    return savedDate || getNextFridayString();
  });

  const [activeFormUnit, setActiveFormUnit] = useState<UnitId>('UH1');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('guttmann_guardia_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('guttmann_guardia_date', shiftDate);
  }, [shiftDate]);

  // Format date to Catalan text: e.g. "Divendres, 26 de juny de 2026"
  const getFormattedDateCatalan = () => {
    if (!shiftDate) return '';
    const dateObj = new Date(shiftDate);
    return dateObj.toLocaleDateString('ca-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUnitChange = (updatedUnit: UnitData) => {
    setUnits(prev => prev.map(u => u.id === updatedUnit.id ? updatedUnit : u));
  };

  const handleReset = () => {
    if (window.confirm('Segur que vols restablir les dades de prova inicials? Això sobreescriurà els canvis actuals.')) {
      setUnits(DEFAULT_UNITS);
      setShiftDate(getNextFridayString());
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Segur que vols buidar totes les dades assistencials per començar de zero?')) {
      const cleared = units.map(u => ({
        ...u,
        ingressats: 0,
        quedenAvui: 0,
        altes: 0,
        pases: 0,
        recMitja: 0,
        recElevat: 0,
        barthelMitja: 50, // neutral mid point
        traqueo: 0,
        vm: 0,
        pulseraErrant: 0,
        pacientPostQuirurgic: 0,
      }));
      setUnits(cleared);
    }
  };

  const downloadDashboardImage = async () => {
    const captureArea = document.getElementById('hospital-dashboard-capture-area');
    if (!captureArea) return;

    setIsExporting(true);
    setExportStatus('idle');

    // Give a small breathing room for any visual states
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Use html-to-image to bypass html2canvas oklab/oklch parser errors
      const imgData = await toPng(captureArea, {
        quality: 1.0,
        pixelRatio: 2, // Double resolution for ultra high crispness
        backgroundColor: '#f8fafc',
        cacheBust: true,
      });

      const downloadLink = document.createElement('a');
      const formattedDateName = shiftDate.replace(/-/g, '_');
      downloadLink.download = `Estat_Unitats_Guttmann_${formattedDateName}.png`;
      downloadLink.href = imgData;
      
      // Crucial for secure sandboxed iframe downloads
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 4000);
    } catch (err) {
      console.error('Error generating the dashboard snapshot:', err);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" id="app-root-container">
      {/* Upper Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 shadow-xs" id="app-nav-bar">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4" id="nav-inner-container">
          <div className="flex items-center gap-3" id="nav-brand-title">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20" id="nav-logo-box">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none">Aplicació de Gestió</span>
              <h1 className="text-lg font-black text-slate-800 leading-tight">Guttmann Hospital de Neurorehabilitació</h1>
            </div>
          </div>

          {/* Quick global action buttons */}
          <div className="flex items-center gap-3 flex-wrap" id="nav-action-buttons">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition rounded-xl cursor-pointer"
              title="Restablir dades de l'exemple"
              id="btn-global-reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablir Exemple</span>
            </button>
            
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition rounded-xl cursor-pointer"
              title="Netejar totes les dades de les unitats"
              id="btn-global-clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Buidar Dades</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 lg:px-6" id="app-main-workspace">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="app-workspace-grid">
          
          {/* LEFT COLUMN: The Interactive Input / Control Panel */}
          <section className="lg:col-span-4 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs" id="app-editor-section">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider mb-1" id="editor-tag">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Panell de control d'entrada</span>
              </div>
              <h2 className="text-xl font-black text-slate-800" id="editor-heading">Introducció de dades</h2>
              <p className="text-xs text-slate-400 mt-1">
                Afegeix o modifica l'estat assistencial de cada unitat. El resum visual de la dreta s'actualitzarà a l'instant.
              </p>
            </div>

            {/* Date Configuration Form */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2.5" id="editor-date-box">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Data del Resum (Cap de Setmana o Festiu)
              </label>
              <input
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                id="editor-date-picker"
              />
              <p className="text-[10px] text-slate-400 font-medium">
                S'utilitza habitualment la data del divendres de sortida on s'envia el resum de cap de setmana.
              </p>
            </div>

            {/* Unit Accordion Selectors */}
            <div className="space-y-2.5" id="editor-accordions-group">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Selecció d'Unitat per editar</label>
              
              {units.map((unit) => {
                const isSelected = activeFormUnit === unit.id;
                const activeIndicatorsCount = (unit.recMitja > 0 || unit.recElevat > 0 ? 1 : 0) + (unit.pulseraErrant > 0 ? 1 : 0) + (unit.traqueo > 0 ? 1 : 0) + (unit.vm > 0 ? 1 : 0);
                
                return (
                  <div 
                    key={unit.id} 
                    className={`rounded-xl border transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 shadow-md shadow-blue-500/5 bg-white' 
                        : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                    id={`accordion-wrapper-${unit.id}`}
                  >
                    {/* Header trigger button */}
                    <button
                      onClick={() => setActiveFormUnit(unit.id)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold cursor-pointer"
                      id={`btn-accordion-trigger-${unit.id}`}
                    >
                      <div className="flex items-center gap-2.5" id={`trigger-left-${unit.id}`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                        <span className="text-sm font-black text-slate-700">{unit.id}</span>
                        <span className="text-xs font-semibold text-slate-400">• {unit.ingressats} Ingressats</span>
                        
                        {activeIndicatorsCount > 0 && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                            {activeIndicatorsCount} Alertes
                          </span>
                        )}
                      </div>
                      
                      {isSelected ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* Expandable Form Body */}
                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                          id={`accordion-content-box-${unit.id}`}
                        >
                          <div className="p-3 border-t border-slate-100 bg-white rounded-b-xl" id={`accordion-content-${unit.id}`}>
                            <UnitForm 
                              unit={unit} 
                              onChange={handleUnitChange} 
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            
            {/* Guide Tip card */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 flex gap-2.5" id="editor-tip-box">
              <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <span className="font-bold block mb-0.5">Dades Persistents</span>
                <p className="text-blue-700 leading-relaxed">
                  Tots els valors que introdueixis es guarden automàticament al teu navegador. Pots tancar la pestanya i tornar demà sense perdre cap dada assistencial.
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: The Visual Live-Preview and Image Exporter */}
          <section className="lg:col-span-8 space-y-6" id="app-preview-section">
            
            {/* Download and Share Controller card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="export-card">
              <div>
                <h3 className="text-lg font-black flex items-center gap-1.5" id="export-title">
                  <FileDown className="w-5 h-5 stroke-[2.5]" />
                  Descarrega el Resum
                </h3>
                <p className="text-xs text-blue-100 mt-1 max-w-md">
                  Genera una imatge PNG d'alta qualitat llesta per a ser enviada per email o missatgeria als professionals de cap de setmana cada divendres.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto" id="export-controls">
                <button
                  onClick={downloadDashboardImage}
                  disabled={isExporting}
                  className={`px-5 py-3 rounded-xl font-bold text-sm shadow-md cursor-pointer transition flex items-center justify-center gap-2 active:scale-95 ${
                    isExporting 
                      ? 'bg-blue-400 text-white cursor-not-allowed' 
                      : 'bg-white text-blue-700 hover:bg-slate-50'
                  }`}
                  id="btn-export-download"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                      <span>Generant imatge...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Descarrega en PNG</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Export Success or Error Banners */}
            <AnimatePresence>
              {exportStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2.5 font-semibold shadow-xs"
                  id="export-banner-success"
                >
                  <Check className="w-5 h-5 text-emerald-600 stroke-[2.5] shrink-0" />
                  <div>
                    <span className="font-bold block">Imatge descarregada correctament!</span>
                    <span>Ja pots obrir la imatge o enviar-la per correu o serveis de xat als professionals assistencials.</span>
                  </div>
                </motion.div>
              )}

              {exportStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center gap-2.5 font-semibold shadow-xs"
                  id="export-banner-error"
                >
                  <AlertCircle className="w-5 h-5 text-rose-600 stroke-[2.5] shrink-0" />
                  <div>
                    <span className="font-bold block">Error al generar la imatge</span>
                    <span>Hi ha hagut un problema al renderitzar el canvas. Pots provar d'utilitzar un navegador actualitzat o fer una captura de pantalla convencional.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Visual Dashboard Container */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-1.5 shadow-sm overflow-x-auto" id="dashboard-outer-frame">
              <div className="min-w-[700px] lg:min-w-0" id="dashboard-min-width-wrapper">
                {/* The main dashboard component that receives live updates */}
                <DashboardView 
                  units={units} 
                  dateString={getFormattedDateCatalan()} 
                />
              </div>
            </div>
            
          </section>

        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-slate-400 font-medium" id="app-footer">
        © Creat per ehernandez . 2026.
      </footer>
    </div>
  );
}