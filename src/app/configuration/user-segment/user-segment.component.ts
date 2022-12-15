import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-segment',
  templateUrl: './user-segment.component.html',
  styleUrls: ['./user-segment.component.scss'],
})
export class UserSegmentComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  childData: any;
  parentMethod(data: any) {
    this.childData = data;
  }
}
