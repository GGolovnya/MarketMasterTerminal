import { Container, Box, Typography } from '@mui/material';
import CryptoList from './components/сryptoList';
import { styles } from './style/components.styles';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={styles.container}>
        <Typography {...styles.pageTitle}>
        Market Master Terminal
        </Typography>
        <CryptoList />
      </Box>
    </Container>
  );
}

export default App;