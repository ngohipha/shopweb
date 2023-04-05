const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createNewBrand = asyncHandler(async (req, res) => {
    try {
      const response = await Brand.create(req.body);
      return res.json({
        success: true,
        createNewBrand: response,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });

const getBrand = asyncHandler(async (req, res) => {
  const response = await Brand.find()
  return res.json({
    success: response ? true : false,
    getBrand: response ? response : "Cannot getAll  Brand",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Brand.findByIdAndUpdate(bid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updateBrand: response ? response : "Cannot update  Brand",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Brand.findByIdAndDelete(bid);
  return res.json({
    success: response ? true : false,
    deleteBrand: response ? response : "Cannot delete  Brand",
  });
});
module.exports = {
 createNewBrand,
 getBrand,
 updateBrand,
 deleteBrand
};
