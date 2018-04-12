import { redirect, NOT_FOUND } from 'redux-first-router'
import { fetchData } from './utils'

export default {
  HOME: '/',
  DYNAMIC_PAGE: {
    path: '/:slug',
    thunk: async (dispatch, getState) => {
      const { jwToken, location: { payload: { slug } } } = getState()

      // Get page
      const page = await fetch(`http://api.ability-poc.localhost/wp-json/abbability/v1/page?slug=${slug}`)
        .then(resp => resp.json())
        .catch(() => null)

      if (!page) {
        return dispatch({ type: NOT_FOUND })
      }

      dispatch({ type: 'DYNAMIC_PAGE_FOUND', payload: { slug, page } })
    }
  }
}
