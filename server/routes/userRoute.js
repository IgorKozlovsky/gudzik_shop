const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);

router.post("/basket", authMiddleware, userController.addBasket);
router.put("/basket", authMiddleware, userController.setBasketDevice);
router.get("/basket", authMiddleware, userController.getBasket);
router.get("/basket/:id", authMiddleware, userController.getBasketDevice);

router.post("/basket/:id", authMiddleware, userController.sendBasket);

module.exports = router;
