import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { connectWebSocket, TickerData } from '../api/binanceAPI';
import { styles } from '../style/components.styles';

function CryptoList() {
  const [cryptoList, setCryptoList] = useState<TickerData[]>([]);

  useEffect(() => {
    const ws = connectWebSocket((tickerData) => {
      setCryptoList((prev) => {
        const index = prev.findIndex((item) => item.symbol === tickerData.symbol);
        if (index === -1) {
          return [...prev, tickerData];
        }
        const newList = [...prev];
        newList[index] = tickerData;
        return newList;
      });
    });

    return () => {
      ws.close();
    };
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={styles.table} aria-label="crypto table">
        <TableHead>
          <TableRow>
            <TableCell>Пара</TableCell>
            <TableCell align="right">Цена</TableCell>
            <TableCell align="right">Изменение (24ч)</TableCell>
            <TableCell align="right">Объём</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cryptoList.map((crypto) => (
            <TableRow key={crypto.symbol}>
              <TableCell component="th" scope="row">
                {crypto.symbol}
              </TableCell>
              <TableCell align="right">${Number(crypto.price).toFixed(2)}</TableCell>
              <TableCell
                align="right"
                sx={styles.priceChange(Number(crypto.priceChangePercent))}
              >
                {Number(crypto.priceChangePercent).toFixed(2)}%
              </TableCell>
              <TableCell align="right">{Number(crypto.volume).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CryptoList;