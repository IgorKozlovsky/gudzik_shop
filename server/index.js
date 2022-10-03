//Инициализация сервера
require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors"); // для отправления запросов с браузера
const router = require("./routes/index");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");

const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);
// Обработка ошибока, последний middleware
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "WORKING" });
// });

const start = async () => {
  try {
    await sequelize.authenticate(); // подключение к базе данных
    await sequelize.sync(); // сверяет состояние бд с схемой данных
    app.listen(PORT, () => console.log("Server starts on port: ", PORT));
  } catch (error) {
    console.log(error);
  }
};
start();
