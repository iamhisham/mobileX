import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class NotificationUiService {

  URL = "https://jauhn517og.execute-api.us-east-1.amazonaws.com/dev";

  constructor(private http: HttpClient, private toastController: ToastController, private alertController: AlertController, private router: Router) { }

  customPopoverOptions: any = {
    cssClass: 'popover-wide',
  };

  toster = {
    success: (message: string) => {
      this.toster.show("SUCCESS", message);
    },
    error: (message: any) => {
      this.toster.show("ERROR", message);
    },
    show: async (type: string, message: any) => {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        icon: type == "SUCCESS" ? 'checkmark-outline' : 'close-outline',
        cssClass: type == "SUCCESS" ? 'toaster-style' : 'cancel-toaster-style',
        position: 'bottom',
      });
      await toast.present();
    }
  }

  async showCancelConfirmation(routerValue: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'Changes you made may not be saved.',
      cssClass: 'custom-alert-style',
      buttons: [
        {
          text: 'Leave',
          cssClass: 'alert-button-confirm custom-btn-paddding',
          handler: () => { this.router.navigate(routerValue) }
        },
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel custom-btn-paddding',
        },
      ],
    });
    await alert.present();
  }

  //category
  getAllCategory() {
    return this.http.get<any>(`${this.URL}/category`);
  }

  getCategoryById(id: any) {
    return this.http.get(`${this.URL}/category/${id}`)
  }

  createCategoty(data: any) {
    return this.http.post<any>(`${this.URL}/category`, data);
  }

  updateCategoryById(id: any, data: any) {
    return this.http.put(`${this.URL}/category/${id}`, data);
  }

  deleteCategoryById(id: any) {
    return this.http.delete<any>(`${this.URL}/category/${id}`);
  }

  //Template
  getAllTemplate(category_id?: any) {
    var params = category_id ? { params: { category_id } } : {}
    return this.http.get<any>(`${this.URL}/template`, params);
  }

  getTemplateById(id: any) {
    return this.http.get(`${this.URL}/template/${id}`)
  }

  createTemplate(data: any) {
    return this.http.post<any>(`${this.URL}/template`, data);
  }

  updateTemplateById(id: any, data: any) {
    return this.http.put(`${this.URL}/template/${id}`, data);
  }

  deleteTemplateById(id: any) {
    return this.http.delete<any>(`${this.URL}/template/${id}`);
  }

  deleteTemplateByCategoryId(id: any) {
    return this.http.delete<any>(`${this.URL}/template/category/${id}`);
  }

  remapCategory(data: any) {
    return this.http.put(`${this.URL}/template/remap`, data);
  }


  //Device
  getAllDevice() {
    return this.http.get<any>(`${this.URL}/device`);
  }

  getDeviceById(id: any) {
    return this.http.get(`${this.URL}/device/${id}`)
  }

  deleteDeviceById(id: any) {
    return this.http.delete<any>(`${this.URL}/device/${id}`);
  }


  //Notification
  getAllNotification() {
    return this.http.get<any>(`${this.URL}/notification`);
  }

  getNotificationById(id: any) {
    return this.http.get(`${this.URL}/notification/${id}`)
  }

  saveDraftNotification(data: any) {
    return this.http.post(`${this.URL}/notification/save_as_draft`, data);
  }

  updateDraftNotification(id: any, data: any) {
    return this.http.put(`${this.URL}/notification/${id}`, data);
  }

  sendNotification(data: any) {
    return this.http.post(`${this.URL}/notification/send`, data);
  }

  scheduleNotification(data: any) {
    return this.http.post(`${this.URL}/notification/schedule`, data);
  }

  deleteNotificationById(id: any) {
    return this.http.delete<any>(`${this.URL}/notification/${id}`);
  }

}
