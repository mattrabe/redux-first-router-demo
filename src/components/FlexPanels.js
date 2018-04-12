import React from 'react'
import PropTypes from 'prop-types'
import FreeFormContent from './FlexPanels/FreeFormContent'
import ShortHero from './FlexPanels/ShortHero'
import CTABlock from './FlexPanels/CTABlock'

class FlexPanels extends React.Component {
  static propTypes = {
    panels: PropTypes.array.isRequired
  }

  render() {
    return (
      <div className='flex-panels'>
        {this.props.panels.map((panel, index) => {
          if (panel.acf_fc_layout === 'freeform_content') {
            return <FreeFormContent key={index} content={panel} />
          }
 else if (panel.acf_fc_layout === 'short_hero') {
            return <ShortHero key={index} content={panel} />
          }
 else if (panel.acf_fc_layout === 'cta_block') {
            return <CTABlock key={index} content={panel} />
          }
        })}
      </div>
    )
  }
}

export default FlexPanels
