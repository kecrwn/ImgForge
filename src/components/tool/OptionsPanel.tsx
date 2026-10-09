import React from 'react';
import { OptionSchema } from '../../types';

interface OptionsPanelProps {
  options: OptionSchema[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, values, onChange }) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {options.map((opt) => (
        <div key={opt.id} className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {opt.label}
          </label>
          
          {opt.type === 'number' && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={values[opt.id] ?? opt.defaultValue}
                onChange={(e) => onChange(opt.id, Number(e.target.value))}
                min={opt.min}
                max={opt.max}
                step={opt.step}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-700 dark:text-slate-200"
              />
            </div>
          )}

          {opt.type === 'select' && (
            <select
              value={values[opt.id] ?? opt.defaultValue}
              onChange={(e) => onChange(opt.id, e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-700 dark:text-slate-200"
            >
              {opt.options?.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}

          {opt.type === 'toggle' && (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={values[opt.id] ?? opt.defaultValue}
                onChange={(e) => onChange(opt.id, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
            </label>
          )}

          {opt.type === 'slider' && (
            <div className="flex items-center gap-4">
              <input
                type="range"
                value={values[opt.id] ?? opt.defaultValue}
                onChange={(e) => onChange(opt.id, Number(e.target.value))}
                min={opt.min}
                max={opt.max}
                step={opt.step}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary-600"
              />
              <span className="text-sm font-medium w-12 text-right dark:text-slate-300">
                {values[opt.id] ?? opt.defaultValue}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
