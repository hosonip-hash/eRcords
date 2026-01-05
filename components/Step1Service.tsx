import React from 'react';
import { ServiceType, Language } from '../types';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

interface Props {
  onSelect: (type: ServiceType) => void;
  lang: Language;
}

export const Step1Service: React.FC<Props> = ({ onSelect, lang }) => {
  const t = translations[lang];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in p-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">{t.welcome_title}</h2>
      <p className="text-slate-500 mb-10 text-center">{t.welcome_subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button
          onClick={() => onSelect(ServiceType.SERVICE)}
          className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-medical-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="h-20 w-20 rounded-full bg-medical-50 flex items-center justify-center mb-6 group-hover:bg-medical-500 transition-colors">
            <CreditCard className="w-10 h-10 text-medical-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t.service_general}</h3>
          <p className="text-sm text-slate-500 text-center">{t.service_general_desc}</p>
        </button>

        <button
          onClick={() => onSelect(ServiceType.INSURANCE)}
          className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-green-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
           <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
            <ShieldCheck className="w-10 h-10 text-green-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{t.service_insurance}</h3>
          <p className="text-sm text-slate-500 text-center">{t.service_insurance_desc}</p>
        </button>
      </div>
    </div>
  );
};