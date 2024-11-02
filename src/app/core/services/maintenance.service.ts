// maintenance.service.ts - Manages maintenance tasks in local storage
import { Injectable } from '@angular/core';
import { MaintenanceTask } from '../../models/maintenance.model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private tasks: MaintenanceTask[] = [];

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
    

    // maintenance.service.ts (update)
backupTasks() {
    const dataStr = JSON.stringify(this.tasks);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance_tasks_backup.json';
    a.click();
    window.URL.revokeObjectURL(url);
}


  addTask(task: MaintenanceTask) {
    this.tasks.push(task);
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    // maintenance.service.ts (update)
    setReminder(task: MaintenanceTask, reminderDate: Date) {
        const currentTime = new Date().getTime();
        const reminderTime = reminderDate.getTime();
        
        if (reminderTime > currentTime) {
            const timeUntilReminder = reminderTime - currentTime;

            setTimeout(() => {
                alert(`Reminder: ${task.description} is due!`);
            }, timeUntilReminder);
        }
    }

}
