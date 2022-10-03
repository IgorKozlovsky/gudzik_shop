const Router = require("express");
const router = new Router();
const deviceRouter = require("./deviceRoute");
const userRouter = require("./userRoute");
const typeRouter = require("./typeRoute");
const tagRouter = require("./tagRoute");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/device", deviceRouter);
router.use("/tag", tagRouter);

module.exports = router;
