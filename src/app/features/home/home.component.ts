// home.component.ts - Displays summary of maintenance tasks
import { Component } from '@angular/core';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  tasks: MaintenanceTask[] = [];

  constructor(public maintenanceService: MaintenanceService) {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.maintenanceService.getTasks();
  }
}
