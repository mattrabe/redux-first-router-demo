import React from 'react'
import { connect } from 'react-redux'

class DynamicPage extends React.Component {
  state = {
    componentClass: '',
    pageData: {}
  }

  componentWillMount() {
    // Set state on initial load
    this.setState({
      pageData: this.props
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.id) {
      // Incoming new data with no page: run leave transition
      this.runLeaveTransition()
    }
    else {
      // Incoming new page data: update state and run enter transition
      this.setState({
        pageData: nextProps
      })

      this.runEnterTransition()
    }
  }

  runLeaveTransition = () =>
    new Promise(resolve => {
      this.setState({
        componentClass: 'fade-leave fade-leave-active'
      })

      setTimeout(() => {
        resolve()
      }, 500)
    })

  runEnterTransition = () =>
    new Promise(resolve => {
      this.setState({
        componentClass: 'fade-enter fade-enter-active'
      })

      setTimeout(() => {
        resolve()
      }, 500)
    }).then(() => {
      this.setState({
        componentClass: ''
      })
    })

  render() {
    const {
      slug, title, acf, content
    } = this.state.pageData
    const titleStr = (content && title.rendered) || ''
    const contentStr = (content && content.rendered) || ''

    return (
      <div className={this.state.componentClass}>
        <p>DynamicPage....</p>
        <p>
          {slug}: {titleStr}
        </p>
        <pre>{JSON.stringify(acf)}</pre>
        <p>{contentStr}</p>
      </div>
    )
  }
}

const mapState = state => state.dynamicPagesHash[state.slug] || {}

export default connect(mapState)(DynamicPage)
