import React, { useState } from "react";
import { Button } from "../../components";
import { useParams } from "react-router-dom";
import { apiResetPassword } from "../../apis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setpassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });
    if (response.success) {
      toast.success(response.mes);
      navigate("/login");
    } else {
      toast.info(response.mes);
    }
  };

  return (
    <div className="absolute top-0 animate-shadow-pop-tr left-0  bottom-0 items-center flex-col right-0 bg-white flex  py-8 z-50">
      <div className="flex flex-col gap-4">
        <label htmlFor="password">Enter your new password</label>
        <input
          type="text"
          id="password"
          className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
          placeholder="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <div className="flex items-center justify-end w-full gap-4">
          <Button
            name="Submit"
            style="px-4 py-2 rounded-md text-white bg-orange-500 my-2 text-semibold"
            handleOnclick={handleResetPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
