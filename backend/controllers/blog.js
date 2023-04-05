const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");
const { patch } = require("../routes/blog");

const createNewBlog = asyncHandler(async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error("Missing inputs");
    const response = await Blog.create(req.body);
    return res.json({
      success: true,
      createBlog: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
      success: true,
      updateBlog: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

const getBlogs = asyncHandler(async (req, res) => {
  try {
    const response = await Blog.find();
    return res.json({
      success: true,
      getBlog: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

//like , dislike

/*
  khi nguoi dung like mot bai blog :
  1. check xem nguoi dung do trc co dislike hay k => bo dislike
  2. check xem ng do trc do co like hay k  => bo like / them like
   */
// pull keo ra
// push them vao

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyDislike = blog?.dislikes.find((el) => el.toString() === _id);
  if (alreadyDislike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isLiked = blog?.likes.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyliked = blog?.likes.find((el) => el.toString() === _id);
  if (alreadyliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
  const isDisliked = blog?.dislikes.find((el) => el.toString() === _id);
  if (isDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      rs: response,
    });
  }
});
const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberView: 1 } },
    { new: true }
  )
    .populate("likes", "firstName lastName")
    .populate("dislikes", "firstName lastName");
  return res.json({
    success: blog ? true : false,
    rs: blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(
    bid
  )
  return res.json({
    success: blog ? true : false,
    deleteBlog: blog || 'Something went wrong',
  });
});

const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("Missing inputs");
  const response = await Blog.findByIdAndUpdate(
    bid,
    {image: req.file.path},
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedBlog: response ? response : "Cannot upload images blog",
  });
});
module.exports = {
  createNewBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  uploadImagesBlog
};
