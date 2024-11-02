// src/app/features/maintenance/maintenance.component.ts
import { Component } from '@angular/core';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent {
  // Public maintenanceService property for template access
  public newTask: MaintenanceTask = {
    id: this.generateId(),         // Generate unique ID
    description: '',
    category: '',
    reminderDate: new Date(),      // Current date as default
    date: new Date(),               // Current date as default
    status: 'pending',
  };

  constructor(public maintenanceService: MaintenanceService) {} // Make maintenanceService public

  addTask() {
    this.maintenanceService.addTask(this.newTask);
    this.resetTask();
  }

  resetTask() {
    this.newTask = {
      id: this.generateId(),
      description: '',
      category: '',
      reminderDate: new Date(),
      date: new Date(),
      status: 'pending',
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9); // Generate a unique ID
  }
}
