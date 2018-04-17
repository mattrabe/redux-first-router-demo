import React from 'react'
import { connect } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'

import { isServer } from '../utils'
import FlexPanels from './FlexPanels'

const DynamicPage = ({
  slug, title, acf, content, componentClass
}) => {
  const titleStr = (content && title.rendered) || ''
  const contentStr = (content && content.rendered) || ''

  if (!content) {
    return null
  }

  return (
    <div className={componentClass}>
      <h2>
        {titleStr} ({slug})
      </h2>

      <div className='content'>{ReactHtmlParser(contentStr)}</div>

      <h3>Flex panels of this page are:</h3>

      <FlexPanels panels={(acf && acf.flexible_content) || []} />
    </div>
  )
}

const mapState = state => {
  let slug = ''
  if (isServer) {
    slug = state.slug || ''
  }
  else {
    slug = state.transition.pageSlug || ''
  }

  // Not a page change, return existing state
  if (!slug) {
    return state.dynamicPagesHash[state.slug]
  }

  return state.dynamicPagesHash[slug] || {}
}

export default connect(mapState)(DynamicPage)
