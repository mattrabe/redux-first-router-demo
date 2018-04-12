import React from 'react'
import PropTypes from 'prop-types'

const panelStyle = {
  padding: '10px',
  border: 'solid 1px #ccc'
}

class FreeFormContent extends React.Component {
  static propTypes = {
    content: PropTypes.shape({
      acf_fc_layout: PropTypes.string.isRequired,
      html_content: PropTypes.string.isRequired
    }).isRequired
  }

  render() {
    return (
      <div
        className='flex-panel freeform-content'
        style={panelStyle}
        dangerouslySetInnerHTML={{ __html: this.props.content.html_content }}
      />
    )
  }
}

export default FreeFormContent
