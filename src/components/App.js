import React from 'react'
import { connect } from 'react-redux'

import DevTools from './DevTools'
import Sidebar from './Sidebar'
import Switcher from './Switcher'

import styles from '../css/App'

class App extends React.Component {
  state = {
    maskClass: ''
  }

  showMask = async () => new Promise(resolve => {
    this.setState({
      maskClass: 'slide-enter'
    })

    setTimeout(() => {
      resolve()
    }, 1)
  }).then(resp => new Promise(resolve => {
    this.setState({
      maskClass: 'slide-enter slide-enter-active'
    })

    setTimeout(() => {
      resolve()
    }, 500)
  }))

  hideMask = async () => new Promise(resolve => {
    this.setState({
      maskClass: 'slide-leave'
    })

    setTimeout(() => {
      resolve()
    }, 100)
  }).then(() => new Promise(resolve => {
    this.setState({
      maskClass: 'slide-leave slide-leave-active'
    })

    setTimeout(() => {
      this.setState({
        maskClass: ''
      })

      resolve()
    }, 500)
  }))

  render() {
    return (
      <div>
        <div className={`${styles.app}`}>
          <Sidebar />
          <Switcher showMask={this.showMask} hideMask={this.hideMask} />
        </div>

        <DevTools />
        <div className={`mask ${this.state.maskClass}`} />
      </div>
    )
  }
}

const mapState = () => ({
  isLoading: false
})

export default connect(mapState)(App)
