import React ,{useState}from "react";
import { formatMoney } from "../ultils/helpers";
import label from "../assets/label.png";
import labelBlue from "../assets/blue.png";
import { renderStarFromNumber } from "../ultils/helpers";
import { SelectOption } from "./";
import icons from "../ultils/icon";

const { BsFillSuitHeartFill, AiFillEye, AiOutlineMenu } = icons;
const Product = ({ productData, isNew }) => {
  const [isShowOption , setIsShowOption] = useState(false)
  return (
    <div className="w-full text-base  px-[10px] ">
      <div className="w-full border p-[15px] flex flex-col items-center " onMouseEnter={e => {
       setIsShowOption(true)
      }}
       onMouseLeave={e => {
         setIsShowOption(false)
      }}>
        <div className="w-full relative">
          {
            isShowOption && <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
            <SelectOption icon={<AiFillEye />} />
            <SelectOption icon={<AiOutlineMenu />} />
            <SelectOption icon={<BsFillSuitHeartFill />} />
          </div>

          }
          <img
            src={
              productData?.thumb ||
              "data:image/png;base64,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"
            }
            alt=""
            className="w-[274px] h-[274px] object-cover "
          />
          <img
            src={isNew ? label : labelBlue}
            alt=""
            className={`absolute w-[70px] top-[-15px] left-[-10px] object-contain h-[50px] `}
          />     
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)}
          </span>

          <span className="line-clamp-1">{productData?.title}</span>

          <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  );
};
export default Product;
