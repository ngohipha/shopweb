const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const data = require("../config/ecommerce.json");
const slugify = require("slugify");
const categoryData = require("../config/cate_brand");
const Category = require("../models/category");
const fn = async (product) => {
  try {
    const newProduct = {
      title: product?.name,
      slug: slugify(product?.name) + Math.round(Math.random() * 100) + "",
      description: product?.description,
      brand: product?.brand,
      price: Math.round(Number(product?.price.match(/\d/g).join("")) / 100),
      category: product?.category[1],
      quantity: Math.round(Math.random() * 1000),
      sold: Math.round(Math.random() * 100),
      images: product?.images,
      color: product?.variants?.find((el) => el.label === "Color")?.variants[0],
      thumb: product?.thumb,
      totalRatings: Math.round(Math.random() * 5),
    };
    const result = await Product.create(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

const inserProduct = asyncHandler(async (req, res) => {
  try {
    const promises = [];
    for (let product of data) promises.push(fn(product));
    await Promise.all(promises);
    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json("done");
  }
});
const fn2 = async (cate) => {
  if (!cate?.brand || !cate.brand.length) {
    console.log(`Brand not provided for category ${cate?.cate}`);
    return;
  }
  const existingCategory = await Category.findOne({ brand: cate.brand.join(',') });
  if (existingCategory) {
    console.log(`Category for brand ${cate.brand.join(',')} already exists`);
    return;
  }
  await Category.create({
    title: cate.cate,
    brand: cate.brand.join(','),
    image: cate.image
  });
};

const inserCategory = asyncHandler(async (req, res) => {
  try {
    const promises = [];
    for (let cate of categoryData) promises.push(fn2(cate));
    await Promise.all(promises);
    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json("done");
  }
});

module.exports = {
  inserProduct,
  inserCategory,
};
