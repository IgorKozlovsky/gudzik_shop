import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useUserContext } from "..";
import { fetchBasketDevices, setBasketDevice } from "../http/BasketAPI";
import { IBasketDevice } from "../types/types";
import BasketItem from "./BasketItem";

const sinMath = require("sinful-math");

const BasketList = observer(() => {
  const { user } = useUserContext();

  const onDelete = async (
    id: number,
    basket: number | undefined,
    articul: string,
    name: string,
    size: string | undefined
  ) => {
    await setBasketDevice(id, basket, 0, articul, name, size);
    await fetchBasketDevices(user?.user?.id).then((data) => {
      user?.setBasket(data);
    });
    if (user?.basket) {
      user.setBasketFullPrice(
        user.basket.basket_devices.reduce(
          (prev: number, curr: IBasketDevice) => sinMath.add(prev, sinMath.mul(curr.count, curr.price)),
          0
        )
      );
    }
  };

  return (
    <aside className="cart-items">
      {user?.basket?.basket_devices.map((e) => {
        if (e.count > 0) {
          return <BasketItem key={e.id} deviceBasket={e} onDelete={onDelete} />;
        }
      })}
    </aside>
  );
});

export default BasketList;
