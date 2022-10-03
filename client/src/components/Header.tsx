import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "..";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import classNames from "classnames";

const Header = observer(() => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const [confirm, setСonfirm] = useState<boolean>(false);

  const logOut = () => {
    user?.setUser(null);
    user?.setIsAuth(false);
    user?.setRole("USER");
    user?.setBasket(null);
    localStorage.setItem("token", "");
    window.location.reload();
  };

  return (
    <header className="app-header">
      <div className="row"></div>
      <nav className="nav">
        <div className="humburger">
          <input id="menu__toggle" type="checkbox" />
          <label className="humburger-btn" htmlFor="menu__toggle">
            <span></span>
          </label>
          <nav className="humburger-list">
            {user?.isAuth ? (
              <>
                <div className="humburger-list__item" onClick={() => navigate(SHOP_ROUTE)}>
                  Каталог
                </div>
                <div className="humburger-list__item" onClick={() => navigate(BASKET_ROUTE)}>
                  Кошик
                </div>
                <div className="humburger-list__item" onClick={() => navigate(ADMIN_ROUTE)}>
                  Адмін панель
                </div>
                <div
                  className="humburger-list__item"
                  onClick={() => {
                    logOut();
                    navigate(SHOP_ROUTE);
                  }}
                >
                  Вийти
                </div>
              </>
            ) : (
              <>
                <div className="humburger-list__item" onClick={() => navigate(SHOP_ROUTE)}>
                  Каталог
                </div>
                <div className="humburger-list__item" onClick={() => navigate(LOGIN_ROUTE)}>
                  Увійти
                </div>
              </>
            )}
          </nav>
        </div>
        <ul className="nav-wrapper">
          {user?.isAuth ? (
            <>
              <li className="nav-wrapper-items">
                <div className="nav-wrapper-items__item button-exit ">
                  <div
                    onClick={() => {
                      setСonfirm(true);
                    }}
                  >
                    Вийти
                  </div>
                  {confirm && (
                    <ul className="dropdown-confirm">
                      <li>Ви впевнені, що хочете вийти?</li>
                      <li>
                        <button
                          className="button button--success"
                          onClick={() => {
                            setСonfirm(false);
                            logOut();
                            navigate(SHOP_ROUTE);
                          }}
                        >
                          Так
                        </button>
                        <button className="button button--error" onClick={() => setСonfirm(false)}>
                          Ні
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                <div
                  className={classNames("nav-wrapper-items__item", {
                    "nav-wrapper-items__item--active": location == SHOP_ROUTE,
                  })}
                >
                  <div onClick={() => navigate(SHOP_ROUTE)}>Каталог</div>
                </div>
                {user.role == "ADMIN" && (
                  <div
                    className={classNames("nav-wrapper-items__item", {
                      "nav-wrapper-items__item--active": location == ADMIN_ROUTE,
                    })}
                  >
                    <div onClick={() => navigate(ADMIN_ROUTE)}>Адмін панель</div>
                  </div>
                )}
              </li>
              <div className="nav-wrapper-cart" onClick={() => navigate(BASKET_ROUTE)}>
                <img src={require("../assets/images/shopping-cart.png")} alt="Basket" width="60" height="60" />
              </div>
            </>
          ) : (
            <li className="nav-wrapper-items">
              <div
                className={classNames("nav-wrapper-items__item", {
                  "nav-wrapper-items__item--active": location == LOGIN_ROUTE || location == REGISTRATION_ROUTE,
                })}
              >
                <div onClick={() => navigate(LOGIN_ROUTE)}>Увійти</div>
              </div>
              <div
                className={classNames("nav-wrapper-items__item", {
                  "nav-wrapper-items__item--active": location == SHOP_ROUTE,
                })}
              >
                <div onClick={() => navigate(SHOP_ROUTE)}>Каталог</div>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
});

export default Header;
