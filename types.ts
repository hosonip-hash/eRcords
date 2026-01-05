export enum AppStep {
  WELCOME = 0,
  IDENTITY = 1,
  TRIAGE = 2,
  SUMMARY = 3,
}

export enum ServiceType {
  SERVICE = 'DichVu',
  INSURANCE = 'BHYT',
}

export type Language = 'vi' | 'en';

export interface DepartmentRecommendation {
  deptCode: string;
  deptName: string;
  reasoning: string;
  confidence: number;
}

export interface PatientData {
  cccd?: string;
  name?: string;
  faceToken?: string;
  image?: string;
}

export interface BookingState {
  serviceType: ServiceType | null;
  patientData: PatientData | null;
  symptoms: string;
  recommendation: DepartmentRecommendation | null;
}

export const DEPARTMENTS = [
  { code: 'NOI_KHOA', name: 'Nội Khoa Tổng Quát' },
  { code: 'NGOAI_KHOA', name: 'Ngoại Khoa' },
  { code: 'TIM_MACH', name: 'Tim Mạch' },
  { code: 'NHI_KHOA', name: 'Nhi Khoa' },
  { code: 'TAI_MUI_HONG', name: 'Tai Mũi Họng' },
  { code: 'DA_LIEU', name: 'Da Liễu' },
  { code: 'THAN_KINH', name: 'Thần Kinh' },
  { code: 'CHAN_THUONG', name: 'Chấn Thương Chỉnh Hình' },
];