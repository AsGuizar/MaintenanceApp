import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { NotificationService } from '../../core/services/notification.service';
import { MaintenanceTask } from '../../models/maintenance.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public tasks: MaintenanceTask[] = [];
  public filteredTasks: MaintenanceTask[] = [];
  public selectedCategory: string = 'all';
  public expandedTaskId: number | null = null;

  constructor(
    private router: Router,
    private maintenanceService: MaintenanceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  // Load tasks and set notifications
  loadTasks() {
    this.tasks = this.maintenanceService.getTasks();
    this.filterTasks();
    this.scheduleUpcomingNotifications();
  }

  // Filter tasks based on selected category
  filterTasks() {
    this.filteredTasks = this.selectedCategory === 'all'
      ? this.tasks
      : this.tasks.filter(task => task.category === this.selectedCategory);
  }

  // Schedule notifications for upcoming tasks
  scheduleUpcomingNotifications() {
    const now = new Date();
    this.tasks.forEach(task => {
      if (new Date(task.reminderDate) > now) {
        this.notificationService.scheduleNotification(
          'Upcoming Task',
          `Don't forget to: ${task.description}`,
          { at: new Date(task.reminderDate) }
        );
      }
    });
  }

  // Toggle task details view
  toggleTaskDetails(task: MaintenanceTask) {
    this.expandedTaskId = this.expandedTaskId === task.id ? null : task.id;
  }

  // Navigate to Maintenance component to add new tasks
  goToMaintenance() {
    this.router.navigate(['/maintenance']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToReports() {
    this.router.navigate(['/report']);
  }

  // Mark task as completed
  markAsCompleted(task: MaintenanceTask) {
    task.status = 'completed';
    this.maintenanceService.updateTask(task);
    this.loadTasks();
  }

  // Edit task
  editTask(task: MaintenanceTask) {
    this.router.navigate(['/maintenance'], { state: { task } });
  }

  // Delete task
  deleteTask(taskId: number) {
    this.maintenanceService.deleteTask(taskId);
    this.loadTasks();
  }
}
