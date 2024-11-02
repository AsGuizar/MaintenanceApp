// src/app/features/report/report.component.ts
import { Component } from '@angular/core';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
  tasks: MaintenanceTask[] = [];
  startDate: Date;               // Declare startDate
  endDate: Date;                 // Declare endDate
  filteredTasks: MaintenanceTask[] = []; // Define filteredTasks property

  constructor(private maintenanceService: MaintenanceService) {
    this.tasks = this.maintenanceService.getTasks();
    this.startDate = new Date();  // Initialize to current date
    this.endDate = new Date();    // Initialize to current date
  }

  generateReport() {
    // Check if startDate or endDate is null and provide an alert
    if (!this.startDate || !this.endDate) {
      alert('Please set both start and end dates.');
      return;
    }

    // Proceed to filter tasks only if the dates are valid
    this.filteredTasks = this.tasks.filter(task => {
      const taskDate = new Date(task.reminderDate); // Ensure you are filtering by reminderDate
      return taskDate >= this.startDate && taskDate <= this.endDate;
    });

    // Log the filtered tasks and alert the user
    console.log('Filtered Tasks:', this.filteredTasks);
    alert(`Report Generated: ${this.filteredTasks.length} tasks found.`);
  }
}
