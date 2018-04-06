export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'DYNAMIC_PAGE_FOUND': {
      const { slug, page } = action.payload
      state[slug] = page
      return state
    }
    default:
      return state
  }
}
