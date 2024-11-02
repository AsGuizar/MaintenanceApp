// src/app/models/maintenance.model.ts
export interface MaintenanceTask {
  id: string;                // Unique identifier for the task
  description: string;       // Description of the maintenance task
  category: string;          // Category of the task (e.g., house, vehicle, health, pet)
  reminderDate: Date;        // Date when the reminder should occur
  date: Date;                // Date of the task (when it was created or scheduled)
  cost?: number;             // Optional cost of the maintenance task
  notes?: string;            // Optional notes regarding the task
  status: 'pending' | 'in progress' | 'completed'; // Task status
}
