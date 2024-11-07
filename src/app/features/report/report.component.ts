import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  tasks: MaintenanceTask[] = [];
  filteredTasks: MaintenanceTask[] = [];
  startDate: string = '';
  endDate: string = '';
  addedTasks: MaintenanceTask[] = [];
  inProgressTasks: MaintenanceTask[] = [];
  finishedTasks: MaintenanceTask[] = [];
  selectedCategory: string = '';
  dateError: boolean = false;

  constructor(private maintenanceService: MaintenanceService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.maintenanceService.getTasks(); // Assuming this returns all tasks
  }

  // Check if date is in a valid format
  isValidDate(date: string): boolean {
    return !isNaN(Date.parse(date));
  }

  generateReport() {
    // Reset date error
    this.dateError = false;

    if (!this.isValidDate(this.startDate) || !this.isValidDate(this.endDate)) {
      this.dateError = true;
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // Check if start date is before end date
    if (start > end) {
      this.dateError = true;
      return;
    }

    // Filter tasks by date range and selected category
    this.addedTasks = this.tasks.filter(task =>
      new Date(task.date) >= start &&
      new Date(task.date) <= end &&
      (this.selectedCategory === '' || task.category === this.selectedCategory || 
        (this.selectedCategory === 'Other' && task.category !== 'House' && task.category !== 'Pets' && task.category !== 'Health' && task.category !== 'Vehicles')) // Handle 'Other' category
    );

    this.inProgressTasks = this.tasks.filter(task =>
      task.status === 'in progress' &&
      new Date(task.date) >= start &&
      new Date(task.date) <= end &&
      (this.selectedCategory === '' || task.category === this.selectedCategory || 
        (this.selectedCategory === 'Other' && task.category !== 'House' && task.category !== 'Pets' && task.category !== 'Health' && task.category !== 'Vehicles'))
    );

    this.finishedTasks = this.tasks.filter(task =>
      task.status === 'completed' &&
      new Date(task.date) >= start &&
      new Date(task.date) <= end &&
      (this.selectedCategory === '' || task.category === this.selectedCategory || 
        (this.selectedCategory === 'Other' && task.category !== 'House' && task.category !== 'Pets' && task.category !== 'Health' && task.category !== 'Vehicles'))
    );
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToMaintenance() {
    this.router.navigate(['../maintenance']);
  }
}
