import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationUiService } from 'src/app/notification-ui.service';

@Component({
  selector: 'app-temp-create-popup-modal',
  templateUrl: './temp-create-popup-modal.component.html',
  styleUrls: ['./temp-create-popup-modal.component.scss'],
})
export class TempCreatePopupModalComponent implements OnInit {

  form!: FormGroup;
  @Input() template: any;
  @Input() categoryList: any;

  constructor(private modalController: ModalController,
    private alertController: AlertController,
    private router: Router, public notifiService: NotificationUiService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.template.name, {
        validators: [Validators.required]
      }),
      category_id: new FormControl(this.template.category_id, {
        validators: [Validators.required]
      })
    })
  }

  async confirmCancel() {
    this.modalController.dismiss();
  }

  proceed() {
    if (!this.form.valid) return;
    this.modalController.dismiss();
  }

}
