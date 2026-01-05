import React from 'react';
import { CheckCircle, Download, RotateCcw } from 'lucide-react';
import { BookingState, Language } from '../types';
import { translations } from '../translations';

interface Props {
  data: BookingState;
  onReset: () => void;
  lang: Language;
}

export const Step4Summary: React.FC<Props> = ({ data, onReset, lang }) => {
  const t = translations[lang];
  
  const generatePayload = () => {
    return {
      action: "BOOKING_CREATE",
      timestamp: new Date().toISOString(),
      source: "KIOSK_01",
      language: lang,
      patient_data: {
        cccd: data.patientData?.cccd || "",
        face_token: data.patientData?.faceToken || "manual_override",
        insurance_type: data.serviceType
      },
      clinical: {
        symptoms: data.symptoms,
        dept_code: data.recommendation?.deptCode,
        dept_name: data.recommendation?.deptName,
        ai_confidence: data.recommendation?.confidence
      }
    };
  };

  const payload = generatePayload();

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-medium flex items-center gap-2 mb-8">
        <CheckCircle className="w-5 h-5" />
        {t.summary_success}
      </div>

      <h1 className="text-3xl font-bold text-slate-800 mb-2">{t.ticket_number} <span className="text-medical-600 text-4xl ml-2">#A102</span></h1>
      <p className="text-slate-500 mb-8 text-center max-w-lg">
        {t.guide_text} <strong>{data.recommendation?.deptName}</strong> {t.floor}.<br/>
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ticket View */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-medical-500 to-purple-600"></div>
          
          <div className="flex justify-between items-start mb-6">
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.patient}</p>
                <h3 className="text-xl font-bold text-slate-800">{data.patientData?.name || t.guest}</h3>
                <p className="text-slate-500 text-sm">{data.patientData?.cccd}</p>
             </div>
             <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.type}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${data.serviceType === 'BHYT' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {data.serviceType === 'BHYT' ? t.type_insurance : t.type_service}
                </span>
             </div>
          </div>

          <div className="border-t border-dashed border-slate-200 my-4"></div>

          <div className="mb-6">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.dept}</p>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-medical-50 flex items-center justify-center text-medical-600 font-bold">
                 {data.recommendation?.deptCode.substring(0,2)}
               </div>
               <div>
                 <p className="font-bold text-slate-800">{data.recommendation?.deptName}</p>
                 <p className="text-xs text-slate-500">{data.symptoms.substring(0, 30)}...</p>
               </div>
             </div>
          </div>

          <div className="flex justify-center">
            {/* Mock Barcode */}
            <div className="h-12 w-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Code_39_symbol.svg/1200px-Code_39_symbol.svg.png')] bg-cover opacity-80 mix-blend-multiply"></div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-1">{t.scan_at_counter}</p>
        </div>

        {/* JSON Payload View */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase">HIS API Payload (Output)</h3>
            <span className="text-xs font-mono text-purple-500 bg-purple-50 px-2 py-1 rounded">JSON</span>
          </div>
          <div className="bg-slate-900 rounded-2xl p-6 flex-1 shadow-inner overflow-auto font-mono text-xs text-green-400 relative group">
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(payload, null, 2)}
            </pre>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-2 bg-white/10 hover:bg-white/20 rounded text-white" title="Copy">
                 <Download className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          {t.btn_reset}
        </button>
      </div>
    </div>
  );
};