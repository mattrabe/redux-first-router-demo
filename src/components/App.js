import React from 'react'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie'
import fetch from 'isomorphic-unfetch'

import { Config } from '../../config'
import Switcher from './Switcher'
import Header from './Header'

import styles from '../css/App'

const cookies = new Cookies()

class App extends React.Component {
  state = {
    user: null,
    maskClass: '',
    posts: [],
    pages: []
  }

  componentWillMount() {
    // Check for existing login state
    const token = cookies.get('token')
    const user_id = cookies.get('user_id')
    if (token && user_id && !this.state.user) {
      // Indicate loading state
      this.setState({
        user: {
          loading: true
        }
      })
      fetch(`${Config.apiUrl}/wp-json/wp/v2/users/${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        }
      })
        .then(resp => resp.json())
        .then(resp => {
          if (resp && resp.id) {
            // Token worked, update app user data
            this.setUser({
              token,
              id: resp.id,
              display_name: resp.name
            })
          }
          else {
            // Token did not work - log out
            this.setUser(null)
          }
        })
    }

    // Get posts & pages
    this.getAllPosts()
    this.getAllPages()
  }

  getAllPosts = () => {
    fetch(`${Config.apiUrl}/wp-json/wp/v2/posts?_embed`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          posts: resp
        })
      })
  }

  getAllPages = () => {
    fetch(`${Config.apiUrl}/wp-json/wp/v2/pages?_embed`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          pages: resp
        })
      })
  }

  attemptLogin = (username, password) => {
    this.setState({
      user: {
        ...this.state.user,
        loading: true
      }
    })

    // Request token from API
    fetch(`${Config.apiUrl}/wp-json/simple-jwt-authentication/v1/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
      .then(resp => resp.json())
      .then(resp => {
        if (resp && resp.token) {
          // Update app user data
          this.setUser({
            token: resp.token,
            id: resp.user_id,
            display_name: resp.user_display_name
          })
        }
        else {
          // Handle failed attempt
          if (resp.message) {
            const error = resp.message
          }
          else {
            const error = 'Unable to log you in.'
          }

          // Unset user
          this.logoutUser()
        }
      })
      .catch(() => null)
  }

  logoutUser = () => {
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
*/
        // Wipe app user data
        this.setUser(null)
      })
  }

  setUser = user => {
    // Update cookie (persists session)
    if (user) {
      // Save token to cookie, expire in 7 days
      cookies.set('token', user.token, { path: '/' })
      cookies.set('user_id', user.id, { path: '/' })
    }
    else {
      // Remove token cookie
      cookies.remove('token')
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

  showMask = async () =>
    new Promise(resolve => {
      this.setState({
        maskClass: 'slide-enter'
      })

      setTimeout(() => {
        resolve()
      }, 1)
    }).then(resp =>
      new Promise(resolve => {
        this.setState({
          maskClass: 'slide-enter slide-enter-active'
        })

        setTimeout(() => {
          resolve()
        }, 500)
      }))

  hideMask = async () =>
    new Promise(resolve => {
      this.setState({
        maskClass: 'slide-leave'
      })

      setTimeout(() => {
        resolve()
      }, 100)
    }).then(() =>
      new Promise(resolve => {
        this.setState({
          maskClass: 'slide-leave slide-leave-active'
        })

        setTimeout(() => {
          this.setState({
            maskClass: ''
          })

          resolve()
        }, 500)
      }))

  render() {
    return (
      <div>
        <Header
          user={this.state.user}
          attemptLogin={this.attemptLogin}
          logoutUser={this.logoutUser}
          posts={this.state.posts}
          pages={this.state.pages}
        />

        <div className={`${styles.content}`}>
          <h1>ABB</h1>
          <Switcher showMask={this.showMask} hideMask={this.hideMask} />
        </div>

        <div className={`mask ${this.state.maskClass}`} />
      </div>
    )
  }
}

const mapState = () => ({
  isLoading: false
})

export default connect(mapState)(App)
