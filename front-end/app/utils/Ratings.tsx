import React,{FC} from 'react'

type Props = {
    rating: number;
}

const Ratings:FC<Props> = ({rating}) => {
  return (
    <div>Ratings</div>
  )
}

export default Ratings