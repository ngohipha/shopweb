import icons from "./icon";
const { AiFillStar, AiOutlineStar } = icons;

export const createSlug = (text) => {
  return text
    .normalize("NFKD") // use NFKD normalization form
    .replace(/[^\w\s-]/g, "") // remove non-word and non-space characters
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "-"); // replace spaces and dashes with a single dash
};

export const formatMoney = (number) => {
  if (typeof number === "undefined" || number === null) {
    return "";
  }
  return Number(number.toFixed(1)).toLocaleString();
};
export const renderStarFromNumber = (number, size) => {
  if (!Number(number)) return;
  //4 => [1,1,1,1,0]
  const stars = [];
  for (let i = 0; i < +number; i++) stars.push(<AiFillStar color="orange" size={size || 16} />);
  for (let i = 5; i > +number; i--)
    stars.push(<AiOutlineStar color="orange" size={size || 16} />);

  return stars;
};
