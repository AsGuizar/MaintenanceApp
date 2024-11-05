// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private localNotifications: LocalNotifications) {}

  scheduleNotification(title: string, text: string, trigger: any) {
    this.localNotifications.schedule({
      title: title,
      text: text,
      trigger: trigger,
    });
  }
}
