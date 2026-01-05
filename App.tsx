import React, { useState } from 'react';
import { AppStep, BookingState, PatientData, DepartmentRecommendation, ServiceType, Language } from './types';
import { Step1Service } from './components/Step1Service';
import { Step2Identity } from './components/Step2Identity';
import { Step3Triage } from './components/Step3Triage';
import { Step4Summary } from './components/Step4Summary';
import { Building2, Globe } from 'lucide-react';
import { translations } from './translations';

const INITIAL_STATE: BookingState = {
  serviceType: null,
  patientData: null,
  symptoms: '',
  recommendation: null,
};

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.WELCOME);
  const [bookingData, setBookingData] = useState<BookingState>(INITIAL_STATE);
  const [language, setLanguage] = useState<Language>('vi');

  const handleServiceSelect = (type: ServiceType) => {
    setBookingData(prev => ({ ...prev, serviceType: type }));
    setCurrentStep(AppStep.IDENTITY);
  };

  const handleIdentityVerified = (data: PatientData) => {
    setBookingData(prev => ({ ...prev, patientData: data }));
    setCurrentStep(AppStep.TRIAGE);
  };

  const handleRecommendation = (symptoms: string, rec: DepartmentRecommendation) => {
    setBookingData(prev => ({ ...prev, symptoms, recommendation: rec }));
    setCurrentStep(AppStep.SUMMARY);
  };

  const handleReset = () => {
    setBookingData(INITIAL_STATE);
    setCurrentStep(AppStep.WELCOME);
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-medical-600 p-2 rounded-lg text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">{t.app_name}</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wider">{t.app_subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {[0, 1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentStep >= step ? 'bg-medical-600 scale-110' : 'bg-slate-200'
                    }`}
                  />
                  {step < 3 && (
                    <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
                      currentStep > step ? 'bg-medical-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-semibold">{language === 'vi' ? 'VN' : 'EN'}</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden hidden group-hover:block animate-fade-in-up origin-top-right z-50">
                <button 
                  onClick={() => setLanguage('vi')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${language === 'vi' ? 'text-medical-600 font-medium' : 'text-slate-600'}`}
                >
                  Tiếng Việt
                  {language === 'vi' && <span className="w-2 h-2 rounded-full bg-medical-600"></span>}
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${language === 'en' ? 'text-medical-600 font-medium' : 'text-slate-600'}`}
                >
                  English
                  {language === 'en' && <span className="w-2 h-2 rounded-full bg-medical-600"></span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
          {currentStep === AppStep.WELCOME && (
            <Step1Service onSelect={handleServiceSelect} lang={language} />
          )}
          {currentStep === AppStep.IDENTITY && (
            <Step2Identity onVerified={handleIdentityVerified} onBack={goBack} lang={language} />
          )}
          {currentStep === AppStep.TRIAGE && (
            <Step3Triage onRecommendation={handleRecommendation} onBack={goBack} lang={language} />
          )}
          {currentStep === AppStep.SUMMARY && (
            <Step4Summary data={bookingData} onReset={handleReset} lang={language} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}

export default App;