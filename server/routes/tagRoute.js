const Router = require("express");
const router = new Router();
const tagController = require("../controllers/tagController");
const checkRoleMiddleware = require("../middleware/checkRoleMiddleware");

router.post("/group", checkRoleMiddleware("ADMIN"), tagController.createGroup);
router.get("/group", tagController.getAllGroups);
router.delete("/group/:id", checkRoleMiddleware("ADMIN"), tagController.deleteGroup);

router.post("/", checkRoleMiddleware("ADMIN"), tagController.createTag);
router.get("/:id", tagController.getAllTagsByGroup);
router.delete("/:id", checkRoleMiddleware("ADMIN"), tagController.deleteTag);

module.exports = router;
