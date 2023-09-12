import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import 'react-multi-carousel/lib/styles.css';
// import icono1 from "../../image/imgCarrusel/logo1.png";
import "./ProductList.css";
import { getAllProducts, getCart, getFavs, getUser } from '../../Redux/Actions/actions';
import ContainerCards from '../Cards/ContainerCards';
import { Searchbar } from '../Searchbar/Searchbar';
// import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../context/AuthContext';


const ProductList = () => {
  
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch()
  const products = useSelector((state) => state.allProducts)
  
  const {user} = useAuth();
  const users = useSelector(state=> state?.users);
  const findUser = users > 0 ? users?.find(us => us?.email === user?.email) : []

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    dispatch(getAllProducts());
    dispatch(getCart(findUser?.id));
    dispatch(getUser());
    dispatch(getFavs(findUser?.id));
    return () => clearTimeout(timer);
  },[dispatch])

  return (
    <div className='background'>   
            <h1 className='name_prod'>Products</h1>

    <div className='container_all'>

      
    <Searchbar/>
      

      {isLoading ? <div className="loader"></div> :
       <ContainerCards 
      products={products}/>}
    </div>

    </div>
  )
}

export default ProductList
