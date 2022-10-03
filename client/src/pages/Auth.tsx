import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "..";
import { fetchBasketDevices } from "../http/BasketAPI";
import { login, registration } from "../http/userAPI";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";

interface IFormInput {
  loginData: string;
  password: string;
  re_password: string;
}

const Auth = observer(() => {
  const location = useLocation();
  const navigation = useNavigate();
  let locationBool = location.pathname === LOGIN_ROUTE;
  let { user } = useUserContext();
  const [error, setError] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<IFormInput>({ mode: "all" });

  const onClickAuth: SubmitHandler<IFormInput> = async ({ loginData, password }) => {
    try {
      let data, basket;
      if (locationBool) {
        data = await login(loginData, password);
        //@ts-ignore
        basket = await fetchBasketDevices(data.id).then((data) => user?.setBasket(data));
      } else {
        data = await registration(loginData, password);
        data = await login(loginData, password);
        //@ts-ignore
        basket = await fetchBasketDevices(data.id).then((data) => user?.setBasket(data));
      }
      //@ts-ignore
      user?.setUser(data);
      user?.setIsAuth(true);
      navigation(SHOP_ROUTE);
      window.location.reload();
    } catch (e: any) {
      setError(e.response.data.message);
    }
  };

  return (
    <div className="auth">
      <form className="auth-wrapper" onSubmit={handleSubmit(onClickAuth)}>
        <h2 className="auth-title">{locationBool ? "Авторизація" : "Реєстрація"}</h2>
        <div className="auth-inputs">
          <div>
            <input
              className={classNames("auth-input", {
                "error-valid-empty": errors.loginData,
              })}
              type="text"
              placeholder="Введіть ваш логін..."
              {...register("loginData", {
                required: "Введіть ваш логін",
                maxLength: {
                  value: 25,
                  message: "Максимум 25 символів",
                },
                minLength: {
                  value: 5,
                  message: "Мінімум 5 символи",
                },
              })}
            />
            {errors?.loginData && <p className="error-valid">{errors.loginData.message || "Помилка"}</p>}
          </div>
          <div>
            <input
              className={classNames("auth-input", {
                "error-valid-empty": errors.password,
              })}
              type="password"
              placeholder="Введіть ваш пароль..."
              {...register("password", {
                required: "Введіть ваш пароль",
                maxLength: {
                  value: 25,
                  message: "Максимум 25 символів",
                },
                minLength: {
                  value: 8,
                  message: "Мінімум 8 символи",
                },
              })}
            />
            {errors?.password && <p className="error-valid">{errors.password.message || "Помилка"}</p>}
          </div>
          {!locationBool && (
            <div>
              <input
                className={classNames("auth-input", {
                  "error-valid-empty": errors.re_password,
                })}
                type="password"
                placeholder="Повторіть ваш пароль..."
                {...register("re_password", {
                  required: "Повторіть ваш пароль",
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Паролі не співпадають";
                    }
                  },
                })}
              />
              {errors?.re_password && <p className="error-valid">{errors.re_password.message || "Помилка"}</p>}
            </div>
          )}
        </div>
        {locationBool ? (
          <div className="auth-link">
            Немає облікового запису?{" "}
            <NavLink to={REGISTRATION_ROUTE} className="auth-link__transition" onClick={() => reset()}>
              Зареєструйся!
            </NavLink>
            {error && <p className="error-valid">{error}</p>}
          </div>
        ) : (
          <div className="auth-link">
            Є обліковий запис?{" "}
            <NavLink to={LOGIN_ROUTE} className="auth-link__transition" onClick={() => reset()}>
              Увійдіть!
            </NavLink>
            {error && <p className="error-valid">{error}</p>}
          </div>
        )}
        <input className="auth-button" type="submit" value={locationBool ? "Увійти" : "Зареєструватися"} />
      </form>
    </div>
  );
});

export default Auth;
