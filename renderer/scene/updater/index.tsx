import * as React from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader'
import App from './app'

const Root = hot(module)(App)

render(<Root />, document.getElementById('app'))
