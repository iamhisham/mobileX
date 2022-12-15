import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertController, ToastController } from '@ionic/angular';
import { NotificationUiService } from '../notification-ui.service';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss'],
})
export class NotificationPageComponent implements OnInit {
  dataSource: any;
  displayedColumns = [
    'id',
    'is_bulk_notification',
    'status',
    'createdAt',
    'scheduled_at',
    'final'
  ];
  showSpinner = false;
  notificationList: any = [];
  selectedStatusList: any = ["CREATED", "SCHEDULED", "TRIGGERED"];
  statusList = [
    { id: "CREATED", name: "Created" },
    { id: "SCHEDULED", name: "Scheduled" },
    { id: "TRIGGERED", name: "Triggered" }
  ];
  date = 12 / 2 / 2021;
  @ViewChild(MatPaginator) paginators!: MatPaginator;
  @ViewChild(MatSort) sorts!: MatSort;
  // for scrollRight
  @ViewChild('mytable', { read: ElementRef }) public widgetsContent!: ElementRef<any>;
  constructor(private notifiService: NotificationUiService, private toastController: ToastController, private alertController: AlertController) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getAllNotification();
  }

  getAllNotification() {
    this.showSpinner = true;
    this.notifiService.getAllNotification().subscribe((notification: any) => {
      this.notificationList = notification;
      this.loadedNotificationData();
    });
  }

  loadedNotificationData() {
    this.showSpinner = true;
    var notificationList = this.notificationList.filter((notification: any) => this.selectedStatusList.indexOf(notification.status) != -1);

    this.dataSource = new MatTableDataSource(notificationList);
    this.table_material();
    this.showSpinner = false;
  }

  selectOrUnselectAllNotification(event: any) {
    if (!event.target.checked) {
      this.selectedStatusList = ["CREATED", "SCHEDULED", "TRIGGERED"];
    } else {
      this.selectedStatusList = [];
    }
    this.loadedNotificationData();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  //notification filter
  filterednotification(event: any, status: any) {
    if (!event.target.checked) {
      this.selectedStatusList.push(status);
    } else {
      this.selectedStatusList.splice(this.selectedStatusList.findIndex((data: any) => data === status), 1);
    }
    this.loadedNotificationData();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  table_material() {
    //angualar material
    this.dataSource.sort = this.sorts;
    this.dataSource.paginator = this.paginators;
    this.paginators._intl.itemsPerPageLabel = "Display";
  }
  //search btn filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 340;
  }

  deleteNotification(id: any) {
    this.notifiService.deleteNotificationById(id).subscribe({
      next: (data: any) => {
        this.notifiService.toster.success("Notification Deleted successfully!");
        this.getAllNotification();
      },
      error: (err: any) => {
        err = err.error || err;
        this.notifiService.toster.error(err.message || "Notification Delete Failed");
      }
    });
  }

  async confirmDelete(id: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'Changes you made will be deleted.',
      cssClass: 'custom-alert-style',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'alert-button-confirm',

          handler: () => {
            this.deleteNotification(id);
          }
        },
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
        },
      ],
    });
    await alert.present();
  }
}
