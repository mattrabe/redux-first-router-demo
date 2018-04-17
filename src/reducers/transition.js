export default (state = '', action = {}) => {
  switch (action.type) {
    case 'SET_IS_TRANSITIONING': {
      return {
        ...state,
        isTransitioning: true
      }
    }

    case 'UNSET_IS_TRANSITIONING': {
      return {
        ...state,
        isTransitioning: false
      }
    }

    case 'MASK_ENTER': {
      return {
        ...state,
        maskClass: 'slide-enter'
      }
    }

    case 'MASK_ENTER_ACTIVE': {
      return {
        ...state,
        maskClass: 'slide-enter slide-enter-active'
      }
    }

    case 'MASK_LEAVE': {
      return {
        ...state,
        maskClass: 'slide-leave'
      }
    }

    case 'MASK_LEAVE_ACTIVE': {
      return {
        ...state,
        maskClass: 'slide-leave slide-leave-active'
      }
    }

    case 'MASK_CLEAR': {
      return {
        ...state,
        maskClass: ''
      }
    }

    case 'COMPONENT_LEAVE': {
      return {
        ...state,
        componentClass: 'fade-leave'
      }
    }

    case 'COMPONENT_LEAVE_ACTIVE': {
      return {
        ...state,
        componentClass: 'fade-leave fade-leave-active'
      }
    }

    case 'SET_PAGE_SLUG': {
      return {
        ...state,
        pageSlug: action.slug
      }
    }

    case 'COMPONENT_ENTER': {
      return {
        ...state,
        componentClass: 'fade-enter'
      }
    }

    case 'COMPONENT_ENTER_ACTIVE': {
      return {
        ...state,
        componentClass: 'fade-enter fade-enter-active'
      }
    }

    case 'COMPONENT_CLEAR': {
      return {
        ...state,
        componentClass: ''
      }
    }

    default: {
      return state
    }
  }
}
