import { makeAutoObservable } from "mobx";
import { IDevice, ITags, IType } from "../types/types";

export class DeviceStore {
  private _types: IType[];
  private _tags: ITags[];
  private _devices: IDevice[];
  private _filteredDevices: IDevice[];
  private _count: number;
  private _order: string;
  private _limit: number;
  private _page: number;
  private _selectedType: IType;
  private _selectedTag: ITags;
  private _exchangeRate: number;

  constructor() {
    this._types = [];
    this._devices = [];
    this._filteredDevices = [];
    this._tags = [];
    this._count = 0;
    this._order = "ASC";
    this._limit = 9;
    this._page = 1;
    this._exchangeRate = 39;
    this._selectedType = { id: 0, name: "Виберіть тип товару" };
    this._selectedTag = { id: 0, name: "Виберіть групу тегів" };
    makeAutoObservable(this);
  }
  setDevices(devices: IDevice[]) {
    this._devices = devices;
  }
  setFilteredDevices(devices: IDevice[]) {
    this._filteredDevices = devices;
  }
  setTypes(types: IType[]) {
    this._types = types;
  }
  setDevicesCount(count: number) {
    this._count = count;
  }
  setOrder(order: string) {
    this._order = order;
  }
  setLimit(limit: number) {
    this._limit = limit;
  }
  setPage(page: number) {
    this._page = page;
  }
  setSelectedType(type: IType) {
    this._selectedType = type;
  }
  setSelectedTag(tag: ITags) {
    this._selectedTag = tag;
  }
  setTags(tags: ITags[]) {
    this._tags = tags;
  }
  setExchangeRate(exchangeRate: number) {
    this._exchangeRate = exchangeRate;
  }

  get devices() {
    return this._devices;
  }
  get filteredDevices() {
    return this._filteredDevices;
  }
  get types() {
    return this._types;
  }
  get count() {
    return this._count;
  }
  get order() {
    return this._order;
  }
  get limit() {
    return this._limit;
  }
  get page() {
    return this._page;
  }
  get selectedType() {
    return this._selectedType;
  }
  get selectedTag() {
    return this._selectedTag;
  }
  get tags() {
    return this._tags;
  }
  get exchangeRate() {
    return this._exchangeRate;
  }
}

export default DeviceStore;
