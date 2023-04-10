const { response } = require("express");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);

  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});
// Filter, sort , pagination
const getProducts = asyncHandler(async (req, res) => {
  //copy quẻries dung toan tu tham chieu
  const queries = { ...req.query };
  // tach cac truong dac biet ra khoi query
  //fields lay' theo truong
  const exludeFileds = ["limit", "sort", "page", "fields"];
  exludeFileds.forEach((el) => delete queries[el]);

  // format lai cac operators cho dung cu phap mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEL) => `$${macthedEL}`
  );
  const formatedQueries = JSON.parse(queryString);
  //filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatedQueries);
  // price: {gt:5000 , gte:3000}
  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //fiekds limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  // pagination
  //limit: so object lay ve 1 lan api
  // skip: 2
  // +2 => 2
  // +dasdad => Nan
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);
  // execute query
  // so luong sp thoa man dieu khien !=== so luong sp tra ve 1 lan goi API
  try {
    const response = await queryCommand;
    const counts = await Product.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cannot get products",
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

const updateProducts = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedData: updatedProduct ? updatedProduct : "Cannot update products",
  });
});
const deleteProducts = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deleteProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deleteProduct ? true : false,
    deletedProduct: deleteProduct ? deleteProduct : "Cannot delete products",
  });
});
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  if (alreadyRating) {
    //update start & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    // add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }
  //sum ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;
  await updatedProduct.save();
  return res.status(200).json({
    status: true,
    updatedProduct,
  });
});

const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(
    pid,
    { $push: { images: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedProduct: response ? response : "Cannot upload images product",
  });
});


const insertData = asyncHandler(async (req, res) => {
  
  return res.status(200).json({
    status: response ? true : false,
    updatedProduct: response ? response : "Cannot upload images product",
  });
});
module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProducts,
  deleteProducts,
  ratings,
  uploadImagesProduct,
};
