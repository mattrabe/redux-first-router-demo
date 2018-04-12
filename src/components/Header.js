import React from 'react'
import { connect } from 'react-redux'

import Menu from './Menu'
import LoginForm from './LoginForm'

import styles from '../css/Header'

const Header = ({
  posts, pages, user, attemptLogin, logoutUser
}) => (
  <div className={styles.header}>
    <Menu posts={posts} pages={pages} />
    <div style={{ float: 'right' }}>
      <LoginForm
        user={user}
        attemptLogin={attemptLogin}
        logoutUser={logoutUser}
      />
    </div>
  </div>
)

const mapState = () => ({})

export default connect(mapState)(Header)
