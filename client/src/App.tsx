import { Container, Box, Typography } from '@mui/material';
import CryptoList from './сryptoList';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          MarketMasterTerminal
        </Typography>
        <CryptoList />
      </Box>
    </Container>
  );
}

export default App;