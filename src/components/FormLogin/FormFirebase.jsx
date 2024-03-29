import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Google } from "@mui/icons-material";
import { useAuth } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, loginUser, newUser } from '../../Redux/Actions/actions';
import './FormFirebase.modules.css';

const FormFirebase = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const user = auth.user;
  const usuario = useSelector((state) => state.users);
  const oneUserCreated = useSelector((state) => state.user);


  // Para el registro
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');

  // Para el inicio de sesión
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    verified: true,
    role: 'customer',
  });

  useEffect(() => {
    // Evitar llamar a setUserInfor demasiado a menudo en el efecto
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      name: user?.displayName || prevUserInfo.name,
      email: user?.email || emailRegister || prevUserInfo.email,
    }));
    dispatch(getUser());
  }, [user, emailRegister, dispatch]);

  async function handleRegister(e) {
    e.preventDefault();
    const validRegister = usuario?.filter((usr) => usr.email === emailRegister);
    if (validRegister?.length > 0) {
      return toast.warn('Usuario existente');
    }

    await auth.register(emailRegister, passwordRegister);
    dispatch(newUser(userInfo));
    toast.success('Usuario registrado correctamente');
    window.location = '/home';
  }

  async function handleLogin(e) {
    e.preventDefault();
    const validLogin = usuario?.filter((usr) => usr.email === email);
    const matchEmail = validLogin?.find((usr) => usr.email === email);

    if (matchEmail?.email) {
      const respLogin = await auth.login(email, password);

      if (respLogin !== false) {
        dispatch(getUser());
        window.location.href = '/home';
      }
    }
    else toast.error('Usuario o contraseña incorrectos');
  };

  async function handleGoogle(e) {
    e.preventDefault();
    const respGoogle = await auth.loginWithGoogle();
    dispatch(getUser());

    if (respGoogle.operationType === 'signIn') {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        name: respGoogle.user.displayName,
        email: respGoogle.user.email,
      }));
      redirectLogin(respGoogle.user);
    }
  }

  function redirectLogin(userGoogle) {
    const matchGoogleEmail = usuario?.find((usr) => usr.email === userGoogle.email);

    if (matchGoogleEmail?.email) {
      window.location.href = '/home';
    } else {
      dispatch(
        newUser({
          ...userInfo,
          name: userGoogle.displayName,
          email: userGoogle.email,
        })
        );
      dispatch(getUser());

      if (oneUserCreated.email) {
        window.location.href = '/home';
        toast.success('Usuario registrado correctamente');
      }
    }
  }

  function handleOnChange(e) {
    e.preventDefault();
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [e.target.name]: e.target.value,
      verified: true,
      role: 'customer',
    }));
  }

  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  };

  const toggleRegisterForm = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  return (
    <div className="form-login-container">
          {/* ===================Register================== */}
      <div className={showRegisterForm ? "show-register-form" : "form-register"}>
        {/* <div className="form-register"> */}
        <form>
          <h3 className="tittle-h3">Register</h3>
          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label">
              Full name:
            </label>
            <input
              type="text"
              className="form-control"
              id="nameInput"
              value={userInfo.name}
              onChange={handleOnChange}
              placeholder={user?.displayName}
              name="name"
            />
            <div className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="emailRegisterInput" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="emailRegisterInput"
              aria-describedby="emailHelp"
              onChange={(e) => {
                setEmailRegister(e.target.value);
                setUserInfo((prevUserInfo) => ({ ...prevUserInfo, email: e.target.value }));
              }}
            />
            <div className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordRegisterInput" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="passwordRegisterInput"
              onChange={(e) => setPasswordRegister(e.target.value)}
            />
          </div>
          <div className="mb-3 form-check"></div>
          <div className="btns-reg-log">
            <button type="submit" className="btn-submit" onClick={handleRegister}>
              Submit
            </button>
            <button className="btn-submit" onClick={handleGoogle}>
              {<Google/>}
            </button>
          </div>
        </form>
      {/* </div> */}
      </div>
      

      {/* ===============Login====================== */}
      <div className={showLoginForm ? "show-login-form" : "form-login"}>
        {/* <div className="form-login"> */}
        <form>
          <h3 className="tittle-h3">Login</h3>
          <div className="mb-3">
            <label htmlFor="emailLoginInput" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="emailLoginInput"
              aria-describedby="emailHelp"
              onChange={(e) => {
                setEmail(e.target.value);
                setUserInfo((prevUserInfo) => ({ ...prevUserInfo, email: e.target.value }));
              }}
            />
            <div className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordLoginInput" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="passwordLoginInput"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3 form-check"></div>
          <div className="btns-reg-log">
            <button type="submit" className="btn-submit" onClick={handleLogin}>
              Submit
            </button>
            <button className="btn-submit" onClick={handleGoogle}>
            {<Google/>}
            </button>
          </div>
        </form>
      {/* </div> */}
      </div>
      <div className="btns-reg-log">
        <button className="btn-submit" onClick={toggleRegisterForm}>
          Register
        </button>
        <button className="btn-submit" onClick={toggleLoginForm}>
          Login
        </button>
        <ToastContainer
        position="top-center"
        closeOnClick
        />
      </div>
    </div>
  );
};

export default FormFirebase;



















// import React, { useEffect, useState } from 'react';
// import { useAuth } from "../../context/AuthContext";
// import { useDispatch, useSelector } from 'react-redux';
// import { getUser, loginUser, newUser } from '../../Redux/Actions/actions';
// import "./FormFirebase.modules.css"

// const FormFirebase = () => {
//   const auth = useAuth();

//   const dispatch = useDispatch();
//   const user = auth.user;
//   const usuario = useSelector(state => state.users);
//   const oneUserCreated = useSelector(state => state.user);
//   // const filteredUser = usuario?.length > 0 ? usuario?.filter(usr => usr.email === user?.email) : [];
//   const [nombreToDB, setNombreToDB] = useState("");
//   const [emailToDB, setEmailToDB] = useState("");

// //Para el register
// const [emailRegister, setEmailRegister] = useState("");
// const [passwordRegister, setPasswordRegister] = useState("");
// const validRegister = usuario?.filter(usr => usr.email === emailRegister);
// //Para el login
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const validLogin = usuario?.filter(usr => usr.email === email);

//   // const infoLogin = {email: email, password: password}

//   const [userInfo, setUserInfo] = useState({
//     name: "",
//     email: "",
//     password: "",
//     address: "",
//     verified: true,
//     role: "customer"
// });

// useEffect(() => {
//   setNombreToDB(user?.displayName)
//   setEmailToDB(user?.email)
//   setUserInfo({
//     name: nombreToDB || userInfo.name,
//     email: emailToDB || emailRegister || userInfo.email,
//     password: passwordRegister,
//     address: "",
//     verified: true,
//     role: "customer"
//   })
//   dispatch(getUser())

// }, [user?.displayName, user?.email, emailToDB, nombreToDB, userInfo.name, emailRegister, dispatch, userInfo.email, passwordRegister]);


// async function handleRegister(e) {
//     e.preventDefault();
//     if (validRegister?.length > 0) {
//       return alert("Usuario existente")
//     }
//     await auth.register(emailRegister, passwordRegister);
    
//     dispatch(newUser(userInfo));
//     dispatch(getUser());
//     alert("Usuario registrado correctamente");
//     window.location = "/home";
//   };
  
//   async function handleLogin(e) {
//     e.preventDefault();
//     const matchEmail = usuario?.find(usr => usr.email === email)
//     if(matchEmail?.email){
//       const respLogin = await auth.login(email, password);

//       if (respLogin && validLogin?.length > 0) {
//         dispatch(getUser());
//         return window.location.href = "/home"
//       } 
//     }
//     return alert('Usuario o contraseña incorrectos')      
//   };
  
//   async function handleGoogle(e) {
//     e.preventDefault();
//     const respGoogle = await auth.loginWithGoogle();
//     dispatch(getUser());
//       if(respGoogle.operationType === "signIn") {
//         setUserInfo({...userInfo, name: respGoogle.user.displayName, email: respGoogle.user.email});
//         redirectLogin(respGoogle.user);
//       };
//   };
  
  
//   function redirectLogin (userGoogle){
    
//    const matchGoogleEmail = usuario?.find(usr => usr.email === userGoogle.email)
//     if (matchGoogleEmail?.email) {

//       window.location.href = "/home"
//     } else {
//       dispatch(newUser({...userInfo, name: userGoogle.displayName, email: userGoogle.email}));
      
//       if (oneUserCreated) {
//         dispatch(getUser());
//         window.location.href = "/home"
        
//       }
//     }
//   };
  
  
//   function handleOnChange(e) {
//     e.preventDefault()
//     setUserInfo({
//       ...userInfo,
//       [e.target.name]: e.target.value,
//       verified: true,
//       role: "customer"
//     })
//   };

//   return (
//     <div className='form-login-container'>
//       <div className='form-register'>
//     <form>
//       {/* ===================Register================== */}
//       <h3 className='tittle-h3'>Register</h3>
//   <div class="mb-3">
//     <label for="exampleInputEmail1" class="form-label">Full name:</label>
//     <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={userInfo.name} onChange={handleOnChange} placeholder={nombreToDB} name="name"/>
//     <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
//   </div>
//   <div class="mb-3">
//     <label for="exampleInputEmail1" class="form-label">Email address</label>
//     <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e)=> {setEmailRegister(e.target.value); setUserInfo({...userInfo, email:e.target.value})}}/>
//     <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
//   </div>
//   <div class="mb-3">
//     <label for="exampleInputPassword1" class="form-label">Password</label>
//     <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e)=> setPasswordRegister(e.target.value)}/>
//   </div>
//   <div class="mb-3 form-check">
//   </div>
//   <div className='btns-reg-log'>
//   <button type="submit" className="btn-submit" onClick={(e)=>handleRegister(e)}>Submit</button>
//   <button className="btn-submit" onClick={(e)=>handleGoogle(e)}>Google</button>
//   </div>

//   </form>
//   </div>

//     {/* ===============Login====================== */}
//     <div className='form-login'>
//     <form>
//     <h3 className='tittle-h3'>Login</h3>
//   <div class="mb-3">
//     <label for="exampleInputEmail1" class="form-label">Email address</label>
//     <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e)=> {setEmail(e.target.value); setUserInfo({...userInfo, email:e.target.value})}}/>
//     <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
//   </div>
//   <div class="mb-3">
//     <label for="exampleInputPassword1" class="form-label">Password</label>
//     <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e)=> setPassword(e.target.value)}/>
//   </div>
//   <div class="mb-3 form-check">
//   </div>
//   <div className='btns-reg-log'>
//   <button type="submit" className="btn-submit" onClick={(e)=>handleLogin(e)}>Submit</button>
//   <button className="btn-submit" onClick={(e)=>handleGoogle(e)}>Google</button>
//   </div>
//   </form>
//   </div>

// </div>
//   )
// };

// export default FormFirebase;