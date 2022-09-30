import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @Input() product: IProduct;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private breadcrumb: BreadcrumbService,
  ) { 
    this.setBreadcrumbName();
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct() {
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.shopService
      .getProduct(id)
      .subscribe(product => {
        this.product = product;
        this.setBreadcrumbName(product.name);
      }, error => {
        console.error(error);
      });
  }

  private setBreadcrumbName(name: string = ' ') {
    this.breadcrumb.set('@productDetails', name);
  }
}
