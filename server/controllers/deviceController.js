const { Device, DeviceInfo, BasketDevice, DeviceVariant, DeviceSize, Type } = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

class DeviceController {
  async create(req, res, next) {
    try {
      let { variants, sizes, articul, infos, typeId, tags } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      console.log(req.body);

      let highestPrice = +JSON.parse(sizes).sort((a, b) => b.price - a.price)[0].price;
      tags = JSON.parse(tags);

      const device = await Device.create({ articul, img: fileName, typeId, highestPrice, tags });

      if (sizes) {
        sizes = JSON.parse(sizes);
        sizes.forEach((i) =>
          DeviceSize.create({
            size: i.size,
            price: i.price,
            amount: i.amount,
            deviceId: device.id,
          })
        );
      }

      if (variants) {
        variants = JSON.parse(variants);
        variants.forEach((i) =>
          DeviceVariant.create({
            name: i.name,
            deviceId: device.id,
          })
        );
      }

      if (infos) {
        infos = JSON.parse(infos);
        infos.forEach((i) =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          })
        );
      }

      return res.json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res) {
    let { typeId, limit, page, order } = req.query;
    page = page || 1;
    limit = limit || 9;
    order = order || "ASC";
    let offset = page * limit - limit;
    let devices;
    if (!typeId) {
      devices = await Device.findAndCountAll({
        order: [["highestPrice", order]],
        limit,
        offset,
        include: [
          { model: DeviceInfo, as: "info" },
          { model: DeviceVariant, as: "variant" },
          { model: DeviceSize, as: "size" },
        ],
        distinct: true,
      });
    }
    if (typeId) {
      devices = await Device.findAndCountAll({
        order: [["highestPrice", order]],
        limit,
        offset,
        include: [
          { model: DeviceInfo, as: "info" },
          { model: DeviceVariant, as: "variant" },
          { model: DeviceSize, as: "size" },
        ],
        distinct: true,
      });
    }

    return res.json(devices);
  }

  async getById(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [
        { model: DeviceInfo, as: "info" },
        { model: DeviceVariant, as: "variant" },
        { model: DeviceSize, as: "size" },
      ],
    });
    return res.json(device);
  }

  async delete(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({ where: { id } });
    fs.unlink(process.cwd() + `/static/${device.img}`, (err) => {
      if (err) console.log(err);
      else {
        console.log("\nDeleted file: example_file.txt");
      }
    });
    await BasketDevice.destroy({ where: { deviceId: id } });
    await DeviceVariant.destroy({ where: { deviceId: id } });
    await DeviceSize.destroy({ where: { deviceId: id } });
    await DeviceInfo.destroy({ where: { deviceId: id } });
    await Device.destroy({ where: { id } });
    return res.json(id);
  }
}

module.exports = new DeviceController();
