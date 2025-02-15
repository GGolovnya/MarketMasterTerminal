import { useState, useEffect } from 'react';
import axios from 'axios';

const Balance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      console.log('Отправка запроса на получение баланса');
      try {
        const { data } = await axios.get('/api/balance');
        console.log('Получен ответ:', data);
        setBalance(data.balance);
      } catch (err) {
        console.error('Ошибка запроса:', err);
        setError('Ошибка получения баланса');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="balance-container">
      <h3>Баланс USDT</h3>
      <p>{balance.toFixed(2)} USDT</p>
    </div>
  );
};

export default Balance;