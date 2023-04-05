const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const controller = require("../controllers/order");



router.post('/', verifyAccessToken , controller.createOrder)
router.put('/status/:oid', [verifyAccessToken, isAdmin] , controller.updateStatusOrder)
router.get('/', [verifyAccessToken] , controller.getUserOrder)
router.get('/admin', [verifyAccessToken ,isAdmin] , controller.getOrder)



module.exports = router;