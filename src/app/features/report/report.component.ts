import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MaintenanceTask } from '../../models/maintenance.model';
import { Router } from '@angular/router';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  tasks: MaintenanceTask[] = [];
  filteredTasks: MaintenanceTask[] = [];
  startDate: string = '';
  endDate: string = '';
  addedTasks: MaintenanceTask[] = [];
  inProgressTasks: MaintenanceTask[] = [];
  finishedTasks: MaintenanceTask[] = [];
  selectedCategory: string = '';
  dateError: boolean = false;
  fileName: string = 'Maintenance_Report'; // Default file name
  isLoading: boolean = false; // Loading state for feedback

  constructor(private maintenanceService: MaintenanceService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.maintenanceService.getTasks(); // Assuming this returns all tasks
  }

  // Check if date is in a valid format
  isValidDate(date: string): boolean {
    return !isNaN(Date.parse(date));
  }

  generateReport() {
    // Reset date error
    this.dateError = false;

    if (!this.isValidDate(this.startDate) || !this.isValidDate(this.endDate)) {
      this.dateError = true;
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // Check if start date is before end date
    if (start > end) {
      this.dateError = true;
      return;
    }

    // Filter tasks by date range and selected category
    this.addedTasks = this.tasks.filter(task =>
      new Date(task.date) >= start &&
      new Date(task.date) <= end &&
      (this.selectedCategory === '' || task.category === this.selectedCategory || 
        (this.selectedCategory === 'Other' && task.category !== 'House' && task.category !== 'Pets' && task.category !== 'Health' && task.category !== 'Vehicles')) // Handle 'Other' category
    );

    this.inProgressTasks = this.tasks.filter(task =>
      task.status === 'in progress' &&
      new Date(task.date) >= start &&
      new Date(task.date) <= end &&
      (this.selectedCategory === '' || task.category === this.selectedCategory || 
        (this.selectedCategory === 'Other' && task.category !== 'House' && task.category !== 'Pets' && task.category !== 'Health' && task.category !== 'Vehicles'))
    );

    this.finishedTasks = this.tasks.filter(task =>
      task.status === 'completed' &&
      new Date(task.date) >= start &&
      new Date(task.date) <= end &&
      (this.selectedCategory === '' || task.category === this.selectedCategory || 
        (this.selectedCategory === 'Other' && task.category !== 'House' && task.category !== 'Pets' && task.category !== 'Health' && task.category !== 'Vehicles'))
    );
  }

  // Method to download the report as CSV using Capacitor's Filesystem
  async downloadReport() {
    let csvContent = 'Description,Status,Due Date,Category,Image File\n';
  
    // Combine all tasks for the report
    const allTasks = [...this.addedTasks, ...this.inProgressTasks, ...this.finishedTasks];
  
    allTasks.forEach(task => {
      // Escape the commas and quotes in the task description to ensure valid CSV formatting
      const description = task.description.replace(/"/g, '""'); // Escape double quotes
      
      // Check if imagePath exists and escape it, otherwise use an empty string
      const imageFile = task.imagePath ? task.imagePath.replace(/"/g, '""') : ''; // Safe access to imagePath
      
      const row = `"${description}",${task.status},"${task.date}","${task.category}","${imageFile}"`; // Quote values
      csvContent += row + '\n';
    });
    
  
    // Show loading spinner
    this.isLoading = true;
  
    // Generate a custom file name based on the selected date range or other logic
    const customFileName = `${this.fileName}_${this.startDate}_${this.endDate}.csv`;
  
    try {
      // Add BOM (Byte Order Mark) for UTF-8 encoding to ensure compatibility with Excel
      const bom = '\uFEFF'; // BOM for UTF-8
      const csvWithBOM = bom + csvContent;
  
      // Write the CSV file to the device's documents directory
      await Filesystem.writeFile({
        path: customFileName,
        data: csvWithBOM,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
  
      // Hide loading spinner and notify the user
      this.isLoading = false;
      alert('Report downloaded successfully!');
    } catch (error) {
      // Hide loading spinner and show error
      this.isLoading = false;
      console.error('Error writing file', error);
      alert('Failed to download report. Please try again.');
    }
  }
  

  // Navigation methods
  goHome() {
    this.router.navigate(['/home']);
  }


  goToMaintenance() {
    this.router.navigate(['../maintenance']);
  }
}
