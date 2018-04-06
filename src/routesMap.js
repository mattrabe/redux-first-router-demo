import { redirect, NOT_FOUND } from 'redux-first-router'
import { fetchData } from './utils'

export default {
  HOME: '/',
  LIST: {
    path: '/list/:category',
    thunk: async (dispatch, getState) => {
      const {
        jwToken,
        location: { payload: { category } },
        videosByCategory
      } = getState()

      if (videosByCategory[category]) return
      const videos = await fetchData(`/api/videos/${category}`, jwToken)

      if (videos.length === 0) {
        return dispatch({ type: NOT_FOUND })
      }

      dispatch({ type: 'VIDEOS_FETCHED', payload: { videos, category } })
    }
  },
  VIDEO: {
    path: '/video/:slug',
    thunk: async (dispatch, getState) => {
      const { jwToken, location: { payload: { slug } } } = getState()

      const video = await fetchData(`/api/video/${slug}`, jwToken)

      if (!video) {
        return dispatch({ type: NOT_FOUND })
      }

      dispatch({ type: 'VIDEO_FOUND', payload: { slug, video } })
    }
  },
  PLAY: {
    path: '/video/:slug/play',
    thunk: (dispatch, getState) => {
      if (typeof window === 'undefined') {
        const { slug } = getState().location.payload
        const action = redirect({ type: 'VIDEO', payload: { slug } })

        dispatch(action)
      }
    }
  },
  LOGIN: '/login',
  ADMIN: {
    path: '/admin', // TRY: visit this path or dispatch ADMIN
    role: 'admin' // + change jwToken to 'real' in server/index.js
  },
  DYNAMIC_PAGE: {
    path: '/:slug',
    thunk: async (dispatch, getState) => {
      const { jwToken, location: { payload: { slug } } } = getState()

      // Get page
      const resp = await fetch(`http://api.ability-poc.localhost/wp-json/abbability/v1/page?slug=${slug}`)
      const page = await resp.json()

      if (!page) {
        return dispatch({ type: NOT_FOUND })
      }

      dispatch({ type: 'DYNAMIC_PAGE_FOUND', payload: { slug, page } })
    }
  }
}
