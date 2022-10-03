import { $authHost, $host } from "./index";

export const createDevice = async (device) => {
  const { data } = await $authHost.post("api/device", device);
  return data;
};
export const deleteDevice = async (id) => {
  const data = await $authHost.delete("api/device/" + id);
  return data;
};
export const fetchDevices = async (order, page, limit) => {
  const { data } = await $host.get(`api/device`, {
    params: {
      order,
      page,
      limit,
    },
  });
  return data;
};
export const fetchDevice = async (id) => {
  const { data } = await $host.get(`api/device/` + id);
  return data;
};
export const createType = async (type) => {
  const { data } = await $authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get("api/type");
  return data;
};

export const fetchPrivatExchangeRates = async () => {
  const { data } = await $host.get("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");
  return data;
};
