import { makeAutoObservable } from "mobx";
import { IBasket, IUser } from "../types/types";

class UserStore {
  private _isAuth: boolean;
  private _user: IUser | null;
  private _role: string;
  private _basket: IBasket | null;
  private _basketFullPrice: number;
  constructor() {
    this._isAuth = false;
    this._user = null;
    this._role = "USER";
    this._basket = null;
    this._basketFullPrice = 0;
    makeAutoObservable(this);
  }

  setIsAuth(bool: boolean) {
    this._isAuth = bool;
  }
  setUser(user: IUser | null) {
    this._user = user;
  }
  setRole(role: string) {
    this._role = role;
  }
  setBasket(basket: IBasket | null) {
    this._basket = basket;
  }
  setBasketFullPrice(basketFullPrice: number) {
    this._basketFullPrice = basketFullPrice;
  }

  get isAuth() {
    return this._isAuth;
  }
  get user() {
    return this._user;
  }
  get role() {
    return this._role;
  }
  get basket() {
    return this._basket;
  }
  get basketFullPrice() {
    return this._basketFullPrice;
  }
}
export default UserStore;
