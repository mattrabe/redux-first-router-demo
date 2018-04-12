import React from 'react'
import PropTypes from 'prop-types'

const panelStyle = {
  padding: '10px',
  border: 'solid 1px #ccc'
}

class CTABlock extends React.Component {
  static propTypes = {
    content: PropTypes.shape({
      acf_fc_layout: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      button: PropTypes.shape({
        button_style: PropTypes.string.isRequired,
        button_title: PropTypes.string.isRequired,
        internal_link: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  goToUrl = url => {
    window.location = url
  }

  render() {
    return (
      <div className='flex-panel cta-block' style={panelStyle}>
        <p>{this.props.content.title}</p>
        <button
          className='{this.props.content.button.button_style}'
          onClick={() => this.goToUrl(this.props.content.button.internal_link)}
        >
          {this.props.content.button.button_title}
        </button>
      </div>
    )
  }
}

export default CTABlock
