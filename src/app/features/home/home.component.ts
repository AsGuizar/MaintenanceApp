import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { MaintenanceService } from '../../core/services/maintenance.service';
import { AuthService } from '../../core/services/auth.service'; // Import AuthService
import { MaintenanceTask } from '../../models/maintenance.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public userName: string; // Declare userName
  public tasks: MaintenanceTask[] = []; // Array to hold maintenance tasks

  constructor(
    public maintenanceService: MaintenanceService,
    private authService: AuthService, // Inject AuthService
    private router: Router
  ) {
    this.userName = this.authService.getUserName(); // Get user name from AuthService
    this.loadTasks(); // Load tasks when the component is initialized
  }

  loadTasks() {
    this.tasks = this.maintenanceService.getTasks(); // Load tasks from the maintenance service
  }

  // Navigation methods
  goToReports() {
    this.router.navigate(['../report']); // Navigate to the reports page
  }

  goToSettings() {
    this.router.navigate(['../settings']); // Navigate to the settings page
  }

  goToMaintenance() {
    this.router.navigate(['../maintenance']); // Navigate to the maintenance page
  }

  openAttachment(attachment: string) {
    // Open the attachment in a new tab/window
    window.open(attachment, '_blank'); // This opens the attachment in a new tab
  }

  viewImage(imageSrc: string) {
    // Open the image in a larger view (in a modal or a new tab)
    window.open(imageSrc, '_blank'); // Opens the image in a new tab
  }
}
