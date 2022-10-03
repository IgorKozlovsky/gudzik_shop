const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketDevice = sequelize.define("basket_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  count: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
});

const Device = sequelize.define("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  articul: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  highestPrice: { type: DataTypes.FLOAT, allowNull: false },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
});

const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const DeviceInfo = sequelize.define("device_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const DeviceVariant = sequelize.define("device_variant", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const DeviceSize = sequelize.define("device_size", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  size: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: true },
});

const Tags = sequelize.define("tags", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Tag = sequelize.define("tag_item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.STRING, allowNull: false, unique: true },
});

//Связи
User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Type.hasMany(Device);
Device.belongsTo(Type);

Device.hasMany(DeviceInfo, { as: "info", onDelete: "cascade" });
DeviceInfo.belongsTo(Device);

Device.hasMany(DeviceVariant, { as: "variant", onDelete: "cascade" });
DeviceVariant.belongsTo(Device);

Device.hasMany(DeviceSize, { as: "size", onDelete: "cascade" });
DeviceSize.belongsTo(Device);

Tags.hasMany(Tag, { as: "tag", onDelete: "cascade" });
Tag.belongsTo(Tags);

module.exports = {
  Basket,
  BasketDevice,
  Device,
  DeviceInfo,
  DeviceVariant,
  DeviceSize,
  Type,
  User,
  Tags,
  Tag,
};
