import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { DevicePageComponent } from './device-page/device-page.component';
import { ConfigCategory } from './configuration/config-category/config-category';
import { ConfigCategoryCreateUpdateComponent } from './configuration/config-category/config-category-create-update/config-category-create-update';
import { ConfigTemplate } from './configuration/config-template/config-template';
import { UserSegmentComponent } from './configuration/user-segment/user-segment.component';
import { TempCreate } from './configuration/config-template/temp-create/temp-create';
import { DeviceViewPageComponent } from './device-page/device-view-page/device-view-page.component';
import { NotificationHistoryComponent } from './notification-history/notification-history.component';
import { NotificationCreatePageComponent } from './notification-page/notification-create-page/notification-create-page.component';
import { ConfigCategoryDeleteModalComponent } from './configuration/config-category/config-category-delete-modal/config-category-delete-modal.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  {
    path: 'configuration',
    children: [
      { path: '', component: ConfigCategory },

      { path: 'category', component: ConfigCategory },
      { path: 'category/create', component: ConfigCategoryCreateUpdateComponent },
      { path: 'category/:category_id', component: ConfigCategoryCreateUpdateComponent },

      { path: 'template', component: ConfigTemplate },
      { path: 'template/create', component: TempCreate },
      { path: 'template/:template_id', component: TempCreate },

      { path: 'user-segment', component: UserSegmentComponent },
      { path: 'user-segment/create', component: UserSegmentComponent },
      { path: 'user-segment/:user_segment_id', component: UserSegmentComponent }
    ]
  },
  { path: 'notification', component: NotificationPageComponent },
  { path: 'notification/create', component: NotificationCreatePageComponent },
  { path: 'notification/:notification_id', component: NotificationCreatePageComponent },

  { path: 'notification-history', component: NotificationHistoryComponent },

  { path: 'device', component: DevicePageComponent },
  { path: 'device/:device_id', component: DeviceViewPageComponent },

  { path: '', redirectTo: 'configuration/category', pathMatch: 'full' },

  //
  { path: 'delete', component: ConfigCategoryDeleteModalComponent },
  //

  { path: 'login', component: LoginComponent }
];



// ************


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
