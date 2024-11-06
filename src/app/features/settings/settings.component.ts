// src/app/features/settings/settings.component.ts
//Comentario para subir las actualizaciones de rxjs xd
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  categories: string[] = ['House', 'Vehicles', 'Health', 'Pets'];
  newCategory: string = '';

  addCategory() {
    if (this.newCategory.trim()) {
      this.categories.push(this.newCategory.trim());
      this.newCategory = ''; // Clear input field after adding
    }
  }
}
