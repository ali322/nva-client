import * as React from 'react'
import { Provider } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { HashRouter as Router, Route } from 'react-router-dom'
import rootStore from './store'
import App from './app'

const Root = () => (
  <Provider root={rootStore}>
    <Router>
      <Route component={App} path="/" />
    </Router>
  </Provider>
)

export default hot(module)(Root)
