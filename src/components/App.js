import React from 'react'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie'

import { attemptLogin } from '../utils'
import Switcher from './Switcher'
import Header from './Header'

import styles from '../css/App'

const cookies = new Cookies()

class App extends React.Component {
  state = {
    user: null
  }

  componentWillMount() {}

  attemptLogin = (username, password) => {
    attemptLogin(username, password).then(user => this.setUser(user))
  }

  logoutUser = () => {
    /*
    this.setState({
      user: {
        ...this.state.user,
        loading: true
      }
    })

    // Revoke token
    fetch(
      `${Config.apiUrl}/wp-json/simple-jwt-authentication/v1/token/revoke`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: `token=${encodeURIComponent(this.state.user.token)}`
      }
    )
      .then(resp => resp.json())
      .then(resp => {
/*
This seems to return false - not sure if that's expected. Moving on...
      if (resp) {
        // Wipe app user data
        this.setUser(null);
      }else{
        // Handle failed attempt
        if (resp.message) {
          alert(resp.message);
        }else{
          alert('Unable to log you out. Unknown error.');
        }
      }

Temporary workaround (just go ahead and forget cookie) until revoke endpoint response is understood:

        // Wipe app user data
        this.setUser(null)
      })
*/
  }

  setUser = user => {
    // Update cookie (persists session)
    if (user) {
      // Save token to cookie, expire in 7 days
      cookies.set('token', user.token, { path: '/' })
      cookies.set('jwToken', user.token, { path: '/' })
      cookies.set('user_id', user.id, { path: '/' })
    }
    else {
      // Remove token cookie
      cookies.remove('token')
      cookies.remove('jwToken')
      cookies.remove('user_id')
    }

    // Update state (trickles down to other components)
    this.setState({
      user: user
        ? {
          ...user,
          loading: false
        }
        : null
    })
  }

  render() {
    const maskClass = this.props.maskClass || ''
    const componentClass = this.props.componentClass || ''

    return (
      <div>
        <Header
          user={this.state.user}
          attemptLogin={this.attemptLogin}
          logoutUser={this.logoutUser}
          pages={this.props.allPages}
        />

        <div className={`${styles.content}`}>
          <h1>ABB</h1>
          <Switcher
            showMask={this.showMask}
            hideMask={this.hideMask}
            user={this.props.currentUser}
            attemptLogin={this.attemptLogin}
            logoutUser={this.logoutUser}
            componentClass={componentClass}
          />
        </div>

        <div className={`mask ${maskClass}`} />
      </div>
    )
  }
}

const mapState = state => {
  const maskClass = state.transition.maskClass || ''
  const componentClass = state.transition.componentClass || ''
  const pageSlug = state.transition.pageSlug || ''
  const allPages = state.global.allPages || []
  const currentUser = state.global.currentUser || null

  return {
    isLoading: false,
    allPages,
    maskClass,
    componentClass,
    pageSlug,
    currentUser
  }
}

export default connect(mapState)(App)
