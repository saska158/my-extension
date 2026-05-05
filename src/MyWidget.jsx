import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { initRecharge, loginCustomerPortal, productSearch } from '@rechargeapps/storefront-client';

initRecharge({
  storeIdentifier: 'saskas-musical-instruments.myshopify.com',
  loginRetryFn: loginCustomerPortal,
});

function Carousel({ products }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex(i => (i - 1 + products.length) % products.length);
  const next = () => setIndex(i => (i + 1) % products.length);

  const product = products[index];
  const image = product.images?.[0]?.medium || product.images?.[0]?.original;
  const price = product.minimum_variant_prices?.[0];

  return (
    <div style={styles.carousel}>
      <button style={styles.arrow} onClick={prev}>&#8592;</button>

      <div style={styles.card}>
        {image && (
          <img src={image} alt={product.title} style={styles.image} />
        )}
        <div style={styles.cardBody}>
          <p style={styles.productTitle}>{product.title}</p>
          {price && (
            <p style={styles.price}>{price.currency} {price.price}</p>
          )}
        </div>
      </div>

      <button style={styles.arrow} onClick={next}>&#8594;</button>

      <div style={styles.dots}>
        {products.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{ ...styles.dot, ...(i === index ? styles.dotActive : {}) }}
          />
        ))}
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
      <h2 style={styles.title}>Products</h2>
      {loading && <p style={styles.status}>Loading...</p>}
      {error && <p style={styles.status}>Error: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p style={styles.status}>No products found.</p>
      )}
      {products.length > 0 && <Carousel products={products} />}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '24px',
    background: '#ffffff',
    maxWidth: '480px',
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
  carousel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    position: 'relative',
  },
  arrow: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  card: {
    flex: 1,
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    minWidth: '200px',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block',
  },
  cardBody: {
    padding: '12px',
  },
  productTitle: {
    margin: '0 0 4px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
  },
  price: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  dots: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#d1d5db',
    cursor: 'pointer',
  },
  dotActive: {
    background: '#6366f1',
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
