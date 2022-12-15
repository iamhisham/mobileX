import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, AnimationController } from '@ionic/angular';
import { ActivatedRoute, Params, Router, NavigationStart } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertController, ToastController } from '@ionic/angular';

import { NotificationUiService } from '../../notification-ui.service';
import { ConfigCategoryDeleteModalComponent } from './config-category-delete-modal/config-category-delete-modal.component';



@Component({
  selector: 'app-config-category',
  templateUrl: './config-category.html',
  styleUrls: ['./config-category.scss'],
})
export class ConfigCategory implements OnInit {

  categoryList: any = [];
  selectedCategory: any = null;
  dataSource: any;
  displayedColumns = [
    'name',
    'priority',
    'ttl',
    'rate_limit',
    'final'
  ];
  showSpinner = false;
  isModelOpen: boolean = false;
  modal: any = null;

  @ViewChild(MatPaginator) paginators!: MatPaginator;
  @ViewChild(MatSort) sorts!: MatSort;
  // for scrollRight
  @ViewChild('mytable', { read: ElementRef }) public widgetsContent!: ElementRef<any>;

  constructor(private notifiService: NotificationUiService, private modalController: ModalController,
    private router: Router, private toastController: ToastController, private alertController: AlertController) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (this.isModelOpen) this.modal.dismiss();
      }
    });
  }
  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.getAllCategory();
  }

  getAllCategory() {
    this.showSpinner = true;
    this.notifiService.getAllCategory().subscribe((categoryList: any) => {
      this.categoryList = categoryList;
      this.dataSource = new MatTableDataSource(categoryList);
      this.table_material();
      this.showSpinner = false;
    });
  }

  table_material() {
    //angualar material
    this.dataSource.sort = this.sorts;
    this.dataSource.paginator = this.paginators;
    this.paginators._intl.itemsPerPageLabel = "Display";
  }
  //search btn filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 340;
  }

  deleteCategorty(id: any) {
    this.notifiService.deleteCategoryById(id).subscribe({
      next: (data: any) => {
        this.notifiService.toster.success("Category Disabled successfully!");
        this.getAllCategory();
      },
      error: (err: any) => {
        err = err.error || err;
        if (err.CUSTOM_ERROR_CODE == 1001) {
          this.openActionDeniedModel();
        } else {
          this.notifiService.toster.error(err.message || "Category Disable Failed");
        }
      }
    });
  }

  async confirmDelete(category: any, status?: any) {
    this.selectedCategory = category;
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: `Changes you made will be ${status}.`,
      cssClass: 'custom-alert-style',
      buttons: [
        {
          text: 'Disable',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.deleteCategorty(category.id);
          }
        },
        {
          text: 'Cancel',
          cssClass: 'alert-button-cancel',
        },
      ],
    });
    await alert.present();
  }

  async openActionDeniedModel() {
    this.isModelOpen = true;
    this.modal = await this.modalController.create({
      component: ConfigCategoryDeleteModalComponent,
      cssClass: 'sizeModal',
      componentProps: {
        category: this.selectedCategory,
        categoryList: this.categoryList.filter((category: any) => category.id != this.selectedCategory.id),
        deleteEvent: (id: any) => {
          this.deleteCategorty(id);
        }
      },
      backdropDismiss: false
    });
    this.modal.onDidDismiss().then(() => {
      this.isModelOpen = false;
    });
    await this.modal.present();
  }

}
