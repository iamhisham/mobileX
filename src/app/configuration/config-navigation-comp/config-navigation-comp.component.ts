import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-navigation-comp',
  templateUrl: './config-navigation-comp.component.html',
  styleUrls: ['./config-navigation-comp.component.scss'],
})
export class ConfigNavigationCompComponent implements OnInit {
  @Input() activeMenu: string = '';
  
  constructor() {}

  ngOnInit() {}
}
