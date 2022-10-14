import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  get addressForm(): AbstractControl {
    return this.checkoutForm.get('addressForm');
  }

  get canDisableSaveUserAddress(): boolean {
     const result = !this.addressForm.valid
      || !this.addressForm.dirty;

      return result;
  }

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  saveUserAddress() {
    this.accountService
      .updateUserAddress(this.addressForm.value)
      .subscribe(() => {
        this.toastr.success('Address saved');
      }, error => {
        this.toastr.error(error.message);
        console.error(error);
      })
  }

}
