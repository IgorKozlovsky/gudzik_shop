import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserContext } from "..";
import { fetchBasketDevices, sendBasket } from "../http/BasketAPI";

interface BasketFormProps {
  onClick: () => void;
}

type FormValues = {
  firstName: string;
  lastName: string;
  patronymic: string;
  tel: string;
  mail: string;
  adress: string;
  postOffice: string;
  comment: string;
};

const BasketForm: FC<BasketFormProps> = observer(({ onClick }) => {
  const { user } = useUserContext();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<FormValues>({ mode: "onBlur" });
  const onSubmit = async (data: FormValues) => {
    fetchBasketDevices(user?.user?.id).then((basket) => sendBasket(data, basket, user?.basketFullPrice));
    reset();
  };

  return (
    <form className="cart-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-wrapper">
        <div className="form-items">
          <div className="form-items__inp">
            <label>Ім'я</label>
            <input
              type="text"
              {...register("firstName", {
                required: "Введіть своє ім'я",
                maxLength: {
                  value: 25,
                  message: "Максимум 25 символів",
                },
                minLength: {
                  value: 3,
                  message: "Мінімум 3 символи",
                },
              })}
            />
            {errors?.firstName && <p className="error-valid">{errors.firstName.message || "Помилка"}</p>}
          </div>
          <div className="form-items__inp">
            <label>Прізвище</label>
            <input
              type="text"
              {...register("lastName", {
                required: "Введіть своє прізвище",
                maxLength: {
                  value: 25,
                  message: "Максимум 25 символів",
                },
                minLength: {
                  value: 3,
                  message: "Мінімум 3 символи",
                },
              })}
            />
            {errors?.lastName && <p className="error-valid">{errors.lastName.message || "Помилка"}</p>}
          </div>
          <div className="form-items__inp">
            <label>По батькові</label>
            <input
              type="text"
              {...register("patronymic", {
                required: "Введіть своє по батькові",
                maxLength: {
                  value: 25,
                  message: "Максимум 25 символів",
                },
                minLength: {
                  value: 3,
                  message: "Мінімум 3 символи",
                },
              })}
            />
            {errors?.patronymic && <p className="error-valid">{errors.patronymic.message || "Помилка"}</p>}
          </div>
        </div>
        <div className="form-items">
          <div className="form-items__inp">
            <label>Мобільний телефон</label>
            <input
              type="tel"
              {...register("tel", {
                required: "Введіть свій номер телефону",
                pattern: {
                  value: /\+?[0-9]+/gim,
                  message: "Тільки цифри",
                },
                maxLength: {
                  value: 13,
                  message: "Неправильний номер",
                },
                minLength: {
                  value: 10,
                  message: "Неправильний номер",
                },
              })}
            />
            {errors?.tel && <p className="error-valid">{errors.tel.message || "Помилка"}</p>}
          </div>
          <div className="form-items__inp">
            <label>Електронна пошта</label>
            <input
              type="email"
              {...register("mail", {
                required: "Введіть свою пошту",
                pattern: {
                  value: /.+@.+[.].+/gim,
                  message: "Неправильна пошта",
                },
              })}
            />
            {errors?.mail && <p className="error-valid">{errors.mail.message || "Помилка"}</p>}
          </div>
        </div>
        <div className="form-items">
          <div className="form-items__inp">
            <label>Виберіть пошту</label>
            <select {...register("postOffice")}>
              <option value="Укрпошта">Укрпошта</option>
              <option value="Нова пошта">Нова пошта</option>
            </select>
          </div>
          <div className="form-items__inp">
            <label>Адреса відділення</label>
            <input
              type="text"
              {...register("adress", {
                required: "Введіть адресу доставки",
              })}
            />
            {errors?.adress && <p className="error-valid">{errors.adress.message || "Помилка"}</p>}
          </div>
        </div>
        <div className="form-items">
          <div className="form-items__inp">
            <label>Коментар до замовлення</label>
            <textarea {...register("comment")} />
          </div>
        </div>
      </div>
      <div className="form-footer">
        <div className="form-footer-wrapper">
          <div className="form-footer-sum">
            <div> До сплати:</div> <div>{user?.basketFullPrice} ₴</div>
          </div>
          <input
            type="submit"
            className={classNames("button", {
              "button--disabled": !isValid,
            })}
            value={"Замовити"}
            onClick={onClick}
            disabled={!isValid}
          />
        </div>
      </div>
    </form>
  );
});

export default BasketForm;
