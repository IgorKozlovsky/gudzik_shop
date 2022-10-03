import { $authHost, $host } from "./index";

export const addBasketDevice = async (deviceId, basketId, operation, articul, variant, size, price) => {
  const data = await $authHost.post("api/user/basket", {
    deviceId,
    basketId,
    operation,
    articul,
    variant,
    size,
    price,
  });
  return data;
};
export const setBasketDevice = async (deviceId, basketId, count, articul, variant, size) => {
  const data = await $authHost.put("api/user/basket", { deviceId, basketId, count, articul, variant, size });
  return data;
};
export const fetchBasketDevice = async (deviceId, basketId, articul, variant, size) => {
  const data = await $authHost.get("api/user/basket/" + deviceId, {
    params: {
      deviceId,
      basketId,
      articul,
      variant,
      size,
    },
  });
  return data;
};
export const fetchBasketDevices = async (userId) => {
  const { data } = await $authHost.get(`api/user/basket`, {
    params: {
      userId,
    },
  });
  return data;
};
export const sendBasket = async (data, basket, basketFullPrice) => {
  const { result } = await $authHost.post(`api/user/basket/` + basket.id, { data, basket, basketFullPrice });
  return result;
};
