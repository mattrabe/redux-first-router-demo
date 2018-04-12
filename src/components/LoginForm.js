import React from 'react'

import styles from '../css/LoginForm'

class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  }

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmitLogin = e => {
    e.preventDefault()

    if (this.state.username && this.state.password) {
      return this.props.attemptLogin(this.state.username, this.state.password)
    }
  }

  handleSubmitLogout = e => {
    e.preventDefault()

    this.props.logoutUser()
  }

  render() {
    return (
      <div className={styles.loginForm}>
        {this.props.user ? (
          <div className={styles.loginState}>
            {this.props.user.loading ? (
              <div>loading...</div>
            ) : (
              <div>
                Hi, {this.props.user.display_name}
                <button onClick={this.handleSubmitLogout}>Log out</button>
              </div>
            )}
          </div>
        ) : null}
        <form
          action='/login'
          method='post'
          onSubmit={this.handleSubmitLogin}
          className={styles.loginForm}
        >
          <input
            type='text'
            name='username'
            placeholder='Username'
            autoComplete='username'
            value={this.state.username}
            onChange={this.updateInput}
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            onChange={this.updateInput}
            valule={this.state.password}
            autoComplete='current-password'
          />
          <input type='submit' value='Log in' />
        </form>
      </div>
    )
  }
}

export default LoginForm
