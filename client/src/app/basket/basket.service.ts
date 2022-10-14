import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  readonly LocalStorageBasketIdKey = 'basket_id';

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;


  get localStorageBasketId(): string {
    return localStorage.getItem(this.LocalStorageBasketIdKey);
  }
  constructor(private http: HttpClient) { }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    this.calculateTotals();
  }

  getBasket(id: string) {
    const url = `${this.baseUrl}basket?id=${id}`;

    return this.http
      .get<IBasket>(url)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          this.calculateTotals();
        }),
      );
  }

  setBasket(basket: IBasket) {
    const url = `${this.baseUrl}basket`;

    return this.http
      .post<IBasket>(url, basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
        this.calculateTotals();
      }, error => {
        console.error(error);
      });
  }

  getCurrentBasketValue(): IBasket {
    return this.basketSource.value;
  }

  addItemToBasket(
    item: IProduct,
    quantity = 1
  ) {
    const itemToAdd: IBasketItem 
      = this.mapItemToBasketItems(item, quantity);
    const basket = this.getCurrentBasketValue()
      ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (foundItemIndex < 0) return;

    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (foundItemIndex < 0) return;

    const basketItem = basket.items[foundItemIndex];
    if (basketItem.quantity > 1) {
      basketItem.quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (!basket.items.some(x => x.id === item.id)) return;

    basket.items = basket.items.filter(i => i.id !== item.id);
    if (basket.items.length > 0) {
      this.setBasket(basket);
    } else {
      this.deleteBasket(basket);
    }
  }

  deletetLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem(this.LocalStorageBasketIdKey);
  }

  deleteBasket(basket: IBasket) {
    const url = `${this.baseUrl}basket?id=${basket.id}`;

    return this.http
      .delete(url)
      .subscribe(() => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem(this.LocalStorageBasketIdKey);
      });
  }

  private addOrUpdateItem(
    items: IBasketItem[], 
    itemToAdd: IBasketItem, 
    quantity: number): IBasketItem[] {
    console.log('items: IBasketItem[]', items);
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem(this.localStorageBasketId, basket.id);

    return basket;
  }

  private mapItemToBasketItems(item: IProduct, quantity: number): IBasketItem {
    const basketItem: IBasketItem = {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    };

    return basketItem;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce((a, b) => 
      (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    const basketTotals: IBasketTotals = {
      shipping,
      subtotal,
      total,
    };
    this.basketTotalSource.next(basketTotals);
  }
}
