import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import './Card.css'
import { BsCartFill, BsHeartFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, addFav, deleteFavs, deleteItemCart, getCart } from '../../Redux/Actions/actions.js';
// import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../context/AuthContext';



const Card = ({ image, price, name, description, id, stock }) => {

  const { user } = useAuth();
  const users = useSelector(state => state?.users);
  const findUser = users?.find(us => us?.email === user?.email)

  const favourites = useSelector(state => state.favourites)
  const productsCart = useSelector(state => state.shopCart)

  const dispatch = useDispatch();
  const existFavs = favourites?.map(fav => fav?.id)
  // const stockProducts = productsCart?.map(prod => prod?.stock)
  const existProductsCart = productsCart?.map(prod => prod?.id)

  const handleFav = (id) => {
    !existFavs.includes(id) ?
      dispatch(addFav(findUser?.id, { userId: findUser?.id, productId: id })) :
      dispatch(deleteFavs({ userId: findUser?.id, productId: id }))
  };

//add && dispatch(getCart(findUser?.id))
//delete && dispatch(getCart(findUser?.id))

  const handleCart = (id) => {
    !existProductsCart.includes(id) ?
      dispatch(addCart({ userid: findUser?.id, idproduct: id, quantity: 1 }))  :
      dispatch(deleteItemCart({ userid: findUser?.id, idproduct: id })) 
  };



  return (
    <div className='cards'>


      <div className='img-icons'>
        <Link to={`/detail/${id}`}>
          <img src={image} alt='*' />
        </Link>
      </div>


        <div className='icons'>
          

          { 
            user ? existFavs.includes(id) ? <BsHeartFill color='red' className='icons-fav' onClick={()=>{handleFav(id)}}/>
            : <BsHeartFill className='icons-fav' onClick={()=>{handleFav(id)}}/> :
            <div></div>
          }     
       
          { 
            user ? stock <= 0 ? "Stocked out" :
            existProductsCart.includes(id) ? <BsCartFill color='green' className='icons-cart' onClick={()=>{handleCart(id)}}/> : 
            <BsCartFill className='icons-cart' onClick={()=>{handleCart(id)}}/> :
            <div></div>
          } 
          
                   
        </div>




      <div className='info'>
        <span>{name}</span>
        <h4>US$ {price}</h4>
      </div>




      {/* <h3>{description}</h3> */}

    </div>
  )
};

export default Card


