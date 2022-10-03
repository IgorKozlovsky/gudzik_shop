const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User, Basket, BasketDevice, Device, DeviceSize } = require("../models/models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

const jwtGeneration = (id, email, role) => {
  return jsonwebtoken.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gudzikshop1234@gmail.com",
    pass: "lsxdgqsuzyvfqonr",
  },
});

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный email или password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("Пользователь с таким email уже существует"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = jwtGeneration(user.id, user.email, user.role);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("Такого пользователя не существует"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    const token = jwtGeneration(user.id, user.email, user.role);
    return res.json({ token });
  }

  async check(req, res, next) {
    const token = jwtGeneration(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }

  async getBasket(req, res) {
    const { userId } = req.query;
    let basket = await Basket.findOne({
      where: { userId },
      include: [
        {
          model: BasketDevice,
          required: false,
          where: {
            count: {
              [Op.ne]: 0,
            },
          },
          include: [
            {
              model: Device,
              include: [{ model: DeviceSize, as: "size" }],
            },
          ],
        },
      ],
    });
    // if (!basket) {
    //   basket = await Basket.create({ userId });
    // }
    return res.json(basket);
  }

  async getBasketDevice(req, res) {
    const { basketId, deviceId, articul, variant, size } = req.query;
    let name = variant ? `${articul} ${variant}` : articul;
    const basket = await BasketDevice.findOne({ where: { basketId, deviceId, name, size }, include: Device });
    return res.json(basket);
  }

  async addBasket(req, res) {
    const { basketId, deviceId, operation, articul, variant, size, price } = req.body;
    let name = variant ? `${articul} ${variant}` : articul;
    let basketDevice = await BasketDevice.findOne({ where: { deviceId, basketId, size, name } });
    if (!basketDevice) {
      basketDevice = await BasketDevice.create({ basketId, deviceId, count: 1, name, size, price });
    } else if (operation) {
      basketDevice.update({ count: basketDevice.count + 1 });
    } else {
      basketDevice.update({ count: basketDevice.count - 1 });
    }
    return res.json(basketDevice);
  }

  async setBasketDevice(req, res) {
    const { basketId, deviceId, articul, variant, size, count } = req.body;
    let name = variant ? `${articul} ${variant}` : articul;
    let basketDevice = await BasketDevice.findOne({ where: { deviceId, basketId, name, size } });
    basketDevice.update({ count });
    return res.json(basketDevice);
  }

  async sendBasket(req, res) {
    const { data, basket, basketFullPrice } = req.body;
    let result = transporter.sendMail({
      from: "gudzikshop1234@gmail.com",
      to: "gudzikshop1234@gmail.com",
      subject: "Сообщение от gudzikshop",
      text: "Заказ:",
      html: `Имя: ${data.firstName} <br />Фамилия: ${data.lastName} <br />Отчество: ${data.patronymic} <br />Телефон: ${
        data.tel
      } <br />Електронная почта: ${data.mail} <br />Почта: ${data.postOffice} <br />Адресс отдела почты: ${
        data.adress
      } <br />Комментарий к заказу: ${data.comment} <br />Товары: ${basket.basket_devices
        .map((e) => {
          let art = e.name.split(" ")[0];
          let vari = e.name.split(" ")[1];
          return `<br /><br />&nbsp;&nbsp;&nbsp;Артикул: ${art} 
          ${vari ? "<br />&nbsp;&nbsp;&nbsp;Разновидность:" + vari : ""} 
          <br />&nbsp;&nbsp;&nbsp;Размер: ${e.size} 
          <br />&nbsp;&nbsp;&nbsp;Стоимость одного: ${e.price}₴ 
          <br />&nbsp;&nbsp;&nbsp;Количество: ${e.count} 
          <br />&nbsp;&nbsp;&nbsp;Общая стоимость:${e.price * e.count}₴`;
        })
        .join("")}
        <br />Полная стоимость заказа: ${basketFullPrice}₴`,
    });
    return res.json(result);
  }
}
module.exports = new UserController();
