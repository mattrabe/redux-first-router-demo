import React from 'react'
import { connect } from 'react-redux'
import { TransitionGroup, Transition } from 'transition-group'
import universal from 'react-universal-component'

import Loading from './Loading'
import Err from './Error'
import isLoading from '../selectors/isLoading'
import styles from '../css/Switcher'

const UniversalComponent = universal(({ page }) => import(`./${page}`), {
  minDelay: 500,
  loading: Loading,
  error: Err
})

const Switcher = ({
  page,
  direction,
  isLoading,
  showMask,
  hideMask,
  user,
  attemptLogin,
  logoutUser,
  componentClass
}) => (
  <TransitionGroup
    className={`${styles.switcher} ${direction}`}
    duration={500}
    prefix='fade'
  >
    <Transition key={page}>
      <UniversalComponent
        page={page}
        isLoading={isLoading}
        showMask={showMask}
        hideMask={hideMask}
        user={user}
        attemptLogin={attemptLogin}
        logoutUser={logoutUser}
        componentClass={componentClass}
      />
    </Transition>
  </TransitionGroup>
)

const mapState = state => ({
  page: state.page,
  direction: state.direction,
  isLoading: isLoading(state)
})

export default connect(mapState)(Switcher)
