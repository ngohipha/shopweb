const router = require("express").Router();
const controller = require("../controllers/category");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], controller.createCategory);
router.get("/",  controller.getALlCategory);
router.put("/:cid", [verifyAccessToken, isAdmin], controller.updateCategory);
router.delete("/:cid", [verifyAccessToken, isAdmin], controller.deleteCategory);

module.exports = router;
