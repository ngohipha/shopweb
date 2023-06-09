const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const response = await Category.create(req.body);
  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Cannot create new category",
  });
});

const getAllCategory = asyncHandler(async (req, res) => {
  const response = await Category.find()
  return res.json({
    success: response ? true : false,
    getAllCategory: response ? response : "Cannot getAll  category",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Category.findByIdAndUpdate(cid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedCategory: response ? response : "Cannot update  category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Category.findByIdAndDelete(cid);
  return res.json({
    success: response ? true : false,
    updatedCategory: response ? response : "Cannot delete  category",
  });
});
module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
