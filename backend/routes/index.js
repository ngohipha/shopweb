const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const blogcategoryRouter = require("./blogcategory");
const brandRouter = require('./brand')
const couponRouter = require('./coupon')
const orderRouter = require('./order')
const insertRouter = require('./insertdata')

const blog = require("./blog");
const { notFound, errHandle } = require("../middlewares/errHandler");
const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/blogcategory", blogcategoryRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/blog", blog);
  app.use("/api/brand", brandRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/insertData", insertRouter);

  app.use(notFound);
  app.use(errHandle);
};

module.exports = initRoutes;
