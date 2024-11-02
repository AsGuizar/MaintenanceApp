// src/app/app.module.ts - Main module of the app
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthService } from './core/services/auth.service';
import { MaintenanceService } from './core/services/maintenance.service';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { MaintenanceComponent } from './features/maintenance/maintenance.component';
import { ReportComponent } from './features/report/report.component';  // Ensure ReportComponent is imported
import { SettingsComponent } from './features/settings/settings.component'; // Ensure SettingsComponent is imported

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MaintenanceComponent,
    ReportComponent, // Add ReportComponent to declarations
    SettingsComponent // Add SettingsComponent to declarations
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    MaintenanceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
