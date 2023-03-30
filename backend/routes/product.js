const router = require("express").Router();
const controller = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], controller.createProduct);

router.get("/", controller.getProducts);



router.put("/:pid", [verifyAccessToken, isAdmin], controller.updateProducts);
router.delete("/:pid", [verifyAccessToken, isAdmin], controller.deleteProducts);

router.get("/:pid", controller.getProduct);

module.exports = router;
