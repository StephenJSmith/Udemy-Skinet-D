import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { IAddress } from '../shared/models/address';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;

  get addressForm(): AbstractControl {
    return this.checkoutForm.get('addressForm');
  }

  get isAddressFormValid(): boolean {
    return this.addressForm.valid;
  }

  get isDeliveryFormValid(): boolean {
    return this.checkoutForm.get('deliveryForm').valid;
  }

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipCode: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required],
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required],
      }),
    });
  }

  getAddressFormValues(): void {
    this.accountService
      .getUserAddress()
      .subscribe(address => {
        if (address) {
          this.addressForm.patchValue(address);
        }
      }, error => {
        console.error(error);
      });
  }
}
