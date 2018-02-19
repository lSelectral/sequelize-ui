import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/* ----------  ACTION THUNK CREATORS  ---------- */
import { thunks as modelsThunks } from '../redux/models'
import { toggleMenu } from '../redux/menu'

/* ----------  UI LIBRARY COMPONENTS  ---------- */
import AppBar from 'react-toolbox/lib/app_bar'
import FontIcon from 'react-toolbox/lib/font_icon'

/* ----------  COMPONENT  ---------- */
const App = ({ children, models, modelsThunks, toggleMenu }) => (
  <div>
    <AppBar
      title='Sequelize UI'
      leftIcon={<FontIcon value='menu' />}
      rightIcon={<FontIcon value='file_download' />}
      onLeftIconClick={toggleMenu}
      onRightIconClick={modelsThunks.downloadTemplate.bind(null, models)}
    />
    {children}
  </div>
)

/* ----------  CONNECT  ---------- */
const mapStateToProps = ({ models }) => ({ models })

const mapDispatchToProps = dispatch => ({
  modelsThunks: bindActionCreators(modelsThunks, dispatch),
  toggleMenu: (...args) => dispatch(toggleMenu(...args))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
