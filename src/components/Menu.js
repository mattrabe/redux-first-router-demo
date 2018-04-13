import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'redux-first-router-link'

import { goToPage } from '../actions'
import styles from '../css/Menu'

const Menu = ({ pages, posts }) => (
  <div className={styles.menu}>
    <NavLink activeClassName={styles.active} exact to='/'>
      Home
    </NavLink>
    {pages
      ? Object.keys(pages).map(index => (
        <NavLink
          key={`page-${index}`}
          activeClassName={styles.active}
          to={`/${pages[index].slug}`}
        >
          {pages[index].title.rendered}
        </NavLink>
        ))
      : null}
    {pages
      ? Object.keys(pages).map(index => (
        <NavLink
          key={`portal-${index}`}
          activeClassName={styles.active}
          to={`/portal/${pages[index].slug}`}
        >
            P: {pages[index].title.rendered}
        </NavLink>
        ))
      : null}
    {posts
      ? Object.keys(posts).map(index => (
        <NavLink
          key={`post-${index}`}
          activeClassName={styles.active}
          to={`/posts/${posts[index].slug}`}
        >
          {posts[index].title.rendered}
        </NavLink>
        ))
      : null}
    <NavLink activeClassName={styles.active} to='/asdfasdf'>
      Dyn 404
    </NavLink>
    <NavLink activeClassName={styles.active} to='/login'>
      Login
    </NavLink>
  </div>
)

const active = (currentPath, path) =>
  currentPath === path ? styles.active : ''

const mapDispatch = { onClick: goToPage }
const mapState = ({ location }) => ({ path: location.pathname })

export default connect(mapState, mapDispatch)(Menu)
