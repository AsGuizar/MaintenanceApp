import { Component } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'; // Import Local Notifications
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private localNotifications: LocalNotifications, private platform: Platform) {
    this.platform.ready().then(() => {
      this.requestPermissions();
    });
  }

  private requestPermissions() {
    this.localNotifications.requestPermission().then(granted => {
      if (granted) {
        console.log('Permission granted for notifications');
      } else {
        console.log('Permission denied for notifications');
      }
    });
  }
}
