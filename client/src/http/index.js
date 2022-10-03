import axios from "axios";
// NODE_ENV
const baseURL = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/";
const $host = axios.create({
  baseURL,
});
const $authHost = axios.create({
  baseURL,
});

const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $authHost, $host };
