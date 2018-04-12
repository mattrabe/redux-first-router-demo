import React from 'react'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'

class DynamicPage extends React.Component {
  state = {
    componentClass: '',
    pageData: {},
    isTransitioning: false
  }

  componentWillMount() {
    // Set state on initial load
    this.setState({
      pageData: this.props
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id) {
      // Incoming new page data: update state and run enter transition
      this.setState({
        incomingPageData: nextProps
      })
    }

    if (!this.state.isTransitioning) {
      this.changePageWithTransitions()
    }
  }

  changePageWithTransitions = () => {
    this.setState({
      isTransitioning: true
    })

    this.props
      .showMask()
      .then(() => this.props.hideMask())
      .then(() =>
        new Promise(resolve => {
          this.setState({
            componentClass: 'fade-leave fade-leave-active'
          })

          setTimeout(() => {
            resolve()
          }, 500)
        }))
      .then(() => {
        this.setState({
          pageData: this.state.incomingPageData
        })

        return new Promise(resolve => {
          this.setState({
            componentClass: 'fade-enter fade-enter-active'
          })

          setTimeout(() => {
            resolve()
          }, 500)
        })
      })
      .then(() =>
        new Promise(resolve => {
          this.setState({
            componentClass: ''
          })

          setTimeout(() => {
            resolve()
          }, 500)
        }))
      .then(() => {
        this.setState({
          isTransitioning: false
        })
      })
  }

  render() {
    const {
      slug, title, acf, content
    } = this.state.pageData
    const titleStr = (content && title.rendered) || ''
    const contentStr = (content && content.rendered) || ''

    return (
      <div className={this.state.componentClass}>
        <h2>
          {titleStr} ({slug})
        </h2>
        <pre>{JSON.stringify(acf)}</pre>
        <div className='content'>{ReactHtmlParser(contentStr)}</div>
      </div>
    )
  }
}

const mapState = state => state.dynamicPagesHash[state.slug] || {}

export default connect(mapState)(DynamicPage)
