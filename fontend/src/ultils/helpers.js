import icons from './icon';
const {AiFillStar, AiOutlineStar} = icons

export const createSlug = (text) => {
    return text
      .normalize('NFKD') // use NFKD normalization form
      .replace(/[^\w\s-]/g, '') // remove non-word and non-space characters
      .toLowerCase()
      .trim()
      .replace(/[\s_-]+/g, '-'); // replace spaces and dashes with a single dash
  };

  export const formatMoney = number => Number(number.toFixed(1)).toLocaleString()

  export const renderStarFromNumber = (number) =>{
    if(!Number(number)) return
    //4 => [1,1,1,1,0]
    const stars = []
    for(let i = 0 ; i< +number ;  i ++)stars.push(<AiFillStar color='orange'/>)
    for(let i = 5 ; i> +number ;  i --)stars.push(<AiOutlineStar color='orange'/>)

    return stars
  }