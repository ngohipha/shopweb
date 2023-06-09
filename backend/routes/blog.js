const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const controller = require("../controllers/blog");
const upload = require('../config/cloudinary.config')
router.get("/", controller.getBlogs);
router.post("/", [verifyAccessToken, isAdmin], controller.createNewBlog);
router.put("/image/:bid", [verifyAccessToken , isAdmin], upload.single('image'),controller.uploadImagesBlog);
router.put("/likes/:bid", [verifyAccessToken], controller.likeBlog);
router.put("/dislike/:bid", [verifyAccessToken], controller.dislikeBlog);
router.put("/update/:bid", [verifyAccessToken, isAdmin], controller.updateBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], controller.deleteBlog);
router.get("/one/:bid", controller.getBlog);

module.exports = router;
