const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res) => {
    try {
      const response = await BlogCategory.create(req.body);
      return res.json({
        success: true,
        createBlogCategory: response,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

const getALlBlogCategory = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find().select("title _id");
  return res.json({
    success: response ? true : false,
    getALlBlogCategory: response ? response : "Cannot getAll  Blogcategory",
  });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedBlogCategory: response ? response : "Cannot update  Blogcategory",
  });
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await BlogCategory.findByIdAndDelete(bcid);
  return res.json({
    success: response ? true : false,
    updatedBlogCategory: response ? response : "Cannot delete  Blogcategory",
  });
});
module.exports = {
  createBlogCategory,
  getALlBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
};
