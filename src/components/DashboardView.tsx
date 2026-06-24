import React from 'react';
import { UnitData } from '../types';
import UnitCard from './UnitCard';
import { Calendar, ShieldAlert, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

interface DashboardViewProps {
  units: UnitData[];
  dateString: string;
}

export default function DashboardView({ units, dateString }: DashboardViewProps) {
  return (
    <div 
      className="bg-slate-50 p-8 rounded-3xl border border-slate-200/60 max-w-6xl mx-auto shadow-sm"
      id="hospital-dashboard-capture-area"
      style={{ backgroundColor: '#f8fafc' }}
    >
      {/* Top Banner: Hospital name, Shift Info */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 pb-6 border-b border-slate-200/80" id="dash-header-row">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1" id="dash-tag">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Control d'Estat Assistencial
          </div>
          <h1 className="text-3.5xl font-black text-[#0f2d59] tracking-tight flex items-center gap-2" id="dash-title">
            Estat de les unitats
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1.5" id="dash-subtitle">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Cap de setmana i festius • actualitzat el </span>
            <span className="font-bold text-slate-700">{dateString}</span>
          </div>
        </div>
      </div>

      {/* Legend Row matching reference image exactly */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 shadow-xs" id="dash-legend-card">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5">Llegenda de l'estat assistencial</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 font-semibold" id="dash-legend-dots">
          {/* Dependència moderada */}
          <div className="flex items-center gap-2" id="leg-dep-mod">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-xs" />
            <span>Dependència moderada</span>
          </div>
          
          {/* Dependència greu */}
          <div className="flex items-center gap-2" id="leg-dep-greu">
            <span className="w-3.5 h-3.5 rounded-full bg-orange-400 border-2 border-white shadow-xs" />
            <span>Dependència greu</span>
          </div>
          
          {/* REC mig */}
          <div className="flex items-center gap-2" id="leg-rec-mitja">
            <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-xs" />
            <span>REC mig (taronja)</span>
          </div>
          
          {/* REC elevat */}
          <div className="flex items-center gap-2" id="leg-rec-elevat">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white shadow-xs animate-pulse" />
            <span>REC elevat (vermell)</span>
          </div>
          
          {/* Sense REC */}
          <div className="flex items-center gap-2" id="leg-no-rec">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs" />
            <span>Sense REC</span>
          </div>
          
          {/* Polsera errant activa */}
          <div className="flex items-center gap-2" id="leg-polsera">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-xs animate-pulse" />
            <span>Polsera errant activa</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 4 Units (UH1, UH2, UH4, UH5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dash-cards-grid">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} />
        ))}
      </div>

      {/* Glossary / Footnote footer */}
      <div className="mt-8 pt-4 border-t border-slate-200/60 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 text-[11px] text-slate-400 font-medium" id="dash-footer-glossary">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1" id="glossary-items">
          <div className="flex items-center gap-1" id="glossary-rec">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-300" />
            <span><strong className="text-slate-500">REC:</strong> Risc d'Empitjorament Clínic</span>
          </div>
          <div className="flex items-center gap-1" id="glossary-barthel">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
            <span><strong className="text-slate-500">Barthel:</strong> Índex de dependència funcional (0-100)</span>
          </div>
          <div className="flex items-center gap-1" id="glossary-cures">
            <AlertOctagon className="w-3.5 h-3.5 text-slate-300" />
            <span><strong className="text-slate-500">Càrrega de Cures:</strong> Traqueostomies i ventilació mecànica activa</span>
          </div>
        </div>
        
        <div className="text-slate-400/80 italic text-right font-mono" id="glossary-brand">
          Guttmann Hospital de Neurorehabilitació • Sistema de Resum d'Estat
        </div>
      </div>
    </div>
  );
}
