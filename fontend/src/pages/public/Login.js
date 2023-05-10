import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { apiRegister, apiLogin, apiForgotPassword } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import { register } from "../../store/user/userSlice";
import { useDispatch } from "react-redux";
import {toast} from 'react-toastify'

const Login = () => {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [isForgotPassWord, setisForgotPassWord] = useState(false);
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
  const [email, setEmail] = useState("");
  // const handleEmailChange = (event) => {
  //   setEmail(event.target.value);
  // }
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if(response.success){
      setisForgotPassWord(false)
      toast.success(response.mes)
    }else toast.info(response.mes)
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
      {isForgotPassWord && (
        <div className="absolute top-0 animate-shadow-pop-tr left-0  bottom-0 items-center flex-col right-0 bg-overlay flex  py-8 z-50">
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Enter your email</label>
            <input
              type="text"
              id="email"
              className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
              placeholder="Exp:email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-center justify-end w-full gap-4">
              <Button
                name="Submit"
                style="px-4 py-2 rounded-md text-white bg-orange-500 my-2 text-semibold"
                handleOnclick={handleForgotPassword}
              />
              <Button
                name="Back"
                handleOnclick={() => setisForgotPassWord(false)}
              />
            </div>
          </div>
        </div>
      )}
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
          <div className="flex items-center  justify-between my-2 w-full text-sm">
            {!isRegister && (
              <span
                onClick={() => setisForgotPassWord(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
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
