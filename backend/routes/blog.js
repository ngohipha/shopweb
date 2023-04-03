const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const controller = require("../controllers/blog");

router.get("/", controller.getBlogs);
router.post("/", [verifyAccessToken, isAdmin], controller.createNewBlog);
router.put("/likes/:bid", [verifyAccessToken], controller.likeBlog);
router.put("/dislike/:bid", [verifyAccessToken], controller.dislikeBlog);
router.put("/update/:bid", [verifyAccessToken, isAdmin], controller.updateBlog);

module.exports = router;
