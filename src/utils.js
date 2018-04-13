// import jwt from 'jsonwebtoken'
import Cookies from 'universal-cookie'
import fetch from 'isomorphic-unfetch'

import routesMap from './routesMap'
import { Config } from '../config'

const cookies = new Cookies()

export const isServer = typeof window === 'undefined'

export const isAllowed = (type, state) => {
  const role = routesMap[type] && routesMap[type].role // you can put arbitrary keys in routes
  if (!role) return true

  const user = isServer
    ? jwt.verify(state.jwToken, process.env.JWT_SECRET)
    : userFromState(state)

  if (!user) return false

  return user.roles.includes(role)
}

// VERIFICATION MOCK:
// since middleware is syncrhonous you must use a jwt package that is sync
// like the one imported above. For now we will mock both the client + server
// verification methods:

const fakeUser = { roles: ['admin'] }
const userFromState = ({ jwToken, user }) => jwToken === 'real' && fakeUser
const jwt = {
  verify: (jwToken, secret) => jwToken === 'real' && fakeUser
}

export const getCurrentUser = async () => {
  // Check for existing login state
  const token = cookies.get('token')
  const user_id = cookies.get('user_id')
  let user = null
  if (token && user_id) {
    /*
    // Indicate loading state
    this.setState({
      user: {
        loading: true
      }
    })
*/

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
}

// NOTE ON COOKIES:
// we're doing combination cookies + jwTokens because universal apps aren't
// single page apps (SPAs). Server-rendered requests, when triggered via
// direct visits by the user, do not have headers we can set. That's the
// takeaway.
