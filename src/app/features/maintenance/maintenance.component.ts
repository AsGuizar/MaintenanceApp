import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NotificationService } from '../../core/services/notification.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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
    attachments: [],
    imagePath: '',  // Add imagePath to the task model
  };

  public isEditing: boolean = false;
  private currentTaskId: number = 0;
  public selectedCategory: string = '';
  public isCustomCategory: boolean = false;
  public expandedTaskId: number | null = null;

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
    this.currentTaskId = task.id;
    this.newTask = { ...task };
    this.selectedCategory = task.category;
    this.isCustomCategory = this.selectedCategory === 'Other';
  }

  updateTask() {
    if (new Date(this.newTask.reminderDate) <= new Date()) {
      console.error('Reminder date must be in the future.');
      return;
    }
    this.localNotifications.cancel(this.currentTaskId);
    this.maintenanceService.updateTask(this.newTask);
    this.scheduleNotification(this.newTask);
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
      frequency: 'unique',
      attachments: [],
      imagePath: '',  // Reset image path
    };
    this.selectedCategory = '';
    this.isEditing = false;
    this.currentTaskId = 0;
  }

  deleteTask(taskId: number) {
    this.maintenanceService.deleteTask(taskId);
    this.localNotifications.cancel(taskId);
    this.notificationService.scheduleNotification(
      'Maintenance Reminder Cancelled',
      `Reminder for task ID ${taskId} has been cancelled.`,
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

  // Handle image uploads
  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      const imageFile = fileInput.files[0];  // Handle only the first selected image
      this.uploadImage(imageFile);
    }
  }

  // Upload image to filesystem
  async uploadImage(imageFile: File) {
    try {
      // Generate a unique path for storing the image
      const fileName = `task_${this.newTask.id}_${imageFile.name}`;
      const filePath = `${Directory.Data}/${fileName}`;

      // Write the image to the filesystem
      const result = await Filesystem.writeFile({
        path: filePath,
        data: imageFile,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      // Set the image path in the task object
      this.newTask.imagePath = result.uri;

      console.log('Image uploaded successfully:', result.uri);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  toggleTaskDetails(task: MaintenanceTask) {
    // Toggle the expanded task details
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
      foreground: true,
    });
  }
}
