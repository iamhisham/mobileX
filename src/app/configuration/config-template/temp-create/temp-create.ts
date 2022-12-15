import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AnimationController } from '@ionic/angular';
import { ActivatedRoute, Params, Router, NavigationStart } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { TempCreatePopupModalComponent } from '../temp-create-popup-modal/temp-create-popup-modal.component';
import { NotificationUiService } from 'src/app/notification-ui.service';
import { } from 'ngx-quill';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicTagsModelComponent } from '../dynamic-tags-model/dynamic-tags-model.component';

@Component({
  selector: 'app-temp-create',
  templateUrl: './temp-create.html',
  styleUrls: ['./temp-create.scss'],
})
export class TempCreate implements OnInit {

  channelList = [
    {
      title: 'Email',
      name: 'EMAIL',
      iconName: 'mail-outline',
      image: '../../../../assets/templateIcons/01_emailpush.png'
    },
    {
      title: 'Web Push',
      name: 'WEB_PUSH',
      iconName: 'desktop-outline',
      image: '../../../../assets/templateIcons/02_webpush.png'
    },
    {
      title: 'Mobile Push',
      name: 'MOBILE_PUSH',
      iconName: 'phone-portrait-outline',
      image: '../../../../assets/templateIcons/03_mobilepush.png'
    },
    {
      title: 'SMS',
      name: 'SMS',
      iconName: 'chatbox-ellipses-outline',
      image: '../../../../assets/templateIcons/04_smspush.png'
    },
    {
      title: 'In-App',
      name: 'IN_APP_MESSAGE',
      iconName: 'apps-outline',
      image: '../../../../assets/templateIcons/05_inapp.png'
    }
  ];

  isModelOpen: boolean = false;
  modal: any = null;

  isEditView: boolean = false;
  isCategoryLoaded: boolean = false;
  template_id: string = '';
  template: any = {};
  categoryList: any = [];
  form!: FormGroup;

  selectedChannel: string = "NEW";

  quillData = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      // ['blockquote', 'code-block'],
      // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'image'/*, 'video'*/]                         // link and image, video
    ]
  };

  constructor(private modalController: ModalController, private notifiService: NotificationUiService,
    private router: Router, private actRouter: ActivatedRoute,
    private alertController: AlertController, public platform: Platform) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (this.isModelOpen) this.modal.dismiss();
      }
    });
  }
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
    this.isEditView = false;
    this.isCategoryLoaded = false;
    this.template_id = '';
    this.template = {};
    this.categoryList = [];
  }



  init() {
    if (this.isInitTriggered) return;
    this.isInitTriggered = true;
    this.resetAll();
    this.validateAndLoadDefaultData();
    this.getAllCategory();
    this.actRouter.paramMap.subscribe((param: Params) => {
      this.template_id = param['get']('template_id');
      if (this.template_id) {
        this.isEditView = true;
        this.getTemplateById();
      }
    });
    this.validateForm()
  }





  validateForm() {
    this.form = new FormGroup({
      subject: new FormControl(this.template.email_content.subject, {
        validators: [Validators.required]
      }),
      body: new FormControl(this.template.email_content.body, {
        validators: [Validators.required]
      }),
      title: new FormControl(this.template.web_push_content.title, {
        validators: [Validators.required]
      }),
      msg: new FormControl(this.template.web_push_content.message, {
        validators: [Validators.required]
      }),
      mobTitle: new FormControl(this.template.push_content.title, {
        validators: [Validators.required]
      }),
      mobMsg: new FormControl(this.template.push_content.message, {
        validators: [Validators.required]
      }),
      smsContent: new FormControl(this.template.sms_content.message, {
        validators: [Validators.required]
      }),
      htmlContent: new FormControl(this.template.in_app_content.htmlContent, {
        validators: [Validators.required]
      })
    })
  }

  validateAndLoadDefaultData() {
    this.template.channels = this.template.channels || [];
    this.template.email_content = this.template.email_content || {};
    this.template.sms_content = this.template.sms_content || {};
    this.template.push_content = this.template.push_content || {};
    this.template.web_push_content = this.template.web_push_content || {};
    this.template.in_app_content = this.template.in_app_content || {}
  }

  getAllCategory() {
    this.notifiService.getAllCategory().subscribe((categoryList: any) => {
      this.categoryList = categoryList;
      //if (!this.isEditView || this.template.id) this.opentempalteBaseDetailsModel();
      if (!this.isEditView) this.opentempalteBaseDetailsModel();
    });
  }

  getTemplateById() {
    this.notifiService.getTemplateById(this.template_id).subscribe((template: any) => {
      this.template = template;
      this.validateAndLoadDefaultData();
      this.reArrangeChannel();
      this.selectedChannel = this.template.channels[0] || 'NEW';
      //if(this.categoryList.length > 0) this.opentempalteBaseDetailsModel();
    });
  }

  async opentempalteBaseDetailsModel() {
    var modal = await this.modalController.create({
      component: DynamicTagsModelComponent,
      cssClass: 'modalSize1',
      componentProps: {
        template: this.template,
        categoryList: this.categoryList
      },
      backdropDismiss: false
    });
    modal.onDidDismiss().then((modelData) => {

    });
    await modal.present();
  }

  reArrangeChannel() {
    const channelOrder = this.channelList.map((channel: any) => channel.name);
    this.template.channels = this.template.channels.sort((a: any, b: any) => {
      if (channelOrder.indexOf(a) < channelOrder.indexOf(b)) return -1;
      else return 1;
    });
  }

  getSelectedChannelList() {
    return this.channelList.filter(channel => this.template.channels.indexOf(channel.name) != -1);
  }

  addChannel(channelName: any) {
    var selectedInded = this.template.channels.indexOf(channelName);
    if (selectedInded == -1) {
      this.template.channels.push(channelName);
      this.reArrangeChannel();
      this.selectedChannel = channelName;
      // this.selectedChannel = this.template.channels[0] || 'NEW';
    }
  }

  removeChannel(channelName: any) {
    var selectedInded = this.template.channels.indexOf(channelName);
    if (selectedInded != -1) {
      this.template.channels.splice(selectedInded, 1);
    }
    if (this.selectedChannel == channelName) {
      this.selectedChannel = this.template.channels[0] || 'NEW';
    }
  }

  // test() {
  //   this.selectedChannel = this.template.channels[0] || 'NEW';
  // }

  showAddChannelView() {
    this.selectedChannel = "NEW";
  }

  switchChannel(channel: string) {
    this.selectedChannel = channel;
  }

  save() {
    if (!this.validateTemplate(this.template)) return;
    if (this.isEditView == true) {
      this.notifiService.updateTemplateById(this.template_id, this.template).subscribe({
        next: (e: any) => {
          this.notifiService.toster.success("Template Updated Successfully!");
          this.router.navigate(['/configuration/template']);
        },
        error: (err: any) => {
          err = err.error || err;
          this.notifiService.toster.error(err.message || "Template Update Failed");
        }
      });
    } else {
      this.notifiService.createTemplate(this.template).subscribe({
        next: (e: any) => {
          this.notifiService.toster.success("Template Created Successfully!");
          this.router.navigate(['/configuration/template']);
        },
        error: (err: any) => {
          err = err.error || err;
          this.notifiService.toster.error(err.message || "Template Create Failed");
        }
      });
    }
  }

  validateTemplate(template: any) {
    try {
      if (!template.name) {
        this.opentempalteBaseDetailsModel();
        throw "Please Enter Name";
      } else if (!template.category_id) {
        this.opentempalteBaseDetailsModel();
        throw "Please Select Category";
      }
      if (template.channels.length == 0) {
        this.selectedChannel = "NEW";
        throw "Please Select Channel";
      }
      template.channels.forEach((channel: string) => {
        switch (channel) {
          case 'MOBILE_PUSH':
            if (!template.push_content.title) {
              this.selectedChannel = channel;
              throw "Please Enter Title";
            } else if (!template.push_content.message) {
              this.selectedChannel = channel;
              throw "Please Enter Message";
            }
            break;
          case 'WEB_PUSH':
            if (!template.web_push_content.title) {
              this.selectedChannel = channel;
              throw "Please Enter Title";
            } else if (!template.web_push_content.message) {
              this.selectedChannel = channel;
              throw "Please Enter Message";
            }
            break;
          case 'EMAIL':
            if (!template.email_content.subject) {
              this.selectedChannel = channel;
              throw "Please Enter Subject";
            } else if (!template.email_content.body) {
              this.selectedChannel = channel;
              throw "Please Enter Body";
            }
            break;
          case 'SMS':
            if (!template.sms_content.message) {
              this.selectedChannel = channel;
              throw "Please Enter Message";
            }
            break;
          case 'IN_APP_MESSAGE':
            if (!template.in_app_content.htmlContent) {
              this.selectedChannel = channel;
              throw "Please Enter Message";
            }
            break;
          default: throw "Invalid channel";
        }
      });
      return true;
    } catch (err) {
      this.notifiService.toster.error(err);
      return false;
    }
  }

  async confirmCancel() {
    this.isModelOpen = true;
    this.modal = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'Changes you made may not be saved.',
      cssClass: 'custom-alert-style',
      buttons: [
        {
          text: 'Leave',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.modalController.dismiss();
            this.router.navigate(['/configuration/template']);
          }
        },
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel'
        },
      ],
    });
    this.modal.onDidDismiss().then(() => {
      this.isModelOpen = false;
    });
    await this.modal.present();
  }

  // mobile view right content
  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

}
