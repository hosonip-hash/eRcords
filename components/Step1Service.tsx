import React from 'react';
import { ServiceType } from '../types';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface Props {
  onSelect: (type: ServiceType) => void;
}

export const Step1Service: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in p-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Chào mừng đến với Bệnh viện Thông minh</h2>
      <p className="text-slate-500 mb-10 text-center">Vui lòng chọn hình thức khám bệnh để bắt đầu</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button
          onClick={() => onSelect(ServiceType.SERVICE)}
          className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-medical-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="h-20 w-20 rounded-full bg-medical-50 flex items-center justify-center mb-6 group-hover:bg-medical-500 transition-colors">
            <CreditCard className="w-10 h-10 text-medical-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Khám Dịch Vụ</h3>
          <p className="text-sm text-slate-500 text-center">Dành cho bệnh nhân không sử dụng bảo hiểm y tế hoặc khám theo yêu cầu.</p>
        </button>

        <button
          onClick={() => onSelect(ServiceType.INSURANCE)}
          className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-green-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
           <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
            <ShieldCheck className="w-10 h-10 text-green-600 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Khám Bảo Hiểm (BHYT)</h3>
          <p className="text-sm text-slate-500 text-center">Vui lòng chuẩn bị thẻ BHYT và CCCD để đối chiếu thông tin.</p>
        </button>
      </div>
    </div>
  );
};