const router = require("express").Router();
const controller = require("../controllers/inserData");

router.post("/",  controller.inserProduct);
router.post("/cate",  controller.inserCategory);

module.exports = router;
