import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { useUserContext } from "..";
import { addBasketDevice, fetchBasketDevice, setBasketDevice } from "../http/BasketAPI";
import { fetchDevice } from "../http/deviceAPI";
import { IDevice } from "../types/types";

interface DeviceItemProps {
  device: IDevice;
  onDelete: (id: number) => void;
}

const DeviceItem: FC<DeviceItemProps> = ({ device, onDelete }) => {
  const { user } = useUserContext();

  const [size, setSize] = useState<string>(device.size[0].size);
  const [price, setPrice] = useState<number>(device.size[0].price);
  const [variant, setVariant] = useState<string | undefined>(device?.variant?.length && device?.variant[0]?.name);
  const [count, setCount] = useState<number>(0);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    fetchBasketDevice(device.id, user?.basket?.id, device.articul, !!variant ? variant : "", size).then(({ data }) =>
      data ? setCount(data.count) : setCount(0)
    );
  }, [variant, size]);

  const handlerBuy = async (operation?: boolean, count?: number) => {
    if (count === undefined) {
      await addBasketDevice(device.id, user?.basket?.id, operation, device.articul, variant, size, price).then(
        ({ data }) => setCount(data.count)
      );
    } else {
      await setBasketDevice(device.id, user?.basket?.id, count, device.articul, variant, size).then(({ data }) =>
        setCount(data.count)
      );
    }
  };

  return (
    <div className="main-items__item">
      {user?.role == "ADMIN" && (
        <div className="delete-x button button--error" onClick={() => onDelete(device.id)}>
          Видалити
        </div>
      )}
      <img width="310" height="209" src={`http://localhost:5001/${device.img}`} alt={`Гудзик${device.id}`} />
      {device.articul}
      <div className="main-items__item-properties">
        {!!device.variant?.length && (
          <div>
            Вид:
            <select value={variant} onChange={(e) => setVariant(e.target.value)}>
              {device.variant?.map((e) => (
                <option value={e.name} key={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          Розмір:
          <select
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              setPrice(device.size.find((elem) => elem.size == e.target.value)?.price || 0);
            }}
          >
            {device.size.map((e) => (
              <option value={e.size} key={e.id}>
                {e.size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="main-items__item-desc">
        <label>{price} грн</label>
        {user?.isAuth &&
          (count || focus ? (
            <button className="item-button">
              <div onClick={() => handlerBuy(true)}>+</div>
              <input
                type="number"
                value={count}
                onChange={(e) => {
                  setCount(Number(e.target.value));
                }}
                className="count"
                onFocus={() => setFocus(true)}
                onBlur={() => {
                  setFocus(false);
                  handlerBuy(true, count);
                }}
              />
              <div onClick={() => (count > 0 ? handlerBuy(false) : null)}>-</div>
            </button>
          ) : (
            <button onClick={() => handlerBuy(true)}>Купити</button>
          ))}
      </div>
    </div>
  );
};

export default DeviceItem;
