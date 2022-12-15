import { Component, OnInit } from '@angular/core';
import { NotificationUiService } from 'src/app/notification-ui.service';

@Component({
  selector: 'app-dynamic-tags-model',
  templateUrl: './dynamic-tags-model.component.html',
  styleUrls: ['./dynamic-tags-model.component.scss'],
})
export class DynamicTagsModelComponent implements OnInit {

  constructor(public notifiService: NotificationUiService) { }

  ngOnInit() { }

}
