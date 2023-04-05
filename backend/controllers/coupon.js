const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewCoupon = asyncHandler(async (req, res) => {
  try {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry) throw new Error("Missing inputs");
    const response = await Coupon.create({
      ...req.body,
      expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      createNewCoupon: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const getCoupon = asyncHandler(async (req, res) => {
  try {
    const response = await Coupon.find().select("-createdAt -updatedAt");
    return res.json({
      success: true,
      coupons: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
    if (req.body.expiry)
      req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000;
    const response = await Coupon.findByIdAndUpdate(cid, req.body, {
      new: true,
    });
    return res.json({
      success: true,
      updateCoupon: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


const deleteCoupon = asyncHandler(async (req, res) => {
    try {
      const { cid } = req.params;
      const response = await Coupon.findByIdAndDelete(cid);
      return res.json({
        success: true,
        updateCoupon: response,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });
module.exports = {
  createNewCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon
};
