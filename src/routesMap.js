import { redirect, NOT_FOUND } from 'redux-first-router'

import {
  getCurrentUser,
  getAllPages,
  isServer,
  transitionPageContent
} from './utils'
import { Config } from '../config'

export default {
  HOME: {
    path: '/',
    thunk: async (dispatch, getState) => {
      const user = await getCurrentUser(getState())

      dispatch({ type: 'SET_CURRENT_USER', user })
      dispatch({ type: 'SET_ALL_PAGES', allPages: await getAllPages() })
    }
  },
  LOGIN: {
    path: '/login',
    thunk: async (dispatch, getState) => {
      dispatch({ type: 'SET_ALL_PAGES', allPages: await getAllPages() })

      dispatch({ type: 'LOGIN', payload: {} })
    }
  },
  DYNAMIC_PAGE: {
    path: '/:slug',
    thunk: async (dispatch, getState) => {
      const { location: { payload: { slug } } } = getState()
      const user = await getCurrentUser(getState())
      dispatch({ type: 'SET_ALL_PAGES', allPages: await getAllPages() })

      if (slug && slug !== 'undefined') {
        // Not sure why slug is sometimes equal to the string value 'undefined'...
        if (!isServer) {
          // Running on client, not server...

          // Start transition
          dispatch({ type: 'SET_IS_TRANSITIONING' })
          new Promise(resolve => {
            dispatch({ type: 'MASK_ENTER' })

            setTimeout(() => {
              resolve()
            }, 1)
          }).then(resp =>
            new Promise(resolve => {
              dispatch({ type: 'MASK_ENTER_ACTIVE' })

              setTimeout(() => {
                resolve()
              }, 500)
            }))
        }

        // Get page
        const page = await fetch(`${Config.apiUrl}/wp-json/abbability/v1/page?slug=${slug}`)
          .then(resp => resp.json())
          .catch(() => null)

        if (!page) {
          return dispatch({ type: NOT_FOUND })
        }

        // Run transition and/or switch out page content
        transitionPageContent(dispatch, 'DYNAMIC_PAGE_FOUND', slug, page)
      }
    }
  },
  DYNAMIC_PORTAL: {
    path: '/portal/:slug',
    thunk: async (dispatch, getState) => {
      const { location: { payload: { slug } } } = getState()
      const user = await getCurrentUser(getState())
      const allPages = await getAllPages()
      dispatch({ type: 'SET_ALL_PAGES', allPages })

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
