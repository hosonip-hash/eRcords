import React, { useRef, useState, useEffect } from 'react';
import { Camera, ScanFace, CheckCircle2, UserCheck } from 'lucide-react';
import { PatientData } from '../types';

interface Props {
  onVerified: (data: PatientData) => void;
  onBack: () => void;
}

export const Step2Identity: React.FC<Props> = ({ onVerified, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState<'ID_SCAN' | 'FACE_SCAN' | 'COMPLETE'>('ID_SCAN');
  const [mockData, setMockData] = useState<PatientData>({});

  // Start Camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Không thể truy cập camera. Vui lòng cấp quyền để tiếp tục.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScanID = () => {
    setScanning(true);
    // Simulate OCR delay
    setTimeout(() => {
      setScanning(false);
      setMockData(prev => ({
        ...prev,
        cccd: "001095012345",
        name: "NGUYỄN VĂN A"
      }));
      setStep('FACE_SCAN');
    }, 2500);
  };

  const handleScanFace = () => {
    setScanning(true);
    // Simulate FaceID delay
    setTimeout(() => {
      setScanning(false);
      setMockData(prev => ({
        ...prev,
        faceToken: "ft_8a7sd8f7a8sdf7",
        image: "captured_base64_string_mock"
      }));
      setStep('COMPLETE');
    }, 2000);
  };

  const finish = () => {
    onVerified(mockData);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm font-medium">
          &larr; Quay lại
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Xác Thực Danh Tính</h2>
        <div className="w-16"></div> 
      </div>

      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-xl mb-6 border-4 border-slate-200">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover ${step === 'COMPLETE' ? 'opacity-50' : ''}`} 
        />
        
        {/* Scanning Overlay UI */}
        {scanning && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-scan-line opacity-80"></div>
            <div className="absolute top-4 left-4 text-green-400 font-mono text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              PROCESSING...
            </div>
            <div className="absolute inset-0 border-2 border-green-500/30"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-500 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-500 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500 rounded-br-xl"></div>
          </div>
        )}

        {/* Instructions Overlay */}
        {!scanning && step !== 'COMPLETE' && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium">
                {step === 'ID_SCAN' ? 'Đưa CCCD/Thẻ BHYT vào khung hình' : 'Nhìn thẳng vào camera để xác thực'}
             </div>
           </div>
        )}
        
        {step === 'COMPLETE' && (
           <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-md">
             <div className="bg-white p-6 rounded-full shadow-2xl animate-bounce-in">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
             </div>
           </div>
        )}
      </div>

      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        {step === 'ID_SCAN' && (
          <div className="text-center">
            <p className="text-slate-600 mb-4">Hệ thống sẽ tự động trích xuất thông tin từ thẻ của bạn.</p>
            <button 
              onClick={handleScanID}
              disabled={scanning}
              className="w-full py-4 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              {scanning ? 'Đang quét...' : (
                <>
                  <Camera className="w-5 h-5" />
                  Chụp Ảnh Giấy Tờ
                </>
              )}
            </button>
          </div>
        )}

        {step === 'FACE_SCAN' && (
          <div className="text-center animate-fade-in">
             <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
                <UserCheck className="w-4 h-4" />
                Đã nhận diện: <strong>{mockData.name}</strong> - {mockData.cccd}
             </div>
            <p className="text-slate-600 mb-4">Vui lòng xác thực khuôn mặt để mở hồ sơ y tế.</p>
            <button 
              onClick={handleScanFace}
              disabled={scanning}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
            >
              {scanning ? 'Đang đối chiếu...' : (
                <>
                  <ScanFace className="w-5 h-5" />
                  Xác Thực FaceID
                </>
              )}
            </button>
          </div>
        )}

        {step === 'COMPLETE' && (
           <div className="text-center animate-fade-in">
              <h3 className="text-xl font-bold text-slate-800 mb-1">Xác thực thành công!</h3>
              <p className="text-slate-500 mb-6">Danh tính của bạn đã được xác nhận với hệ thống quốc gia.</p>
              <button 
                onClick={finish}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-200 transition-all"
              >
                Tiếp Tục Đến Sàng Lọc
              </button>
           </div>
        )}
      </div>
    </div>
  );
};