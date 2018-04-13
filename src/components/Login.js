import React from 'react'

import { Config } from '../../config'
import styles from '../css/Home'
import LoginForm from './LoginForm'

const Login = ({ user, attemptLogin, logoutUser }) => (
  <div className={styles.home}>
    <h1>Login</h1>

    <LoginForm
      user={user}
      attemptLogin={attemptLogin}
      logoutUser={logoutUser}
    />
  </div>
)

export default Login
