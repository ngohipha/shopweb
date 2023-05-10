import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { apiRegister, apiLogin } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate , useLocation } from "react-router-dom";
import path from "../../ultils/path";
import { register } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const location = useLocation();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
    });
  };
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    if (isRegister) {
      const response = await apiRegister(payload);
      if (response.success) {
        Swal.fire("Congratulations", response.mes, "success").then(() => {
          setIsRegister(false);
          resetPayload();
        });
      } else {
        Swal.fire("Oop!", response.mes, "error");
      }
    } else {
      const rs = await apiLogin(data);
      if (rs.success) {
        dispath(
          register({
            isLoggedIn: true,
            token: rs.accessToken,
            userData: rs.userData,
          })
        );
        navigate(`/${path.HOME}`);
      } else {
        Swal.fire("Oop!", rs.mes, "error");
      }
    }
  }, [payload, isRegister]);
  return (
    <div className="w-screen h-screen relative">
      <img
        src="https://kiddy.edu.vn/wp-content/uploads/2023/05/Hinh-nen-Songoku-4K-2K-cho-dien-thoai-may-tinh.jpg"
        alt=""
        className="w-full h-full object-cover"
      />

      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] ">
          <h1 className="text-[28px] font-semibold text-main mb-8">
            {isRegister ? "Register" : "Login"}
          </h1>

          {isRegister && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.firstName}
                setValue={setPayload}
                nameKey="firstName"
              />
              <InputField
                value={payload.lastName}
                setValue={setPayload}
                nameKey="lastName"
              />
              <InputField
                value={payload.mobile}
                setValue={setPayload}
                nameKey="mobile"
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
          />

          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            type="password"
          />
          <Button
            name={isRegister ? "Register" : "Login"}
            handleOnclick={handleSubmit}
          />
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister && (
              <span className="text-blue-500 hover:underline cursor-pointer">
                Forgot your account?
              </span>
            )}
            {!isRegister && (
              <span
                onClick={() => setIsRegister(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Create account
              </span>
            )}
            {isRegister && (
              <span
                onClick={() => setIsRegister(false)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Go Login
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
