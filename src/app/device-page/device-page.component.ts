import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertController, ToastController } from '@ionic/angular';

import { NotificationUiService } from 'src/app/notification-ui.service';

@Component({
  selector: 'app-device-page',
  templateUrl: './device-page.component.html',
  styleUrls: ['./device-page.component.scss'],
})
export class DevicePageComponent implements OnInit {

  dataSource: any;
  displayedColumns = [
    'channel_type',
    'identifier',
    'external_user_id',
    'country',
    'timezone',
    'createdAt',
    'final'
  ];
  showSpinner = false;
  @ViewChild(MatPaginator) paginators!: MatPaginator;
  @ViewChild(MatSort) sorts!: MatSort;
  @ViewChild('mytable', { read: ElementRef }) public widgetsContent!: ElementRef<any>;

  constructor(private notifiService: NotificationUiService, private toastController: ToastController, private alertController: AlertController) { }

  ngOnInit() {
    this.getAllDevice();
  }

  getAllDevice() {
    this.showSpinner = true;
    this.notifiService.getAllDevice().subscribe((deviceList: any) => {
      this.dataSource = new MatTableDataSource(deviceList);
      this.table_material();
      this.showSpinner = false;
    });
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

  deleteDevice(id: any) {
    this.notifiService.deleteDeviceById(id).subscribe({
      next: (data: any) => {
        this.notifiService.toster.success("Device Deleted successfully!");
        this.getAllDevice();
      },
      error: (err: any) => {
        err = err.error || err;
        this.notifiService.toster.error(err.message || "Device Delete Failed");
      }
    });
  }

  async confirmDelete(id: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'All the device information will be erased.',
      cssClass: 'custom-alert-style',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'alert-button-confirm',

          handler: () => {
            this.deleteDevice(id);
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
