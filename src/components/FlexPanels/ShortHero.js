import React from 'react'
import PropTypes from 'prop-types'

const panelStyle = {
  padding: '10px',
  border: 'solid 1px #ccc',
  backgroundPosition: 'center'
}

class ShortHero extends React.Component {
  static propTypes = {
    content: PropTypes.shape({
      acf_fc_layout: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      background_image: PropTypes.oneOfType([
        PropTypes.shape({
          icon: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired
        }),
        PropTypes.bool
      ]).isRequired
    }).isRequired
  }

  render() {
    panelStyle.backgroundImage = `url('${this.props.content.background_image
      .url}')`

    return (
      <div className='flex-panel short-hero' style={{ ...panelStyle }}>
        <p>{this.props.content.title}</p>
      </div>
    )
  }
}

export default ShortHero
