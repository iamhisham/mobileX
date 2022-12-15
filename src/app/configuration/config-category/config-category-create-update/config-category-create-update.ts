/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NotificationUiService } from 'src/app/notification-ui.service';

@Component({
  selector: 'app-config-category-create-update',
  templateUrl: './config-category-create-update.html',
  styleUrls: ['./config-category-create-update.scss'],
})
export class ConfigCategoryCreateUpdateComponent implements OnInit {

  form!: FormGroup;
  catagoryId: any;
  category: any = {};
  isEditView: boolean = false;
  rateLimit_type: string = '';
  rateLimit_value: any = null;

  constructor(private alertController: AlertController, private router: Router,
    public notifiService: NotificationUiService, private toastController: ToastController,
    public platform: Platform, private actRouter: ActivatedRoute) { }

  isInitTriggered: boolean = false;
  ngOnInit() {
    this.init();
  }

  ionViewWillEnter() {
    this.init();
  }

  ionViewWillLeave() {
    this.isInitTriggered = false;
  }

  resetAll() {
    this.catagoryId = null;
    this.category = {};
    this.isEditView = false;
    this.rateLimit_type = '';
    this.rateLimit_value = null;
  }

  init() {
    if (this.isInitTriggered) return;
    this.isInitTriggered = true;
    this.resetAll();

    this.actRouter.paramMap.subscribe((param: Params) => {
      this.catagoryId = JSON.parse(param['get']('category_id'));
      if (this.catagoryId != null) {
        this.isEditView = true;
        this.getCategoryById(this.catagoryId);
      };
    });
    this.validateForm();
  }

  getCategoryById(catagoryId: any) {
    this.notifiService.getCategoryById(catagoryId).subscribe((category: any) => {
      this.category = category;
      const rateLimitSplit = (this.category.rate_limit || '').split(' per ');
      if (rateLimitSplit.length == 2) {
        this.rateLimit_value = rateLimitSplit[0];
        this.rateLimit_type = rateLimitSplit[1];
      }
    });
  }

  validateForm() {
    this.form = new FormGroup({
      name: new FormControl(this.category.name, {
        validators: [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]
      }),
      priority: new FormControl(this.category.priority, {
        validators: [Validators.required]
      }),
      timetoliveLimit: new FormControl(this.category.ttl, {
        validators: [Validators.min(1), Validators.max(28)]
      })
    });
  }
  onCategoryChange() {
    if (this.category.priority == 'HIGH') {
      this.rateLimit_type = '';
      this.rateLimit_value = null;
    }
  }

  save() {
    if (!this.form.valid) return;
    if (this.rateLimit_value) this.category.rate_limit = this.rateLimit_value + ' per ' + this.rateLimit_type;
    if (this.isEditView == true) {
      this.notifiService.updateCategoryById(this.catagoryId, this.category).subscribe({
        next: (e: any) => {
          this.notifiService.toster.success('Category Updated Successfully!');
          this.router.navigate(['/configuration/category']);
        },
        error: (err: any) => {
          err = err.error || err;
          this.notifiService.toster.error(err.message || 'Category Update Failed');
        }
      });
    } else {
      this.notifiService.createCategoty(this.category).subscribe({
        next: (e: any) => {
          this.notifiService.toster.success('Category Created Successfully!');
          this.router.navigate(['/configuration/category']);
        },
        error: (err: any) => {
          err = err.error || err;
          this.notifiService.toster.error(err.message || 'Category Create Failed');
        }
      });
    }
  }
  //onCancel popup
  async onCancel() {
    this.notifiService.showCancelConfirmation(['/configuration/category']);
  }

}

