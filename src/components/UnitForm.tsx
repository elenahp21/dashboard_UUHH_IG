import React from 'react';
import { UnitData, UnitId } from '../types';
import { Plus, Minus, ShieldAlert, HeartPulse, UserCheck, RefreshCw, UserMinus } from 'lucide-react';

interface UnitFormProps {
  unit: UnitData;
  onChange: (updatedUnit: UnitData) => void;
}

export default function UnitForm({ unit, onChange }: UnitFormProps) {
  const updateField = (field: keyof UnitData, value: number) => {
    const updated = { ...unit, [field]: value };
    
    // Automatically recalculate Queden Avui if certain fields change,
    // but let them customize it if they want.
    if (field === 'ingressats' || field === 'altes' || field === 'pases') {
      const calculated = updated.ingressats - updated.altes - updated.pases;
      updated.quedenAvui = Math.max(0, calculated);
    }
    
    onChange(updated);
  };

  const adjustValue = (field: keyof UnitData, delta: number, min = 0, max = 200) => {
    const currentValue = (unit[field] as number) || 0;
    const newValue = Math.min(max, Math.max(min, currentValue + delta));
    updateField(field, newValue);
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4" id={`form-container-${unit.id}`}>
      {/* Grid of basic movement statistics */}
      <div className="grid grid-cols-2 gap-3" id="stats-grid">
        {/* Ingressats totals */}
        <div className="bg-white p-3 rounded-lg shadow-xs border border-slate-100 flex flex-col justify-between" id="field-ingressats">
          <label className="text-xs font-semibold text-slate-500 mb-1">Ingressats Totals</label>
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => adjustValue('ingressats', -1)}
              className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
              id="btn-dec-ingressats"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={unit.ingressats}
              onChange={(e) => updateField('ingressats', parseInt(e.target.value) || 0)}
              className="w-12 text-center font-bold text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
              min="0"
              id="input-ingressats"
            />
            <button
              type="button"
              onClick={() => adjustValue('ingressats', 1)}
              className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
              id="btn-inc-ingressats"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Queden Avui */}
        <div className="bg-blue-50/50 p-3 rounded-lg shadow-xs border border-blue-100 flex flex-col justify-between" id="field-queden">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-blue-800">Queden Avui</label>
            <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded">Auto</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => adjustValue('quedenAvui', -1)}
              className="p-1.5 rounded-md hover:bg-blue-100/50 active:scale-95 text-blue-700 transition"
              id="btn-dec-queden"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={unit.quedenAvui}
              onChange={(e) => updateField('quedenAvui', parseInt(e.target.value) || 0)}
              className="w-12 text-center font-bold text-blue-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded bg-transparent"
              min="0"
              id="input-queden"
            />
            <button
              type="button"
              onClick={() => adjustValue('quedenAvui', 1)}
              className="p-1.5 rounded-md hover:bg-blue-100/50 active:scale-95 text-blue-700 transition"
              id="btn-inc-queden"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Altes */}
        <div className="bg-white p-3 rounded-lg shadow-xs border border-slate-100 flex flex-col justify-between" id="field-altes">
          <label className="text-xs font-semibold text-emerald-600 mb-1">Altes</label>
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => adjustValue('altes', -1)}
              className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
              id="btn-dec-altes"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={unit.altes}
              onChange={(e) => updateField('altes', parseInt(e.target.value) || 0)}
              className="w-12 text-center font-bold text-emerald-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
              min="0"
              id="input-altes"
            />
            <button
              type="button"
              onClick={() => adjustValue('altes', 1)}
              className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
              id="btn-inc-altes"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Passis / Pases */}
        <div className="bg-white p-3 rounded-lg shadow-xs border border-slate-100 flex flex-col justify-between" id="field-pases">
          <label className="text-xs font-semibold text-blue-600 mb-1">Passis</label>
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => adjustValue('pases', -1)}
              className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
              id="btn-dec-pases"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={unit.pases}
              onChange={(e) => updateField('pases', parseInt(e.target.value) || 0)}
              className="w-12 text-center font-bold text-blue-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
              min="0"
              id="input-pases"
            />
            <button
              type="button"
              onClick={() => adjustValue('pases', 1)}
              className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
              id="btn-inc-pases"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* REC fields */}
      <div className="bg-amber-50/40 p-3 rounded-lg border border-amber-100 space-y-3" id="rec-section">
        <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          REC (Risc d'Empitjorament Clínic)
        </h4>
        <div className="grid grid-cols-2 gap-2" id="rec-inputs">
          <div className="flex flex-col gap-1" id="rec-mitja-container">
            <span className="text-[10px] text-slate-500 font-medium">REC Mig Actiu</span>
            <div className="flex items-center bg-white rounded-md border border-slate-200 p-1 justify-between">
              <button
                type="button"
                onClick={() => adjustValue('recMitja', -1)}
                className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                id="btn-dec-recmitja"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-xs text-slate-800">{unit.recMitja}</span>
              <button
                type="button"
                onClick={() => adjustValue('recMitja', 1)}
                className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                id="btn-inc-recmitja"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-1" id="rec-elevat-container">
            <span className="text-[10px] text-slate-500 font-medium">REC Elevat Actiu</span>
            <div className="flex items-center bg-white rounded-md border border-slate-200 p-1 justify-between">
              <button
                type="button"
                onClick={() => adjustValue('recElevat', -1)}
                className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                id="btn-dec-recelevat"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-xs text-rose-600">{unit.recElevat}</span>
              <button
                type="button"
                onClick={() => adjustValue('recElevat', 1)}
                className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                id="btn-inc-recelevat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barthel Indice - NOW WITH NUMERIC INPUT INSTEAD OF SLIDER */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2" id="barthel-section">
        <div className="flex justify-between items-center" id="barthel-header">
          <label className="text-xs font-bold text-slate-700">Barthel Mitjà</label>
          <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            {unit.barthelMitja.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2" id="barthel-input-container">
          <button
            type="button"
            onClick={() => adjustValue('barthelMitja', -1, 0, 100)}
            className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
            id="btn-dec-barthel"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={unit.barthelMitja.toFixed(2)}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              updateField('barthelMitja', Math.min(100, Math.max(0, val)));
            }}
            className="flex-1 text-center font-bold text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded border border-slate-200 py-2"
            min="0"
            max="100"
            step="0.01"
            id="input-barthel"
          />
          <button
            type="button"
            onClick={() => adjustValue('barthelMitja', 1, 0, 100)}
            className="p-1.5 rounded-md hover:bg-slate-100 active:scale-95 text-slate-600 transition"
            id="btn-inc-barthel"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium" id="barthel-labels">
          <span>Dependència Greu (&lt;40)</span>
          <span>Moderada (40-60)</span>
          <span>Lleu/Sense (&gt;60)</span>
        </div>
      </div>

      {/* Care Load (Traqueo, VM, Pulsera Errant, Pacient Post-Quirúrgic) */}
      <div className="bg-indigo-50/30 p-3 rounded-lg border border-indigo-100 space-y-3" id="care-load-section">
        <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
          <HeartPulse className="w-3.5 h-3.5 text-indigo-600" />
          Càrrega de Cures i Seguretat
        </h4>
        <div className="space-y-2" id="care-load-inputs">
          {/* Traqueostomia */}
          <div className="flex items-center justify-between" id="input-traqueo-row">
            <span className="text-xs text-slate-600 font-medium">Persones amb Traqueostomia</span>
            <div className="flex items-center bg-white rounded-md border border-slate-200 p-1 justify-between w-24">
              <button
                type="button"
                onClick={() => adjustValue('traqueo', -1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-dec-traqueo"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-xs text-slate-800">{unit.traqueo}</span>
              <button
                type="button"
                onClick={() => adjustValue('traqueo', 1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-inc-traqueo"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Ventilació Mecànica */}
          <div className="flex items-center justify-between" id="input-vm-row">
            <span className="text-xs text-slate-600 font-medium">Persones amb Vent. Mecànica (VM)</span>
            <div className="flex items-center bg-white rounded-md border border-slate-200 p-1 justify-between w-24">
              <button
                type="button"
                onClick={() => adjustValue('vm', -1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-dec-vm"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-xs text-slate-800">{unit.vm}</span>
              <button
                type="button"
                onClick={() => adjustValue('vm', 1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-inc-vm"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Polsera errant */}
          <div className="flex items-center justify-between" id="input-pulsera-row">
            <span className="text-xs text-slate-600 font-medium">Persones amb Polsera Errant</span>
            <div className="flex items-center bg-white rounded-md border border-slate-200 p-1 justify-between w-24">
              <button
                type="button"
                onClick={() => adjustValue('pulseraErrant', -1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-dec-pulsera"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-xs text-red-600">{unit.pulseraErrant}</span>
              <button
                type="button"
                onClick={() => adjustValue('pulseraErrant', 1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-inc-pulsera"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Pacient Post-Quirúrgic */}
          <div className="flex items-center justify-between" id="input-postquirurgic-row">
            <span className="text-xs text-slate-600 font-medium">Pacient Post-Quirúrgic</span>
            <div className="flex items-center bg-white rounded-md border border-slate-200 p-1 justify-between w-24">
              <button
                type="button"
                onClick={() => adjustValue('pacientPostQuirurgic', -1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-dec-postquirurgic"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-xs text-purple-600">{unit.pacientPostQuirurgic}</span>
              <button
                type="button"
                onClick={() => adjustValue('pacientPostQuirurgic', 1)}
                className="p-1 hover:bg-slate-50 text-slate-600 rounded"
                id="btn-inc-postquirurgic"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}