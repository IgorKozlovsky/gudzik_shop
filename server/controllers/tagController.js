const { Tags, Tag } = require("../models/models");
const ApiError = require("../error/ApiError");

class TagController {
  async createGroup(req, res, next) {
    try {
      const { name } = req.body;
      await Tags.create({ name });
      const tags = await Tags.findAll({ include: [{ model: Tag, as: "tag" }] });
      return res.json(tags);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async deleteGroup(req, res) {
    const { id } = req.params;
    await Tags.destroy({ where: { id } });
    await Tag.destroy({ where: { tagId: id } });
    const tags = await Tags.findAll({ include: [{ model: Tag, as: "tag" }] });
    return res.json(tags);
  }
  async getAllGroups(req, res) {
    const tags = await Tags.findAll({ include: [{ model: Tag, as: "tag" }] });
    return res.json(tags);
  }

  async createTag(req, res, next) {
    try {
      const { value, groupId } = req.body;
      const tag = await Tag.create({ value, tagId: groupId });
      const tags = await Tags.findAll({ include: [{ model: Tag, as: "tag" }] });
      return res.json(tags);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async deleteTag(req, res) {
    const { id } = req.params;
    await Tag.destroy({ where: { id } });
    const tags = await Tags.findAll({ include: [{ model: Tag, as: "tag" }] });
    return res.json(tags);
  }
  async getAllTagsByGroup(req, res) {
    const { id } = req.params;
    const tag = await Tags.findAll({
      where: {
        tagId: id,
      },
    });
    return res.json(tag);
  }
}

module.exports = new TagController();
