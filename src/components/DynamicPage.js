import React from 'react'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'

import FlexPanels from './FlexPanels'

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

        <div className='content'>{ReactHtmlParser(contentStr)}</div>

        <h3>Flex panels of this page are:</h3>

        <FlexPanels panels={(acf && acf.flexible_content) || []} />
      </div>
    )
  }
}

const mapState = state => state.dynamicPagesHash[state.slug] || {}

export default connect(mapState)(DynamicPage)
