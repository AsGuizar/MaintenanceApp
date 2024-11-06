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

  constructor(private maintenanceService: MaintenanceService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.maintenanceService.getTasks(); // Assuming this returns all tasks
  }

  generateReport() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      this.addedTasks = this.tasks.filter(task =>
        task.status !== 'completed' &&
        new Date(task.date) >= start && new Date(task.date) <= end &&
        (this.selectedCategory === '' || task.category === this.selectedCategory)
      );

      this.inProgressTasks = this.tasks.filter(task =>
        task.status === 'in progress' && new Date(task.date) >= start && new Date(task.date) <= end &&
        (this.selectedCategory === '' || task.category === this.selectedCategory)
      );

      this.finishedTasks = this.tasks.filter(task =>
        task.status === 'completed' && new Date(task.date) >= start && new Date(task.date) <= end &&
        (this.selectedCategory === '' || task.category === this.selectedCategory)
      );
    }
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
