import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NotificationUiService } from 'src/app/notification-ui.service';

@Component({
  selector: 'app-device-view-page',
  templateUrl: './device-view-page.component.html',
  styleUrls: ['./device-view-page.component.scss'],
})
export class DeviceViewPageComponent implements OnInit {

  deviceDetails: any = {};
  deviceId: any;

  deviceStaticFieldList = [
    { "name": "Channel Type", key: "channel_type" },
    { "name": "Identifier", key: "identifier" },
    { "name": "Language", key: "language" },
    { "name": "External User ID", key: "external_user_id" },
    { "name": "App version", key: "app_version" },
    { "name": "Device Model", key: "device_model" },
    { "name": "Device OS", key: "device_os" },
    { "name": "Latitude", key: "latitude" },
    { "name": "Longitude", key: "longitude" },
    { "name": "Country", key: "country" },
    { "name": "Time Zone", key: "timezone" },
    { "name": "Created Time", key: "updatedAt", type: "DATE_TIME" }
  ];
  constructor(private notifiService: NotificationUiService, private actRouter: ActivatedRoute) { }

  ngOnInit() {
    this.actRouter.paramMap.subscribe((param: Params) => {
      this.deviceId = JSON.parse(param['get']("device_id"));
      this.notifiService.getDeviceById(this.deviceId).subscribe((deviceDetails: any) => {
        this.deviceDetails = deviceDetails;
      })
    });

  }
}
