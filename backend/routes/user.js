const router = require("express").Router();
const controller = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
router.post("/register", controller.register);
router.get("/finalregister/:token", controller.finalRegister);

router.post("/login", controller.login);
router.get("/current", verifyAccessToken, controller.getCurrent);
router.post("/refreshtoken", controller.refreshAccessToken);
router.get("/logout", controller.logout);
router.get("/forgotpassword", controller.forgotpassword);
router.post("/resetpassword", controller.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], controller.getUsers);
router.delete("/", [verifyAccessToken, isAdmin], controller.deleteUsers);
router.put("/updateuser", [verifyAccessToken], controller.updateUsers);
router.put(
  "/updateuserbyadmin/:uid",
  [verifyAccessToken, isAdmin],
  controller.updateUsersByAdmin
);
router.put("/address", [verifyAccessToken], controller.updateUserAddress);
router.put("/cart", [verifyAccessToken], controller.updateCart);

module.exports = router;

// create (post) + put - body
// get + delete - query
