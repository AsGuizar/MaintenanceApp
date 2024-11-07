export interface MaintenanceTask {
  id: number;
  description: string;
  category: string;
  reminderDate: Date;
  date: Date;
  cost?: number;
  notes?: string;
  status: 'pending' | 'in progress' | 'completed';
  frequency: 'unique' | 'weekly' | 'monthly' | 'annually';
  attachments?: string[];
  images?: string[]; // If you are using a separate array for images
  imagePath?: string;  // New property for image path
}
