import React, { useState } from 'react';
import { Stethoscope, Activity, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeSymptoms } from '../services/geminiService';
import { DepartmentRecommendation, Language } from '../types';
import { translations } from '../translations';

interface Props {
  onRecommendation: (symptoms: string, rec: DepartmentRecommendation) => void;
  onBack: () => void;
  lang: Language;
}

export const Step3Triage: React.FC<Props> = ({ onRecommendation, onBack, lang }) => {
  const t = translations[lang];
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DepartmentRecommendation | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      // Pass language to the service
      const rec = await analyzeSymptoms(symptoms, lang);
      setResult(rec);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (result) {
      onRecommendation(symptoms, result);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto p-4 animate-fade-in h-full">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm font-medium mr-4">
          &larr; {t.back}
        </button>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-medical-600" />
          {t.triage_title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        {/* Left Column: Input */}
        <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              {t.triage_label}
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t.triage_placeholder}
              className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-medical-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder-slate-400 bg-slate-50"
            ></textarea>
            
            <div className="mt-4 flex flex-wrap gap-2">
               <span className="text-xs text-slate-400">Gợi ý nhanh:</span>
               {t.quick_tags.map((tag: string) => (
                 <button 
                  key={tag}
                  onClick={() => setSymptoms(tag)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs transition-colors"
                 >
                   {tag}
                 </button>
               ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !symptoms.trim()}
              className="mt-6 w-full py-3 bg-medical-600 hover:bg-medical-700 disabled:bg-slate-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  {t.btn_analyze}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="flex flex-col">
          {loading ? (
             <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center animate-pulse">
                <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-medical-500 animate-pulse-slow" />
                </div>
                <h3 className="text-lg font-medium text-slate-700">{t.analyzing}</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">{t.analyzing_desc}</p>
             </div>
          ) : result ? (
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-medical-100 overflow-hidden flex flex-col animate-fade-in-up">
              <div className="bg-medical-50 p-6 border-b border-medical-100">
                <span className="inline-block px-3 py-1 bg-medical-200 text-medical-800 text-xs font-bold rounded-full mb-3">
                  {t.result_suggestion}
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{result.deptName}</h3>
                <p className="text-slate-500 text-sm mt-1">CODE: <span className="font-mono">{result.deptCode}</span></p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">{t.reason_label}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{result.reasoning}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${result.confidence > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{result.confidence}% {t.confidence}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-2 mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-yellow-700">{t.disclaimer}</p>
                  </div>

                  <button 
                    onClick={handleConfirm}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors group"
                  >
                    {t.btn_confirm}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Stethoscope className="w-8 h-8" />
               </div>
               <p className="text-slate-400">{t.empty_state}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};