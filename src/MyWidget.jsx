import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { initRecharge, loginCustomerPortal, listSubscriptions } from '@rechargeapps/storefront-client';

initRecharge({
  storeIdentifier: 'saskas-musical-instruments.myshopify.com',
  loginRetryFn: loginCustomerPortal,
});

function MyWidgetApp() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    loginCustomerPortal().then(session => {
      return listSubscriptions(session, { limit: 25 });
    }).then(data => {
      console.log('data', data);
      setSubscriptions(data.subscriptions);
    }).catch(err => console.error('Error:', err));
  }, [])

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Custom Extension</h2>
      <div>
        {subscriptions.map(sub => (
          <div key={sub.id}>{sub.product_title}</div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '24px',
    background: '#ffffff',
    maxWidth: '400px',
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
