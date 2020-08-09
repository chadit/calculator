import React from 'react'
import logo from '../logo.svg'

const Layout = props => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">{props.header}</h1>
      </header>
      {props.children}
    </div>
  )
}

export default Layout