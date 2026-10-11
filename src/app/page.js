'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const fetchProducts = async (category = '') => {
    setLoading(true);
    try {
      const url = category ? `/api/products?category=${category}` : '/api/products';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      }
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuy = async (productId) => {
    if (!email) {
      alert('Пожалуйста, введите ваш Email в поле сверху перед покупкой!');
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userEmail: email }),
      });
      const json = await res.json();

      if (json.success) {
        setMessage(`Заказ #${json.data.id} успешно оформлен! Ожидайте материалы на почту.`);
      } else {
        alert('Ошибка: ' + json.error);
      }
    } catch (err) {
      console.error('Ошибка при покупке:', err);
    }
  };

  // Обработчик подписки на рассылку
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      alert('Введите ваш Email для подписки!');
      return;
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();

      if (json.success) {
        setMessage(json.message);
      } else {
        alert('Ошибка: ' + json.error);
      }
    } catch (err) {
      console.error('Ошибка подписки:', err);
    }
  };

  return (
    <main className="container">
      <header>
        <div>
          <h1>DevMarket / Nodera</h1>
          <p className="subtitle">Каталог скриптов, ботов и готовых решений для веб-разработки</p>
        </div>

        {/* Форма подписки в шапке */}
        <form onSubmit={handleSubscribe} className="subscribe-form">
          <input
            type="email"
            placeholder="Ваш Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />
          <button type="submit" className="btn-subscribe">
            Подписаться
          </button>
        </form>
      </header>

      {message && <div className="alert">{message}</div>}

      <div className="filters">
        {['', 'Python', 'Frontend', 'DevOps'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              fetchProducts(cat);
            }}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat === '' ? 'Все товары' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="status-text">Загрузка каталога...</div>
      ) : products.length === 0 ? (
        <div className="status-text">Товары не найдены</div>
      ) : (
        <div className="grid">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div>
                <span className="badge">{product.category}</span>
                <h3 className="card-title">{product.title}</h3>
                <p className="card-desc">{product.description}</p>
              </div>

              <div className="card-footer">
                <span className="price">{product.price} ₽</span>
                <button onClick={() => handleBuy(product.id)} className="btn-buy">
                  Купить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}