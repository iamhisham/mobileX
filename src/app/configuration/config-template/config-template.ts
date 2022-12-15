import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationUiService } from 'src/app/notification-ui.service';
import { AlertController, ToastController } from '@ionic/angular';
import { stat } from 'fs';

@Component({
  selector: 'app-config-template',
  templateUrl: './config-template.html',
  styleUrls: ['./config-template.scss'],
})
export class ConfigTemplate implements OnInit {

  dataSource: any;
  displayedColumns = [
    'id',
    'name',
    'category',
    'channel',
    'final'
  ];
  category_serach: string = "";
  showSpinner = false;
  categoryList: any = [];
  selectedCategotyList: any = [];
  templatelist: any = [];
  @ViewChild(MatPaginator) paginators!: MatPaginator;
  @ViewChild(MatSort) sorts!: MatSort;
  //SCROLL RIGHT
  @ViewChild('mytable', { read: ElementRef }) public widgetsContent!: ElementRef<any>;

  constructor(private notifiService: NotificationUiService, private toastController: ToastController, private alertController: AlertController, private actRouter: ActivatedRoute) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.actRouter.queryParams.subscribe((params: Params) => {
      this.getAllCategory(params['category_id']);
    });
    this.showSpinner = true;
    this.getAllTemplate();
  }

  getAllCategory(category_id: any) {
    this.notifiService.getAllCategory().subscribe((categoryList: any) => {
      this.categoryList = categoryList;
      this.selectedCategotyList = this.categoryList.map((category: any) => category.id);
      if (category_id) {
        category_id = Number(category_id);
        if (this.selectedCategotyList.indexOf(category_id) != -1) {
          this.selectedCategotyList = [category_id];
        } else {
          //TODO: re-route the url without query param
        }
      }
      if (this.templatelist.length > 0) this.loadedTemplateData();
    });
  }

  getAllTemplate() {
    this.notifiService.getAllTemplate().subscribe((templatelist: any) => {
      this.templatelist = templatelist;
      this.loadedTemplateData();
    });
    console.log(this.selectedCategotyList.length === this.categoryList.length);
  }

  loadedTemplateData() {
    this.showSpinner = true;
    var templatelist = this.templatelist.filter((template: any) => this.selectedCategotyList.indexOf(template.category_id) != -1);

    this.dataSource = new MatTableDataSource(templatelist);
    this.table_material();
    this.showSpinner = false;
  }

  selectOrUnselectAllCategory(event: any) {
    if (!event.target.checked) {
      this.selectedCategotyList = this.categoryList.map((category: any) => category.id);
    } else {
      this.selectedCategotyList = [];
    }
    this.loadedTemplateData();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  table_material() {
    //angualar material
    this.dataSource.sort = this.sorts;
    this.dataSource.paginator = this.paginators;
    this.paginators._intl.itemsPerPageLabel = "Display";
  }
  //category filter
  filteredCategory(event: any, categoryId: any) {
    if (!event.target.checked) {
      this.selectedCategotyList.push(categoryId);
    } else {
      this.selectedCategotyList.splice(this.selectedCategotyList.findIndex((data: any) => data === categoryId), 1);
    }
    this.loadedTemplateData();
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  //search btn filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 340;
  }

  deleteTemplate(id: any) {
    this.notifiService.deleteTemplateById(id).subscribe({
      next: (data: any) => {
        this.notifiService.toster.success("Template Disabled successfully!");
        this.getAllTemplate();
      },
      error: (err: any) => {
        err = err.error || err;
        this.notifiService.toster.error(err.message || "Template disable Failed");
      }
    });
  }

  async confirmDelete(id: any, status?: any) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      subHeader: `Changes you made will be ${status}.`,
      cssClass: 'custom-alert-style',
      buttons: [
        {
          text: 'Disable',
          cssClass: 'alert-button-confirm',

          handler: () => {
            this.deleteTemplate(id);
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

}
