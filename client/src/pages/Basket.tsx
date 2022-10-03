import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserContext } from "..";
import BasketForm from "../components/BasketForm";
import BasketList from "../components/BasketList";
import { fetchBasketDevices } from "../http/BasketAPI";
import { IBasketDevice } from "../types/types";
import { SHOP_ROUTE } from "../utils/consts";

const sinMath = require("sinful-math");

const Basket = observer(() => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    fetchBasketDevices(user?.user?.id)
      .then((data) => {
        user?.setBasket(data);
        user?.setBasketFullPrice(
          data.basket_devices.reduce(
            (prev: number, curr: IBasketDevice) => sinMath.add(prev, sinMath.mul(curr.count, curr.price)),
            0
          )
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Я поц</div>;
  }
  return (
    <>
      {alert && (
        <div className="modal">
          <div className="modal-alert">
            <div className="modal-content">
              <div className="modal-text">Дякуємо. Ми надіслали ваше замовлення!</div>
              <div className="modal-controls">
                <button className="button button--inform" onClick={() => setAlert(false)}>
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {user?.basket?.basket_devices.length ? (
        <div className="cart">
          <div className="cart-wrapper">
            <BasketForm onClick={() => setAlert(true)} />
            <BasketList />
          </div>
        </div>
      ) : (
        <div className="cart-empty">
          <div className="cart-empty-wrapper">
            <h2>Кошик порожній 😔</h2>
            <p>
              Найімовірніше, ви ще не додали товар до кошику.
              <br />
              Щоб замовити щось, перейдіть на головну сторінку.
            </p>
            <div className="button">
              <NavLink to={SHOP_ROUTE}>Назад</NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Basket;
