import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootDOM = document.createElement('div');
rootDOM.id = 'work-report-root'; 

document.body.append(rootDOM)

ReactDOM.createRoot(document.getElementById('work-report-root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
