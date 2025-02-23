import { Box, Typography, Container, Grid, Paper } from '@mui/material';
import { AutoAwesome, Speed, Security, Timeline } from '@mui/icons-material';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Умный торговый терминал
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Автоматизируйте свою торговую стратегию с помощью современных технологий
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <AutoAwesome sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Автоматизация
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Создавайте и настраивайте торговые стратегии
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Speed sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Скорость
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Мгновенное исполнение торговых операций
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Security sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Безопасность
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Защищенное хранение API ключей
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Timeline sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Аналитика
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Детальный анализ торговых операций
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}