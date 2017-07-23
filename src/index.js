import React from 'react';
import ReactDOM from 'react-dom';
import App from './dashboard/components/App';
import './dashboard/index.css';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
