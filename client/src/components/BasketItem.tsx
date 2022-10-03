import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { useUserContext } from "..";
import { addBasketDevice, fetchBasketDevices, setBasketDevice } from "../http/BasketAPI";
import { IBasketDevice, IDevice } from "../types/types";
const sinMath = require("sinful-math");

interface BasketItemProps {
  deviceBasket: IBasketDevice;
  onDelete: (id: number, basket: number | undefined, articul: string, name: string, size: string | undefined) => void;
}

const BasketItem: FC<BasketItemProps> = observer(({ deviceBasket, onDelete }) => {
  const { user } = useUserContext();
  const [count, setCount] = useState(deviceBasket.count);

  let art = deviceBasket.name.split(" ")[0];
  let vari = deviceBasket.name.split(" ")[1];

  const onAdd = async (operation: boolean, count?: number | undefined) => {
    if (user?.basket) {
      if (count === undefined) {
        await addBasketDevice(
          deviceBasket.device.id,
          user?.basket?.id,
          operation,
          art,
          vari,
          deviceBasket.size,
          deviceBasket.price
        ).then(({ data }) => setCount(data.count));
      } else {
        await setBasketDevice(deviceBasket.device.id, user?.basket?.id, count, art, vari, deviceBasket.size).then(
          ({ data }) => setCount(data.count)
        );
      }
      if (count) {
        user.setBasketFullPrice(sinMath.add(user.basketFullPrice, sinMath.mul(deviceBasket.price, count)));
      } else {
        user.setBasketFullPrice(
          operation
            ? sinMath.add(user.basketFullPrice, deviceBasket.price)
            : sinMath.sub(user.basketFullPrice, deviceBasket.price)
        );
      }
    }
  };

  return (
    <div className="cart-items__item">
      <div
        className="delete-x"
        onClick={() => onDelete(deviceBasket.device.id, user?.basket?.id, art, vari, deviceBasket.size)}
      >
        X
      </div>
      <img src={`http://localhost:5001/${deviceBasket.device.img}`} />
      <div className="cart-items-title">
        <h2 className="cart-items-articul">{art}</h2>
        <h3 className="cart-items-variant">
          Розмір: {deviceBasket.size} {vari ? `, ${vari}` : ""}
        </h3>
      </div>
      <div className="cart-items-content">
        <label>Ціна:</label>
        <div className="cart-items-text">{deviceBasket.price} ₴</div>
      </div>
      <div className="cart-items-content">
        <label>Кількість:</label>
        <div className="cart-items-count">
          <button onClick={() => onAdd(true)}>+</button>
          <input
            type="number"
            value={count}
            onChange={(e) => {
              setCount(Number(e.target.value));
            }}
            onBlur={() => {
              onAdd(true, count);
            }}
            className="count"
          />
          <button onClick={() => (count > 0 ? onAdd(false) : null)}>-</button>
        </div>
      </div>
      <div className="cart-items-content">
        <label>Всього:</label>
        <div className="cart-items-text">{sinMath.mul(deviceBasket.price || 0, count)} ₴</div>
      </div>
    </div>
  );
});

export default BasketItem;
