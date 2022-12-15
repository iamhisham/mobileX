/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isMenuCollapse = true;
  menuList = [
    {
      title: 'Dashboard',
      image: 'logo-apple-ar',
      link: 'dashboard',
    },
    {
      title: 'Configuration',
      image: 'options-outline',
      link: 'configuration',
    },
    {
      title: 'Device',
      image: 'desktop-outline',
      link: 'device',
    },
    {
      title: 'Notification',
      image: 'notifications-outline',
      link: 'notification',
    },
  ];

  customPopoverOptions: any = {
    cssClass: 'popover-wide',
  };
  constructor() { }

  ngOnInit() { }
}
