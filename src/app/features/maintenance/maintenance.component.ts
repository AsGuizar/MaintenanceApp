import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent {
  public newTask: MaintenanceTask = {
    id: this.generateId(),
    description: '',
    category: '',
    reminderDate: new Date(),
    date: new Date(),
    status: 'pending',
    frequency: 'unique',
    attachments: []
  };

  public isEditing: boolean = false;
  private currentTaskId: number = 0;
  public selectedCategory: string = '';
  public isCustomCategory: boolean = false;
  public expandedTaskId: number | null = null; // Track which task is expanded

  constructor(
    public maintenanceService: MaintenanceService,
    private router: Router,
    private localNotifications: LocalNotifications,
    private notificationService: NotificationService
  ) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  goToSettings() {
    this.router.navigate(['../settings']);
  }

  goToReports() {
    this.router.navigate(['../report']);
  }

  onCategoryChange() {
    this.isCustomCategory = this.selectedCategory === 'Other';
    this.newTask.category = this.isCustomCategory ? '' : this.selectedCategory;
  }

  addTask() {
    // Ensure the reminder date is in the future
    if (new Date(this.newTask.reminderDate) <= new Date()) {
      console.error('Reminder date must be in the future.');
      return;
    }
    this.maintenanceService.addTask(this.newTask);
    this.scheduleNotification(this.newTask);
    this.resetTask();
  }

  editTask(task: MaintenanceTask) {
    this.isEditing = true;
    this.currentTaskId = task.id;
    this.newTask = { ...task };
    this.selectedCategory = task.category;
    this.isCustomCategory = this.selectedCategory === 'Other';
  }

  updateTask() {
    this.localNotifications.cancel(this.currentTaskId);
    this.maintenanceService.updateTask(this.newTask);
    this.scheduleNotification(this.newTask);
    this.resetTask();
  }

  deleteTask(taskId: number) {
    this.maintenanceService.deleteTask(taskId);
    this.localNotifications.cancel(taskId.toString()); // Convert taskId to string before passing
    this.notificationService.scheduleNotification(
      'Maintenance Reminder Cancelled',
      `Reminder for task ID ${taskId.toString()} has been cancelled.`,
      { at: new Date() } // Notify at the current time
    );
  }

  resetTask() {
    this.newTask = {
      id: this.generateId(),
      description: '',
      category: '',
      reminderDate: new Date(),
      date: new Date(),
      status: 'pending',
      frequency: 'unique',
      attachments: []
    };
    this.selectedCategory = '';
    this.isEditing = false;
    this.currentTaskId = 0;
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      const files = Array.from(fileInput.files);
      this.newTask.attachments = files.map(file => file.name);
    }
  }

  toggleTaskDetails(task: MaintenanceTask) {
    this.expandedTaskId = this.expandedTaskId === task.id ? null : task.id; // Toggle task details
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  private scheduleNotification(task: MaintenanceTask) {
    this.localNotifications.schedule({
      id: task.id,
      title: 'Maintenance Reminder',
      text: `Reminder for: ${task.description}`,
      trigger: { at: new Date(task.reminderDate) },
      foreground: true
    });
  }
}
