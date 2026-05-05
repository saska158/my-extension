import { createRoot } from 'react-dom/client'
import App from './App'

class MyWidget extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    const container = document.createElement('div')
    shadow.appendChild(container)
    createRoot(container).render(<App />)
  }
}

customElements.define('my-widget', MyWidget)
