const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../ultils/sendmail");
const crypto = require("crypto");
const { truncate } = require("fs/promises");
const makeToken = require("uniqid");
const ms = require("ms");

//register co dien
// const register = asyncHandler(async (req, res) => {
//   const { email, password, firstName, lastName } = req.body;
//   if (!email || !password || !firstName || !lastName)
//     return res.status(400).json({
//       success: false,
//       mes: "Missing inputs",
//     });
//   const user = await User.findOne({ email });
//   if (user) throw new Error("User has existed!");
//   else {
//     const newUser = await User.create(req.body);
//     return res.status(200).json({
//       success: newUser ? true : false,
//       mes: newUser
//         ? "Register is successfully. Please go login"
//         : "Something went wrong",
//     });
//   }
// });

// register xac thuc mail
// const register = asyncHandler(async (req, res) => {
//   const { email, password, firstName, lastName, mobile } = req.body;
//   if (!email || !password || !firstName || !lastName || !mobile)
//     return res.status(400).json({
//       success: false,
//       mes: "Missing inputs",
//     });
//   const user = await User.findOne({ email });
//   if (user) throw new Error("User has existed!");
//   else {
//     const token = makeToken();
//     res.cookie(
//       "dataregister",
//       { ...req.body, token },
//       {
//         httpOnly: true,
//         maxAge: 15 * 60 * 1000,
//       }
//     );
//     const html = `Xin vui long click vao link duoi day de xac thuc mat khau.Link nay se het han sau 15p<a href=${process.env.URL_SERVER}/api/user/finalregister/${token} > Clik here</a> `;
//     await sendMail({ email, html, subject: "Xác Thực Mail" });
//     return res.json({
//       success: true,
//       mes: "Please check your email to active account",
//     });
//   }
// });
// k xac thuc tu dong xoa khoi data sau 16p
setInterval(async () => {
  const now = new Date().getTime();
  await User.deleteMany({
    registrationExpiration: { $lt: now },
  });
}, 16 * 60 * 1000); // Xóa các tài khoản quá hạn mỗi giờ (3600000 ms)

// Route đăng ký tài khoản
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, mobile } = req.body;
  if (!email || !password || !firstName || !lastName || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }
  if (!email.includes("@") || !email.endsWith(".com")) {
    return res.status(400).json({
      success: false,
      mes: "Invalid email format",
    });
  }

  if (password.length < 6 || password.length > 12) {
    return res.status(400).json({
      success: false,
      mes: "Password must be between 6 and 12 characters",
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User has existed!");
  } else {
    const token = makeToken();
    const now = new Date();
    const expiration = now.getTime() + 15 * 60 * 1000;
    await User.create({
      email,
      password,
      firstName,
      lastName,
      mobile,
      registrationToken: token,
      registrationExpiration: expiration,
    });
    const html = `Xin vui lòng click vào link dưới đây để xác thực tài khoản. Link này sẽ hết hạn sau 15 phút: <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`;
    await sendMail({ email, html, subject: "Xác Thực Mail" });
    return res.json({
      success: true,
      mes: "Please check your email to activate your account",
    });
  }
});

// Route xác thực tài khoản
const finalRegister = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const now = new Date();

  const user = await User.findOne({
    registrationToken: token,
    registrationExpiration: { $gt: now.getTime() },
  });

  if (!user) {
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  }

  // const newUser = await User.create({
  //   email: user.email,
  //   password: user.password,
  //   mobile: user.mobile,
  //   firstName: user.firstName,
  //   lastName: user.lastName,
  // });

  if (user) {
    user.registrationToken = undefined;
    user.registrationExpiration = undefined;
    // await User.deleteMany({
    //   registrationToken: { registrationToken: null },
    // });
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  } else {
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  }
});

//luu tren cookie
// const finalRegister = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   const { token } = req.params;
//   if (!cookie || cookie?.dataregister?.token !== token) {
//     res.clearCookie("dataregister");
//     return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
//   }

//   const newUser = await User.create({
//     email: cookie?.dataregister?.email,
//     password: cookie?.dataregister?.password,
//     mobile: cookie?.dataregister?.mobile,
//     firstName: cookie?.dataregister?.firstName,
//     lastName: cookie?.dataregister?.lastName,
//   });
//   res.clearCookie("dataregister");
//   if (newUser)
//     return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
//   else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
// });
// refresh token => cap moi access token
// access token => xac thuc ng dung , phan quyen nguoi dung
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // tach password va role ra khoi respone
    const { password, role, refreshToken, ...userData } = response.toObject();
    // tao access token
    const accessToken = generateAccessToken(response._id, role);
    // tao refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    //luu refresh token vao data base
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    //luu refresh token vao cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found ",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //lay token tu cookie
  const cookie = req.cookies;
  // check xem co token hay k
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //chekc token co hop le hay k
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  // check xem token co khop voi token da luu trog db

  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //xoas refresh token o db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //xoa refresh token o cookie trinh duyet
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.status(200).json({
    success: true,
    mes: "Logout",
  });
});

// reset pasword
//server check email co hop le k => gui mail + kem theo link
// client check mail => click link
// client gui api kem theo token
// check token co giong voi token ma email gui hay k
// change pass

const forgotpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Xin vui long click vao link duoi day de thay doi mat khau.Link nay se het han sau 15p<a href=${process.env.CLIENT_URL}/reset-password/${resetToken} > Clik here</a> `;
  const data = {
    email,
    html,
    subject: "Forgot password",
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: rs.response?.includes("OK") ? true : false,
    mes: rs.response?.includes("OK")
      ? "Hãy check mail của bạn "
      : "Mail đã có lỗi hãy thử lại sau ",
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!password || !token) throw new Error("Missing imputs");
  const passwordRestToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordRestToken,
    passwordRestExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordRestToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordRestExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Update password" : "Something went wrong",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});
const deleteUsers = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing imputs");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} delete`
      : "No user delete",
  });
});
const updateUsers = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing imputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    updateUsers: response ? response : "Some thing went wrong",
  });
});

const updateUsersByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing imputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updateUsers: response ? response : "Some thing went wrong",
  });
});
const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing imputs");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    {
      new: true,
    }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updateUserAddress: response ? response : "Some thing went wrong",
  });
});
const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    const index = user.cart.findIndex(
      (el) => el.product.toString() === pid && el.color === color
    );
    if (index !== -1) {
      user.cart[index].quantity = quantity;
    } else {
      user.cart.push({ product: pid, quantity, color });
    }
    const response = await user.save();
    return res.status(200).json({
      success: response ? true : false,
      updateCart: response ? response : "Something went wrong",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updateCart: response ? response : "Something went wrong",
    });
  }
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotpassword,
  resetPassword,
  getUsers,
  deleteUsers,
  updateUsers,
  updateUsersByAdmin,
  updateUserAddress,
  updateCart,
  finalRegister,
};
