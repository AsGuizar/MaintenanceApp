import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';
import { Router } from '@angular/router'; // Import Router

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

  constructor(private maintenanceService: MaintenanceService, private router: Router) {} // Inject Router

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
        new Date(task.date) >= start && new Date(task.date) <= end
      );

      this.inProgressTasks = this.tasks.filter(task => 
        task.status === 'in progress' && new Date(task.date) >= start && new Date(task.date) <= end
      );

      this.finishedTasks = this.tasks.filter(task => 
        task.status === 'completed' && new Date(task.date) >= start && new Date(task.date) <= end
      );
    }
  }

  goHome() {
    this.router.navigate(['/home']); // Adjust the route path as needed
  }

  goToSettings() {
    this.router.navigate(['/settings']); // Adjust the route path as needed
  }
}
