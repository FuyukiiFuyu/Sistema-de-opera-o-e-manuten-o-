

export enum MachineStatus {
  OPERATIONAL = 'Operacional',
  MAINTENANCE = 'Manutenção',
  IDLE = 'Parada',
  OFFLINE = 'Desligada'
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  model: string;
  status: MachineStatus;
  lastMaintenance: string;
  operator?: string;
  image: string;
  progress: number; // For the dashboard visualization (0-100)
  safetyCheckCompleted?: boolean; // Flag for mandatory safety questionnaire
  operatingHours: number; // Total operating hours (Horímetro)
}

export interface MaintenanceLog {
  id: string;
  machineId: string;
  machineName: string;
  type: 'Preventiva' | 'Corretiva' | 'Preditiva';
  description: string;
  date: string;
  technician: string;
  status: 'Aberta' | 'Aprovada' | 'Em Execução' | 'Concluída';
}

export interface ReportEntry {
  id: string;
  logId: string;
  machineName: string;
  generatedAt: string; // ISO String date
  generatedBy: string;
}

export interface OperationalLog {
  id: string;
  machineId: string;
  type: 'Segurança' | 'Lubrificação' | 'Operação';
  timestamp: string; // ISO String
  user: string;
  details?: string;
  // New fields for Lubrication History
  studentClass?: string; // Turma
  shift?: string; // Turno
  course?: string; // Curso
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}