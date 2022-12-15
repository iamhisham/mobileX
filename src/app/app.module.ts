import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

//Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { DevicePageComponent } from './device-page/device-page.component';
import { ConfigCategoryCreateUpdateComponent } from './configuration/config-category/config-category-create-update/config-category-create-update';
import { ConfigCategory } from './configuration/config-category/config-category';
import { ConfigNavigationCompComponent } from './configuration/config-navigation-comp/config-navigation-comp.component';
import { ConfigTemplate } from './configuration/config-template/config-template';
import { UserSegmentComponent } from './configuration/user-segment/user-segment.component';
import { TempCreate } from './configuration/config-template/temp-create/temp-create';
import { TempCreatePopupModalComponent } from './configuration/config-template/temp-create-popup-modal/temp-create-popup-modal.component';
import { QuillModule } from 'ngx-quill';
import { DeviceViewPageComponent } from './device-page/device-view-page/device-view-page.component';
import { NotificationCreatePageComponent } from './notification-page/notification-create-page/notification-create-page.component';
import { FilterPipePipe } from './filter-pipe.pipe';
import { NotificationHistoryComponent } from './notification-history/notification-history.component';
import { ConfigCategoryDeleteModalComponent } from './configuration/config-category/config-category-delete-modal/config-category-delete-modal.component';
import { LoginComponent } from './login/login.component';
import { DynamicTagsModelComponent } from './configuration/config-template/dynamic-tags-model/dynamic-tags-model.component';

@NgModule({
  declarations: [
    AppComponent,
    DevicePageComponent,
    DashboardPageComponent,
    NotificationPageComponent,
    ConfigNavigationCompComponent,
    ConfigCategory,
    ConfigCategoryCreateUpdateComponent,
    ConfigCategoryDeleteModalComponent,
    ConfigTemplate,
    UserSegmentComponent,
    TempCreate,
    TempCreatePopupModalComponent,
    DeviceViewPageComponent,
    NotificationCreatePageComponent,
    FilterPipePipe,
    NotificationHistoryComponent,
    LoginComponent,
    DynamicTagsModelComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    QuillModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
