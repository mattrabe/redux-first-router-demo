import React from 'react'
import { connect } from 'react-redux'
import Link, { NavLink } from 'redux-first-router-link'
import { goToPage } from '../actions'
import styles from '../css/Menu'

const Menu = ({ onClick, path }) => (
  <div className={styles.menu}>
    <NavLink activeClassName={styles.active} exact to='/'>
      Home
    </NavLink>
    <NavLink activeClassName={styles.active} to='/solutions'>
      Solutions
    </NavLink>
    <NavLink activeClassName={styles.active} to='/about'>
      About
    </NavLink>
    <NavLink activeClassName={styles.active} to='/asdfasdf'>
      404
    </NavLink>
  </div>
)

const active = (currentPath, path) =>
  currentPath === path ? styles.active : ''

const mapDispatch = { onClick: goToPage }
const mapState = ({ location }) => ({ path: location.pathname })

export default connect(mapState, mapDispatch)(Menu)
