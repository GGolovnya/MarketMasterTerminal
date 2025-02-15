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
import { tableStyles } from '../style/components/tables';

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
    <TableContainer component={Paper} sx={tableStyles.container}>
      <Table aria-label="crypto table">
        <TableHead>
          <TableRow sx={tableStyles.header}>
            <TableCell>Пара</TableCell>
            <TableCell align="right">Цена</TableCell>
            <TableCell align="right">Изменение (24ч)</TableCell>
            <TableCell align="right">Объём</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cryptoList.map((crypto) => (
            <TableRow key={crypto.symbol} sx={tableStyles.row}>
              <TableCell component="th" scope="row" sx={tableStyles.cell}>
                {crypto.symbol}
              </TableCell>
              <TableCell align="right" sx={tableStyles.cell}>
                ${Number(crypto.price).toFixed(2)}
              </TableCell>
              <TableCell
                align="right"
                sx={[
                  tableStyles.cell,
                  Number(crypto.priceChangePercent) >= 0
                    ? tableStyles.positive
                    : tableStyles.negative,
                ]}
              >
                {Number(crypto.priceChangePercent).toFixed(2)}%
              </TableCell>
              <TableCell align="right" sx={tableStyles.cell}>
                {Number(crypto.volume).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CryptoList;