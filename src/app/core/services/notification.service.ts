import { Injectable } from '@angular/core';
import {
  LocalNotifications,
  LocalNotificationSchema,
  ActionType,
  LocalNotificationActionPerformed,
  ScheduleOptions,
  PermissionStatus,
} from '@capacitor/local-notifications';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private platform: Platform) {
    this.initialize();
  }

  private async initialize() {
    if (this.platform.is('capacitor')) {
      try {
        // Check permissions on init
        const permStatus = await this.checkPermissions();
        if (permStatus.display !== 'granted') {
          await this.requestPermissions();
        }
  
        // Check exact alarm setting for Android
        if (this.platform.is('android')) {
          const exactSetting = await LocalNotifications.checkExactNotificationSetting();
          console.log('Exact notification setting:', exactSetting);
        }
  
        // Register default action types
        await this.registerDefaultActionTypes();
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    }
  }

  private async registerDefaultActionTypes() {
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'CHAT_MESSAGE',
          actions: [
            {
              id: 'reply',
              title: 'Reply',
              input: true
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
            }
          ]
        }
      ]
    });
  }

  async scheduleNotification(options: {
    title: string;
    body: string;
    id?: number;
    schedule?: { at: Date; allowWhileIdle?: boolean };
    actionTypeId?: string;
    extra?: any;
  }) {
    const notificationId = options.id || Math.floor(Math.random() * 100000);

    const notificationOptions: ScheduleOptions = {
      notifications: [
        {
          title: options.title,
          body: options.body,
          id: notificationId,
          schedule: options.schedule,
          extra: options.extra,
          actionTypeId: options.actionTypeId,
          sound: 'content://settings/system/notification_sound',  // Use Android system notification sound
          smallIcon: 'ic_stat_icon_config_sample', // Make sure this icon exists
          iconColor: '#488AFF'
        }
      ]
    };
    

    try {
      await LocalNotifications.schedule(notificationOptions);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async checkPermissions(): Promise<PermissionStatus> {
    return await LocalNotifications.checkPermissions();
  }

  async requestPermissions(): Promise<PermissionStatus> {
    return await LocalNotifications.requestPermissions();
  }

  async getPendingNotifications(): Promise<LocalNotificationSchema[]> {
    const { notifications } = await LocalNotifications.getPending();
    return notifications;
  }

  async cancelNotification(id: number): Promise<void> {
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }

  async cancelAllNotifications(): Promise<void> {
    const pending = await this.getPendingNotifications();
    await LocalNotifications.cancel({
      notifications: pending.map(notification => ({ id: notification.id }))
    });
  }

  async getDeliveredNotifications(): Promise<LocalNotificationSchema[]> {
    const { notifications } = await LocalNotifications.getDeliveredNotifications();
    return notifications;
  }

  addNotificationReceivedListener(
    callback: (notification: LocalNotificationSchema) => void
  ) {
    return LocalNotifications.addListener('localNotificationReceived', callback);
  }

  addNotificationActionPerformedListener(
    callback: (notification: LocalNotificationActionPerformed) => void
  ) {
    return LocalNotifications.addListener('localNotificationActionPerformed', callback);
  }

  removeAllListeners() {
    LocalNotifications.removeAllListeners();
  }
}