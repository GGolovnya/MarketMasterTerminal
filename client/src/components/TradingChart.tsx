import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { styles } from '../style/components.styles';

declare global {
  interface Window {
    TradingView: any;
  }
}

function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      new window.TradingView.widget({
        container_id: containerRef.current.id,
        symbol: 'BINANCE:BTCUSDT',
        interval: '30',
        theme: 'dark',
        style: '1',
        locale: 'ru',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: false,
        height: '500',
        width: '100%',
      });
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      id="tradingview_chart"
      sx={styles.tradingChart}
    />
  );
}

export default TradingChart;