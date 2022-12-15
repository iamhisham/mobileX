import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NotificationUiService } from 'src/app/notification-ui.service';
import { } from 'ngx-quill';

@Component({
  selector: 'app-notification-create-page',
  templateUrl: './notification-create-page.component.html',
  styleUrls: ['./notification-create-page.component.scss'],
})
export class NotificationCreatePageComponent implements OnInit {

  notification_id: string = '';
  notification: any = {
    content: {},
    channels: [],
    included_segment_id_list: [],
    excluded_segment_id_list: [],
    is_bulk_notification: false,
    is_scheduled: false,
  };
  isEditView: boolean = false;
  channelList: any = ["EMAIL", "WEB_PUSH", "MOBILE_PUSH", "SMS", "IN_APP_MESSAGE"];
  directContentChannelList: any = ["EMAIL", "WEB_PUSH", "MOBILE_PUSH", "SMS"];
  channelMap: any = {
    "EMAIL": "Email",
    "WEB_PUSH": "Web Push",
    "MOBILE_PUSH": "Mobile Push",
    "SMS": "SMS",
    "IN_APP_MESSAGE": "In-App Message"
  };

  fieldChannelMap: any = {
    "title": ["EMAIL", "WEB_PUSH", "MOBILE_PUSH"],
    "message": ["EMAIL", "WEB_PUSH", "MOBILE_PUSH", "SMS"],
    "image": ["WEB_PUSH", "MOBILE_PUSH"]
  }

  preview_channel: string = "";

  categoryList: any = [];
  templateList: any = [];
  templateMap: any = {};
  previewTemplateMap: any = {};
  userSegmentList: any = [];

  isDirectContentMessage: boolean = false;

  matchedUserCount: any = {
    includedFilter: null,
    excludedFilter: null
  }

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

  constructor(private alertController: AlertController, public notifiService: NotificationUiService, private router: Router, private actRouter: ActivatedRoute) { }

  ngOnInit() {
    this.getAllCategory();
    this.getAllUserSegment();

    this.actRouter.paramMap.subscribe((param: Params) => {
      this.notification_id = param['get']('notification_id');
      if (this.notification_id) {
        this.isEditView = true;
        this.getNotificationById();
      }
    });
  }

  renderdata(data: any, key: string) {
    if (data[key]) {
      var value = data[key];
      delete data[key];
      setTimeout(() => data[key] = value, 10);
    }
  }

  getAllCategory() {
    this.notifiService.getAllCategory().subscribe((categoryList: any) => {
      this.categoryList = categoryList;
      this.renderdata(this.notification, "category_id");
    });
  }

  getAllTemplateByCategoryId(category_id: any) {
    if (category_id) {
      this.notifiService.getAllTemplate(category_id).subscribe((templateList: any) => {
        if (category_id == this.notification.category_id) {
          this.templateList = templateList;
          this.templateList.forEach((template: any) => this.templateMap[template.id] = template);
          this.renderdata(this.notification, "template_id");
          this.renderdata(this.notification, "channels");
        }
      });
    }
  }

  getAllUserSegment() {
    //TODO:
  }

  getNotificationById() {
    this.notifiService.getNotificationById(this.notification_id).subscribe((notification: any) => {
      this.notification = notification;
      this.notification.content = this.notification.content || {};
      this.onChannelSelect();
      if (this.notification.template_id) {
        this.isDirectContentMessage = false;
        this.loadTemplatePreviewByTemplateId();
      } else {
        this.isDirectContentMessage = true;
      }
      if (this.notification.category_id) {
        this.getAllTemplateByCategoryId(this.notification.category_id);
      }
    });
  }

  onMessageTypeChange(isDirectContentMessage: boolean) {
    if (this.isDirectContentMessage != isDirectContentMessage) {
      this.isDirectContentMessage = isDirectContentMessage;
      this.onCategorySelect();
    }
  }

  onCategorySelect() {
    this.notification.template_id = "";
    this.notification.channels = [];
    this.preview_channel = "";
    this.getAllTemplateByCategoryId(this.notification.category_id);
  }

  onTemlateSelect() {
    this.notification.channels = [];
    this.preview_channel = "";
    this.loadTemplatePreviewByTemplateId();

  }

  loadTemplatePreviewByTemplateId() {
    if (!this.previewTemplateMap[this.notification.template_id]) {
      this.notifiService.getTemplateById(this.notification.template_id).subscribe((template: any) => {
        this.previewTemplateMap[this.notification.template_id] = template;
      });
    }
  }

  onChannelSelect() {
    var channels = this.notification.channels;
    if (channels.indexOf(this.preview_channel) == -1) {
      this.preview_channel = channels[0] || "";
    }
  }

  isValidFieldToShow(fieldName: string) {
    const elidgibleChannelList = this.fieldChannelMap[fieldName] || [];
    return elidgibleChannelList.find((channel: any) => this.notification.channels.indexOf(channel) != -1) != null;
  }

  isValidNotification(notification: any) {
    try {
      if (notification.is_bulk_notification == true) {
        if (!notification.included_segments && !notification.excluded_segments) throw "Please Select Either Included Segments or Excluded Segments";
        if (notification.included_segments && notification.excluded_segments) throw "Please Select Either Included Segments or Excluded Segments";
      } else {
        if (!notification.external_user_id) throw "Please enter User Id";
      }
      if (!notification.category_id) throw "Please Select Category Id";
      if (this.isDirectContentMessage) {
        if (notification.channels.length == 0) throw "Please Select Channels";
        if (this.isValidFieldToShow("title") && !notification.content.title) throw "Please Enter Title";
        if (this.isValidFieldToShow("message") && !notification.content.message) throw "Please Enter Message";
      } else {
        if (!notification.template_id) throw "Please Select Template Id";
        if (notification.channels.length == 0) throw "Please Select Channels";
      }
      if (notification.is_scheduled && !notification.scheduled_at) throw "Please Select Scheduled Date";

      //cleanup code
      if (notification.template_id) notification.content = {};
      if (!notification.is_scheduled) notification.scheduled_at = null;
      if (notification.is_bulk_notification == true) {
        if (notification.external_user_id) notification.external_user_id = null;
      } else {
        if (notification.included_segments) notification.included_segments = [];
        if (notification.excluded_segments) notification.excluded_segments = [];
      }

      return true;
    } catch (err) {
      this.notifiService.toster.error(err);
      return false;
    }
  }

  saveAsDraft() {
    if (!this.isValidNotification(this.notification)) return;

    if (this.isEditView) {
      this.notifiService.updateDraftNotification(this.notification_id, this.notification).subscribe({
        next: (e: any) => {
          this.notifiService.toster.success("Notification Updated Successfully!");
          this.router.navigate(['/notification']);
        },
        error: (err: any) => {
          err = err.error || err;
          this.notifiService.toster.error(err.message || "Notification Update Failed");
        }
      });
    } else {
      this.notifiService.saveDraftNotification(this.notification).subscribe({
        next: (e: any) => {
          this.notifiService.toster.success("Notification Created Successfully!");
          this.router.navigate(['/notification']);
        },
        error: (err: any) => {
          err = err.error || err;
          this.notifiService.toster.error(err.message || "Notification Create Failed");
        }
      });
    }
  }

  sendNotification() {
    if (!this.isValidNotification(this.notification)) return;

    this.notifiService.sendNotification(this.notification).subscribe({
      next: (e: any) => {
        this.notifiService.toster.success("Notification Initiated Successfully!");
        this.router.navigate(['/notification']);
      },
      error: (err: any) => {
        err = err.error || err;
        this.notifiService.toster.error(err.message || "Notification Failed to Initiate");
      }
    });
  }

  scheduleNotification() {
    if (!this.isValidNotification(this.notification)) return;

    this.notifiService.scheduleNotification(this.notification).subscribe({
      next: (e: any) => {
        this.notifiService.toster.success("Notification Scheduled Successfully!");
        this.router.navigate(['/notification']);
      },
      error: (err: any) => {
        err = err.error || err;
        this.notifiService.toster.error(err.message || "Failed to Schedule Notification");
      }
    });
  }

  //onCancel popup
  async onCancel() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: 'Changes you made may not be saved.',
      cssClass: 'custom-alert-style',
      buttons: [
        {
          text: 'Leave',
          cssClass: 'alert-button-confirm',
          handler: () => { this.router.navigate(['/notification']) }
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
