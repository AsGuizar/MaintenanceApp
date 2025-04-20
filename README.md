# 🛠️ MaintenanceApp

A mobile application built with **Ionic Framework** and **Angular** that helps users efficiently manage maintenance tasks across home, vehicles, personal health, and pet care.

## 🎯 Purpose

**MaintenanceApp** streamlines the planning, tracking, and reporting of preventive maintenance activities. With reminders, custom categories, and local data storage, users stay organized and extend the life of their assets.

## ✨ Key Features

- **Multi-category Maintenance**
  - 🏠 Home: plumbing, painting, cleaning, etc.
  - 🚗 Vehicles: oil changes, brake checks, insurance reminders, and mileage tracking
  - 🏥 Personal Health: medical appointments, insurance renewals, and check-up reminders
  - 🐶 Pets: veterinary visits, vaccinations, feeding, and walking schedules
  - 🗂️ Custom "Other" category support

- **Reminders & Notifications**
  - ⏰ Configurable alerts for upcoming tasks
  - 🔔 Local notifications via Capacitor

- **Reports**
  - 📅 Filter by category, date range, and status
  - 📊 View historical tasks and associated costs
  - 📁 Export or share report data

- **Task Management**
  - ✅ Create, edit, and delete tasks with detailed notes and images
  - 📌 Status control (e.g., In Progress, Completed) via dropdowns

- **Security**
  - 🔒 Local authentication 
  - ☁️ Automated backups using Capacitor Filesystem

## 🗃️ Data Storage

The app stores all data locally on the device using browser's localStorage, ensuring user privacy:

```typescript
// All task data remains on the device
saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(this.tasks));
}
```

✅ No external databases or cloud dependencies - fully offline and private

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Ionic Framework 7 |
| Frontend | Angular 18 |
| Storage | Browser localStorage |
| Backup | Capacitor Filesystem |
| Notifications | @capacitor/local-notifications + @ionic-native/local-notifications |
| Icons | Ionicons |
| Reactive | RxJS |
| Language | TypeScript 5.x |
| Styling | SCSS (light & dark theme support) |

## 🚀 Installation & Execution

To run the app locally on Android or iOS:

1. Clone the repository
```bash
git clone https://github.com/AsGuizar/MaintenanceApp.git
cd MaintenanceApp
```

2. Install dependencies
```bash
npm install
```

3. Add Capacitor platforms
```bash
ionic cap add android
# or for iOS
ionic cap add ios
```

4. Build the project
```bash
ionic build
```

5. Sync Capacitor
```bash
npx cap sync
```

6. Open in IDE
```bash
npx cap open android
# or
npx cap open ios
```

7. Run the app
   
   Use Android Studio or Xcode, or run:
```bash
ionic cap run android --target=<device-id>
ionic cap run ios --target=<device-id>
```

## 📋 License

Developed as part of an academic evaluation.

Free to use for educational or personal development purposes.
