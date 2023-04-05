const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const controller = require("../controllers/coupon");



router.get("/", controller.getCoupon);
router.post("/",[verifyAccessToken , isAdmin], controller.createNewCoupon);
router.put("/:cid",[verifyAccessToken , isAdmin], controller.updateCoupon);
router.delete("/:cid",[verifyAccessToken , isAdmin], controller.deleteCoupon);


module.exports = router;
