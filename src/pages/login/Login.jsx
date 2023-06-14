import React from 'react'
import { useState } from 'react'
import './login.scss'
const Login = () => {

  const [emailid, setEmailid] = useState()
  const [password, setPassword] = useState()
  return (
    <div className="loginPage">
      <div className="left">
        <div className="container">
          <div className="items">
            <h2>Get Started</h2>
          </div>
          <div className="items">

            <input type="text" placeholder='EMail ID'/>
          </div>
          <div className="items">

            <input type="text" placeholder='Password' />
          </div>
          <div className="itemsAction">
            <span>Forget Password</span>
            <button>SIGN IN</button>
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