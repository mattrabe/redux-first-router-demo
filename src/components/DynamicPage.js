import React from 'react'
import { connect } from 'react-redux'

const DynamicPage = ({
  id, slug, title, acf, content
}) => {
  const title_str = (content && title.rendered) || ''
  const content_str = (content && content.rendered) || ''

  return (
    <div>
      <p>DynamicPage....</p>
      <p>
        {slug}: {title_str}
      </p>
      <pre>{JSON.stringify(acf)}</pre>
      <p>{content_str}</p>
    </div>
  )
}

const mapState = state => state.dynamicPagesHash[state.slug] || {}

export default connect(mapState)(DynamicPage)
