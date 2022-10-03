import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useUserContext } from ".";
import AppRouter from "./components/AppRouter";
import Header from "./components/Header";
import { check } from "./http/userAPI";
import "./sass/App.scss";
import { BrowserRouter } from "react-router-dom";
import { fetchBasketDevices } from "./http/BasketAPI";
import { fetchDevices, fetchPrivatExchangeRates, fetchTypes } from "./http/deviceAPI";
import Footer from "./components/Footer";
import { fetchTagGroups } from "./http/tagApi";
import { IDevice } from "./types/types";
const sinMath = require("sinful-math");

export const onExchange = (rows: IDevice[], exchangeRate: number) => {
  let deviceArr: IDevice[] = rows;
  for (let i = 0; i < deviceArr.length; i++) {
    for (let y = 0; y < deviceArr[i].size.length; y++) {
      deviceArr[i].size[y].price = sinMath.mul(deviceArr[i].size[y].price, exchangeRate);
    }
  }
  return deviceArr;
};

const App = observer(() => {
  const { user, device } = useUserContext();
  const [loading, setLoading] = useState<boolean>(true);

  const startFunc = async () => {
    try {
      await check().then((data) => {
        user?.setIsAuth(true);
        //@ts-ignore
        user?.setRole(data.role);
        //@ts-ignore
        user?.setUser(data);
        //@ts-ignore
        fetchBasketDevices(data.id).then((data) => {
          user?.setBasket(data);
        });
      });
    } catch (err) {
      console.log(err);
    }
    await fetchDevices().then(({ count, rows }) => {
      device?.setDevices(onExchange(rows, device?.exchangeRate));
      device?.setDevicesCount(count);
    });
    await fetchTypes().then((data) => device?.setTypes(data));
    await fetchTagGroups()
      .then((data) => device?.setTags(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrivatExchangeRates().then((data) => device?.setExchangeRate(data[0].sale));
    startFunc();
  }, []);

  if (loading) {
    return <div>Загрузка</div>;
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="app-content__container">
          <AppRouter />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
});

export default App;
