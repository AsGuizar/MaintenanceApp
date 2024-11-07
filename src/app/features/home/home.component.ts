import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  username: string = ''; // Display the user's name
  pendingTasks: MaintenanceTask[] = [];
  inProgressTasks: MaintenanceTask[] = [];
  completedTasks: MaintenanceTask[] = [];
  reminders: MaintenanceTask[] = [];
  upcomingMaintenance: MaintenanceTask[] = [];

  // Dropdown visibility flags
  showPending: boolean = false;
  showInProgress: boolean = false;
  showCompleted: boolean = false;

  selectedTask: MaintenanceTask | null = null; // Track selected task for details view

  constructor(
    private maintenanceService: MaintenanceService,
    private router: Router
  ) {}

  ngOnInit() {
    // Retrieve the name from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.name || 'User'; // Default to 'User' if no name is found
    this.loadTasks();
  }

  loadTasks() {
    const tasks = this.maintenanceService.getTasks();
    this.pendingTasks = tasks.filter((task) => task.status === 'pending');
    this.inProgressTasks = tasks.filter((task) => task.status === 'in progress');
    this.completedTasks = tasks.filter((task) => task.status === 'completed');
    this.reminders = tasks.filter(
      (task) => new Date(task.reminderDate) <= new Date()
    );
    this.upcomingMaintenance = tasks.filter(
      (task) => new Date(task.date) > new Date()
    );
  }

  togglePendingTasks() {
    this.showPending = !this.showPending;
  }

  toggleInProgressTasks() {
    this.showInProgress = !this.showInProgress;
  }

  toggleCompletedTasks() {
    this.showCompleted = !this.showCompleted;
  }

  selectTask(task: MaintenanceTask) {
    this.selectedTask = task; // Set the selected task
  }

  goToMaintenance() {
    this.router.navigate(['/maintenance']);
  }

  goToReports() {
    this.router.navigate(['../report']);
  }
}
