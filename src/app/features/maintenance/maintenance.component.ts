// src/app/features/maintenance/maintenance.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';

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
  };

  public isEditing: boolean = false;
  private currentTaskId: string = '';
  public selectedCategory: string = '';
  public isCustomCategory: boolean = false;

  constructor(public maintenanceService: MaintenanceService, private router: Router) {} // Inject Router

  goHome() {
    this.router.navigate(['/home']); // Navigate to home
  }

  goToSettings() {
    this.router.navigate(['../settings']); // Navigate to settings
  }

  goToReports() {
    this.router.navigate(['../report']); // Navigate to reports
  }

  onCategoryChange() {
    this.isCustomCategory = this.selectedCategory === 'Other';
    if (!this.isCustomCategory) {
      this.newTask.category = this.selectedCategory;
    } else {
      this.newTask.category = '';
    }
  }

  addTask() {
    this.maintenanceService.addTask(this.newTask);
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
    this.maintenanceService.updateTask(this.newTask);
    this.resetTask();
  }

  deleteTask(taskId: string) {
    this.maintenanceService.deleteTask(taskId);
  }

  resetTask() {
    this.newTask = {
      id: this.generateId(),
      description: '',
      category: '',
      reminderDate: new Date(),
      date: new Date(),
      status: 'pending',
    };
    this.selectedCategory = '';
    this.isEditing = false;
    this.currentTaskId = '';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
