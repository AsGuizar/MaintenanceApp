import { Injectable } from '@angular/core';
import { MaintenanceTask } from '../../models/maintenance.model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  public tasks: MaintenanceTask[] = [];

  constructor() {
    this.loadTasks();
  }

  loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
  }

  getTasks(): MaintenanceTask[] {
    return this.tasks;
  }

  // Method to add a task
  addTask(task: MaintenanceTask) {
    this.tasks.push(task);
    this.saveTasks();
  }

  // Method to update an existing task
  updateTask(updatedTask: MaintenanceTask) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
    }
  }

  // Method to delete a task
  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  backupTasks() {
    const dataStr = JSON.stringify(this.tasks);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks_backup.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
