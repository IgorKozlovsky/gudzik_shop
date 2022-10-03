export interface IDevice {
  id: number;
  highestPrice: number;
  img: string;
  articul: string;
  info?: [{}];
  variant?: [{ id: number; name: string; deviceId: number }];
  size: [{ id: number; size: string; price: number; amount: number }];
  tags: string[];
}
export interface IBasket {
  id: number;
  userId: number;
  basket_devices: [IBasketDevice];
}
export interface IBasketDevice {
  id: number;
  deviceId: number;
  name: string;
  size: string;
  count: number;
  price: number;
  device: IDevice;
}
export interface IUser {
  id: number;
  email: string;
  role: string;
}
export interface IType {
  id: number;
  name: string;
}
export interface ITags {
  id: number;
  name: string;
  tag?: [ITag];
}
export interface ITag {
  id: number;
  value: string;
  tagId: number;
}
