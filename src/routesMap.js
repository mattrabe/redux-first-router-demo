import { redirect, NOT_FOUND } from 'redux-first-router'

import { getCurrentUser } from './utils'
import { Config } from '../config'

export default {
  HOME: '/',
  LOGIN: {
    path: '/login',
    thunk: async (dispatch, getState) => {
      dispatch({ type: 'LOGIN', payload: {} })
    }
  },
  DYNAMIC_PAGE: {
    path: '/:slug',
    thunk: async (dispatch, getState) => {
      const { location: { payload: { slug } } } = getState()

      // Get page
      const page = await fetch(`${Config.apiUrl}/wp-json/abbability/v1/page?slug=${slug}`)
        .then(resp => resp.json())
        .catch(() => null)

      if (!page) {
        return dispatch({ type: NOT_FOUND })
      }

      dispatch({ type: 'DYNAMIC_PAGE_FOUND', payload: { slug, page } })
    }
  },
  DYNAMIC_PORTAL: {
    path: '/portal/:slug',
    thunk: async (dispatch, getState) => {
      const { location: { payload: { slug } } } = getState()
      const user = await getCurrentUser()

      const token = (user && user.token) || null
      let page = null
      if (token) {
        page = await fetch(
          `${Config.apiUrl}/wp-json/abbability/v1/page?slug=${slug}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${token}`
            }
          }
        )
          .then(resp => resp.json())
          .catch(() => null)
      }

      if (!page) {
        return dispatch({ type: NOT_FOUND })
      }

      dispatch({ type: 'DYNAMIC_PORTAL_FOUND', payload: { slug, page } })
    }
  }
}
