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

  goToReports() {
    this.router.navigate(['../report']);
  }

  goToSettings() {
    this.router.navigate(['../settings']);
  }

  onCategoryChange() {
    this.isCustomCategory = this.selectedCategory === 'Other';
    this.newTask.category = this.isCustomCategory ? '' : this.selectedCategory;
  }

  addTask() {
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
    this.currentTaskId = task.id;  // Keep track of the task being edited
    this.newTask = { ...task };    // Copy task details to form
    this.selectedCategory = task.category;  // Set the selected category
    this.isCustomCategory = this.selectedCategory === 'Other';  // Handle custom category
  }

  updateTask() {
    if (new Date(this.newTask.reminderDate) <= new Date()) {
      console.error('Reminder date must be in the future.');
      return;
    }
    this.localNotifications.cancel(this.currentTaskId);
    this.maintenanceService.updateTask(this.newTask);  // Update the existing task
    this.scheduleNotification(this.newTask);  // Reschedule notification after update
    this.resetTask();  // Reset form
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

  deleteTask(taskId: number) {
    this.maintenanceService.deleteTask(taskId);
    this.localNotifications.cancel(taskId.toString());
    this.notificationService.scheduleNotification(
      'Maintenance Reminder Cancelled',
      `Reminder for task ID ${taskId.toString()} has been cancelled.`,
      { at: new Date() }
    );
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      const files = Array.from(fileInput.files);
      this.newTask.attachments = files.map(file => file.name);
    }
  }

  // Toggle the task details when clicked
  toggleTaskDetails(task: MaintenanceTask) {
    this.expandedTaskId = this.expandedTaskId === task.id ? null : task.id;
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
