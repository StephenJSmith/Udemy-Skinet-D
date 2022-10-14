import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IAddress } from 'src/app/shared/models/address';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  get deliveryMethodId(): number {
    return +this.checkoutForm
      .get('deliveryForm')
      .get('deliveryMethod').value;
  }

  get shipToAddress(): IAddress {
    return this.checkoutForm.get('addressForm').value;
  }

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService
      .createOrder(orderToCreate)
      .subscribe((order: IOrder) => {
        this.toastr.success('Order created successfully');
        this.basketService.deletetLocalBasket(basket.id);
        const navigationExtras: NavigationExtras = {state: order};
        this.router.navigate(['checkout/success'], navigationExtras);
      }, error => {
        this.toastr.error(error.message);
        console.error(error);
      });
  }

  private getOrderToCreate(basket: IBasket): IOrderToCreate {
    const result: IOrderToCreate = {
      basketId: basket.id,
      deliveryMethodId: this.deliveryMethodId,
      shipToAddress: this.shipToAddress
    }

    return result;
  }

}
