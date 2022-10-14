import { IAddress } from "./address";
import { IDeliveryMethod } from "./deliveryMethod";

export interface IOrderToCreate {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: IAddress;
}

export interface IOrderItem {
  productd: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  id: number;
  buyerEmail: string;
  orderDate: Date;
  shipToAddress: IAddress;
  deliveryMethod: IDeliveryMethod;
  orderItems: IOrderItem[];
  subtotal: number;
  status: number;
  paymentIntentId: string;
}

