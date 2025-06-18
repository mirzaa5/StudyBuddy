import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastController: ToastController) { }

  async showToast(message: string, type: 'success' | 'error' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: type === 'success' ? 'success' : type === 'error' ? 'danger' : 'warning',
      buttons: [{
        text: 'Dismiss',
        role: 'cancel'
      }]
    });
    await toast.present();
  }
} 