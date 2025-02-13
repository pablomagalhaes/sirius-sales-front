import React from 'react'
import ReactDOM from 'react-dom'
import singleSpaReact from 'single-spa-react'
import Root from './Root'
import './index.css'

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary: (): any => {
    // Customize the root error boundary for your microfrontend here.
    return null
  }
})

export const { bootstrap, mount, unmount } = lifecycles
