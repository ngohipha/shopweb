import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import path from "../../ultils/path";
import Swal from "sweetalert2";
const FinalRegister = () => {
  const { status } = useParams();
  const navigate = useNavigate()
  useEffect (()=>{
    if (status === 'failed') Swal.fire('Oop!','Đăng Ký Không Thành Công ','error').then(()=>{
        navigate(`/${path.LOGIN}`)
    })
    if (status === 'success') Swal.fire('Congratudition!','Đăng Ký  Thành Công ','success').then(()=>{
        navigate(`/${path.LOGIN}`)
    })
  })
  return (
    <div className="h-screen w-screen bg-gray-100">

    </div>
  )
};

export default FinalRegister;
