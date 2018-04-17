export default (state = '', action = {}) => {
  switch (action.type) {
    case 'SET_ALL_PAGES': {
      return {
        ...state,
        allPages: action.allPages
      }
    }

    case 'SET_CURRENT_USER': {
      return {
        ...state,
        currentUser: action.user
      }
    }

    default: {
      return state
    }
  }
}
