import React from 'react'
import { useState } from 'react'
import { publicRequest } from '../../requestMethods'
import './login.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../../redux/userRedux';
import { Navigate, useNavigate } from 'react-router-dom';
const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate("");
  const [emailid, setEmailid] = useState()
  const [password, setPassword] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState()
  useEffect(() => {
    console.log("1");
    if (errorMessage != "") {

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }


  }, [errorMessage])
  useEffect(() => {
    if (successMessage != "") {

      toast.success(successMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: true,
        theme: "colored",
        // transition:"zoom",

      });
    }


  }, [successMessage])


  const handleLogin = async () => {

    try {
      const res = await publicRequest.post('/auth/login', { email: emailid, password: password }, {
        withCredentials: true // Send cookies with the request
      })
      if (res.data.isAdmin) {
          const response =  dispatch(loginSuccess({ email: res.data.email, isAdmin: res.data.isAdmin, _id: res.data._id }))
        if (response.status === "error") {
          setErrorMessage("Error is dispatch")
        } else {
          console.log("Dispatch done");
          navigate ({
            pathname:'/',
          })
        }
      } else {
        setErrorMessage("You're not admin")
      }
      console.log(res.data);
    } catch (error) {
      setErrorMessage(error.message)
      console.log(error);
    }

  }

  return (
    <div className="loginPage">
      <ToastContainer />
      <div className="left">
        <div className="container">
          <div className="items">
            <h2>Get Started</h2>
          </div>
          <div className="items">

            <input type="text" placeholder='EMail ID' value={emailid}
              onChange={(e) => setEmailid(e.target.value)} />
          </div>
          <div className="items">

            <input type="password" placeholder='Password' value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="itemsAction">
            <span>Forget Password</span>
            <button onClick={handleLogin}>SIGN IN</button>
          </div>

        </div>

      </div>
      <div className="right">
        <div className="element">
          <h2>
            WELCOME TO
          </h2>
        </div>
        <div className="element">
          <img src="./Images/Pulze.png" alt="" />
          <h2>Pulze</h2>
        </div>
        <div className="element">
          <span>Unleash the Pulse of Administration</span>
        </div>

      </div>

    </div>
  )
}

export default Login