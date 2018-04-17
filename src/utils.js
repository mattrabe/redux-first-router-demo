import jwt from 'jsonwebtoken'
import Cookies from 'universal-cookie'
import fetch from 'isomorphic-unfetch'

import routesMap from './routesMap'
import { Config } from '../config'

const cookies = new Cookies()

export const isServer = typeof window === 'undefined'

export const isAllowed = (type, state) => {
  const role = routesMap[type] && routesMap[type].role // you can put arbitrary keys in routes
  if (!role) return true

  /*
  const user = isServer
    ? jwt.verify(state.jwToken, process.env.JWT_SECRET)
    : userFromState(state)
*/
  const user = null

  if (!user) return false

  return user.roles.includes(role)
}

// VERIFICATION MOCK:
// since middleware is syncrhonous you must use a jwt package that is sync
// like the one imported above. For now we will mock both the client + server
// verification methods:

const fakeUser = { roles: ['admin'] }
const userFromState = ({ jwToken, user }) => jwToken === 'real' && fakeUser
/*
const jwt = {
  verify: (jwToken, secret) => jwToken === 'real' && fakeUser
}
*/

export const attemptLogin = async (username, password) => {
  // Request token from API
  const success = await fetch(
    `${Config.apiUrl}/wp-json/simple-jwt-authentication/v1/token`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    }
  )
    .then(resp => resp.json())
    .then(resp => {
      if (resp && resp.token) {
        // Success - return user data
        const user = {
          token: resp.token,
          id: resp.user_id,
          display_name: resp.user_display_name
        }

        return user
      }
      // Handle failed attempt
      if (resp.message) {
        const error = resp.message
      }
      else {
        const error = 'Unable to log you in.'
      }

      // Unset user
      console.log('LOGOUT USER...')

      //      this.logoutUser()
    })
    .catch(() => null)

  return success
}

export const getCurrentUser = async state => null

/*
  console.log('state', state);

  const user = isServer
    ? jwt.verify(state.jwToken, process.env.JWT_SECRET)
    : userFromState(state)


  // Check for existing login state
  const token = cookies.get('token')
  const user_id = cookies.get('user_id')

  let user = null
  if (token && user_id) {
    // Indicate loading state
    this.setState({
      user: {
        loading: true
      }
    })

    user = fetch(`${Config.apiUrl}/wp-json/wp/v2/users/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }
    })
      .then(resp => resp.json())
      .then(resp => {
        if (resp && resp.id) {
          // Token worked, return user
          return {
            ...resp,
            token
          }
        }
        // Token did not work, return null
        return null
      })
  }

  return user
*/

export const getAllPages = async () => {
  const pages = await fetch(`${Config.apiUrl}/wp-json/wp/v2/pages?_embed`)
    .then(resp => resp.json())
    .then(resp => resp)
    .catch(error => [])

  return pages
}

export const transitionPageContent = (dispatch, actionType, slug, page) => {
  if (!isServer) {
    // Running on client, not server...

    new Promise(resolve => {
      dispatch({ type: 'COMPONENT_CLEAR' })
      dispatch({ type: actionType, payload: { slug, page } })

      setTimeout(() => {
        resolve()
      }, 1)
    })
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'MASK_LEAVE' })

          setTimeout(() => {
            resolve()
          }, 1)
        }))
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'MASK_LEAVE_ACTIVE' })

          setTimeout(() => {
            resolve()
          }, 500)
        }))
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'MASK_CLEAR' })
          dispatch({ type: 'COMPONENT_LEAVE' })

          setTimeout(() => {
            resolve()
          }, 100)
        }))
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'COMPONENT_LEAVE_ACTIVE' })

          setTimeout(() => {
            resolve()
          }, 500)
        }))
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'SET_PAGE_SLUG', slug })

          resolve()
        }))
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'COMPONENT_ENTER' })

          setTimeout(() => {
            resolve()
          }, 1)
        }))
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'COMPONENT_ENTER_ACTIVE' })

          setTimeout(() => {
            resolve()
          }, 500)
        }))
      .then(resp =>
        new Promise(resolve => {
          dispatch({ type: 'UNSET_IS_TRANSITIONING' })

          resolve()
        }))
  }
  else {
    // Running on server, not client...
    dispatch({ type: actionType, payload: { slug, page } })
  }

  return true
}

// NOTE ON COOKIES:
// we're doing combination cookies + jwTokens because universal apps aren't
// single page apps (SPAs). Server-rendered requests, when triggered via
// direct visits by the user, do not have headers we can set. That's the
// takeaway.
