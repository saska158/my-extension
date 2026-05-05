import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function MyWidgetApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Custom Extension</h2>
      <p style={styles.text}>Welcome to your customer portal extension!</p>
      <button style={styles.button} onClick={() => setCount(c => c + 1)}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    maxWidth: '400px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  text: {
    margin: '0 0 16px',
    fontSize: '14px',
    color: '#6b7280',
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    background: '#6366f1',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

class MyWidget extends HTMLElement {
  connectedCallback() {
    if (this._mounted) return;
    this._mounted = true;
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);
    ReactDOM.createRoot(mountPoint).render(<MyWidgetApp />);
  }
}

customElements.define('my-widget', MyWidget);

export default MyWidget;
