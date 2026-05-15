import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { initRecharge, loginCustomerPortal, productSearch } from '@rechargeapps/storefront-client';

initRecharge({
  storeIdentifier: 'saskas-musical-instruments.myshopify.com',
  loginRetryFn: loginCustomerPortal,
});

const sheet = document.createElement('style');
sheet.textContent = '@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }';
document.head.appendChild(sheet);

function ProductStrip({ products }) {
  const doubled = [...products, ...products];
  const duration = products.length * 3;

  return (
    <div style={styles.stripWrapper}>
      <div style={{ ...styles.strip, animation: `marquee ${duration}s linear infinite` }}>
        {doubled.map((product, i) => {
          const image = product.images?.[0]?.medium || product.images?.[0]?.original;
          const price = product.minimum_variant_prices?.[0];
          return (
            <div key={i} style={styles.card}>
              {image && <img src={image} alt={product.title} style={styles.image} />}
              <div style={styles.cardBody}>
                <p style={styles.productTitle}>{product.title}</p>
                {price && <p style={styles.price}>{price.currency} {price.price}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyWidgetApp() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const session = await loginCustomerPortal();
        const data = await productSearch(session, { format_version: '2022-06', limit: 25 });
        setProducts(data.products);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recommended for you</h2>
      {loading && <p style={styles.status}>Loading...</p>}
      {error && <p style={styles.status}>Error: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p style={styles.status}>No products found.</p>
      )}
      {products.length > 0 && <ProductStrip products={products} />}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '24px 0',
    background: '#ffffff',
  },
  title: {
    margin: '0 0 16px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
  },
  status: {
    fontSize: '14px',
    color: '#6b7280',
  },
  stripWrapper: {
    overflow: 'hidden',
    width: '100%',
  },
  strip: {
    display: 'flex',
    gap: '12px',
    width: 'max-content',
  },
  card: {
    width: '160px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    flexShrink: 0,
    padding: '8px',
    boxSizing: 'border-box',
  },
  image: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '8px',
  },
  cardBody: {
    padding: '10px',
  },
  productTitle: {
    margin: '0 0 4px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#111827',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  price: {
    margin: 0,
    fontSize: '13px',
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
