import React from 'react';
import { UnitData } from '../types';
import { Bed, ArrowUpCircle, RefreshCw, ShieldAlert, CheckCircle, AlertTriangle, Wind, HelpCircle, HeartPulse } from 'lucide-react';

interface UnitCardProps {
  unit: UnitData;
  key?: string;
}

export default function UnitCard({ unit }: UnitCardProps) {
  // Format Barthel index using European/Catalan comma notation
  const formattedBarthel = unit.barthelMitja.toLocaleString('ca-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Determine dependency category based on Barthel Index
  let dependencyText = 'Dependència moderada';
  let dependencyColorClass = 'bg-amber-100 text-amber-800 border-amber-200';
  
  if (unit.barthelMitja < 40) {
    dependencyText = 'Dependència greu';
    dependencyColorClass = 'bg-orange-100 text-orange-800 border-orange-200';
  } else if (unit.barthelMitja >= 60) {
    dependencyText = 'Dependència lleu / Autònom';
    dependencyColorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  }

  // Calculate Barthel percentage position (0 to 100)
  const barthelPosition = `${Math.min(100, Math.max(0, unit.barthelMitja))}%`;

  // REC calculations (Risc d'Empitjorament Clínic)
  const totalREC = unit.recMitja + unit.recElevat;
  const isRecActive = totalREC > 0;

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
      id={`unit-card-${unit.id}`}
      style={{ contentVisibility: 'auto' }}
    >
      {/* Top Section: Unit header */}
      <div>
        <div className="flex justify-between items-center mb-3" id="card-header-row">
          <div className="flex items-center gap-3" id="card-title-group">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center border border-blue-100/30" id="card-icon-wrapper">
              <Bed className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight" id="card-unit-id">
              {unit.id}
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100" id="card-ingressats-badge">
            {unit.ingressats} ingressats totals
          </span>
        </div>

        {/* Big Remaining Today box */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 mb-4 flex justify-between items-center" id="card-queden-box">
          <span className="text-sm font-semibold text-slate-500">Queden avui:</span>
          <span className="text-4xl font-black text-[#0f2d59]" id="card-queden-val">
            {unit.quedenAvui}
          </span>
        </div>

        {/* Columns Grid: Altes, Passis, REC Mitjà, REC Elevat */}
        <div className="grid grid-cols-4 gap-2 mb-4" id="card-cols-grid">
          {/* Altes */}
          <div className="bg-slate-50/30 border border-slate-100 rounded-xl p-2 text-center flex flex-col items-center justify-center" id="col-altes">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Altes</span>
            <div className="flex items-center gap-1" id="val-altes">
              <ArrowUpCircle className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
              <span className="text-sm font-extrabold text-slate-700">{unit.altes}</span>
            </div>
          </div>

          {/* Passis */}
          <div className="bg-slate-50/30 border border-slate-100 rounded-xl p-2 text-center flex flex-col items-center justify-center" id="col-passis">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passis</span>
            <div className="flex items-center gap-1" id="val-passis">
              <RefreshCw className="w-3.5 h-3.5 text-blue-500 stroke-[2.5]" />
              <span className="text-sm font-extrabold text-slate-700">{unit.pases}</span>
            </div>
          </div>

          {/* REC Mig */}
          <div className={`border rounded-xl p-2 text-center flex flex-col items-center justify-center transition-all ${
            unit.recMitja > 0 ? 'bg-orange-50/80 border-orange-200' : 'bg-slate-50/30 border-slate-100'
          }`} id="col-rec-mitja">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">REC Mig</span>
            <div className="flex items-center gap-1" id="val-rec-mitja">
              {unit.recMitja > 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-orange-500 stroke-[2.5]" />
                  <span className="text-sm font-black text-orange-700">{unit.recMitja}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-sm font-extrabold text-slate-400">0</span>
                </>
              )}
            </div>
          </div>

          {/* REC Elevat */}
          <div className={`border rounded-xl p-2 text-center flex flex-col items-center justify-center transition-all ${
            unit.recElevat > 0 ? 'bg-rose-50/80 border-rose-200 animate-pulse' : 'bg-slate-50/30 border-slate-100'
          }`} id="col-rec-elevat">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">REC Elev.</span>
            <div className="flex items-center gap-1" id="val-rec-elevat">
              {unit.recElevat > 0 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-500 stroke-[2.5]" />
                  <span className="text-sm font-black text-red-700">{unit.recElevat}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-sm font-extrabold text-slate-400">0</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Barthel Row */}
        <div className="space-y-2 mb-4" id="card-barthel-row">
          <div className="flex justify-between items-center" id="barthel-labels">
            <span className="text-xs font-semibold text-slate-400">Barthel mitjà</span>
            <div className="flex items-center gap-2" id="barthel-vals">
              <span className="text-sm font-extrabold text-slate-700">{formattedBarthel}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dependencyColorClass}`} id="barthel-badge">
                {dependencyText}
              </span>
            </div>
          </div>

          {/* Color bar with visual pin */}
          <div className="relative pt-2" id="barthel-visual-bar">
            {/* The multi-colored bar */}
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-red-400 via-orange-300 via-yellow-300 via-emerald-300 to-emerald-500" />
            
            {/* Slider pointer representing the actual Barthel score */}
            <div 
              className="absolute top-1 flex flex-col items-center transition-all duration-500 ease-out" 
              style={{ left: barthelPosition, transform: 'translateX(-50%)' }}
              id="barthel-pointer"
            >
              <div className="w-1 h-3.5 bg-slate-800 rounded-full shadow-md" />
            </div>
          </div>
        </div>

        {/* CLINICAL LOAD FLAGS (Tracheostomy & VM) */}
        {(unit.traqueo > 0 || unit.vm > 0) && (
          <div className="grid grid-cols-2 gap-2 mb-4 border-t border-slate-100 pt-3" id="card-clinical-flags">
            {/* Traqueostomia */}
            {unit.traqueo > 0 ? (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg py-1 px-2 flex items-center gap-1.5" id="flag-traqueo">
                <HeartPulse className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                <div className="text-left" id="flag-traqueo-text">
                  <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-wider leading-none">Traqueostomia</p>
                  <p className="text-xs font-black text-indigo-900">{unit.traqueo} pacient{unit.traqueo > 1 ? 's' : ''}</p>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-100 rounded-lg py-1 px-2 flex items-center justify-center text-[10px] text-slate-300" id="flag-traqueo-empty">
                Sense traqueostomies
              </div>
            )}

            {/* Ventilació Mecànica */}
            {unit.vm > 0 ? (
              <div className="bg-purple-50/50 border border-purple-100 rounded-lg py-1 px-2 flex items-center gap-1.5" id="flag-vm">
                <Wind className="w-3.5 h-3.5 text-purple-600 stroke-[2.5]" />
                <div className="text-left" id="flag-vm-text">
                  <p className="text-[9px] text-purple-500 font-bold uppercase tracking-wider leading-none">Vent. Mecànica</p>
                  <p className="text-xs font-black text-purple-900">{unit.vm} pacient{unit.vm > 1 ? 's' : ''}</p>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-100 rounded-lg py-1 px-2 flex items-center justify-center text-[10px] text-slate-300" id="flag-vm-empty">
                Sense VM activa
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Polsera Errant Banner */}
      <div id="card-polsera-banner">
        {unit.pulseraErrant > 0 ? (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 flex items-center gap-2" id="polsera-active">
            <AlertTriangle className="w-4 h-4 text-rose-500 fill-rose-100 animate-pulse stroke-[2.5]" />
            <span className="text-xs font-extrabold text-rose-700 leading-tight">
              Polsera errant activa ({unit.pulseraErrant} pacient{unit.pulseraErrant > 1 ? 's' : ''})
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50/60 border border-emerald-100/50 rounded-xl p-2.5 flex items-center gap-2" id="polsera-inactive">
            <CheckCircle className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
            <span className="text-xs font-semibold text-emerald-700 leading-tight">
              Sense polsera errant
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
