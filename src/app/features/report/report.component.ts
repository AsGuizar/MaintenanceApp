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
  selectedCategory: string = ''; // Ensure you have this property

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

  downloadReportAsJson() {
    const reportData = {
      addedTasks: this.addedTasks,
      inProgressTasks: this.inProgressTasks,
      finishedTasks: this.finishedTasks,
    };

    const json = JSON.stringify(reportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'maintenance_report.json';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
