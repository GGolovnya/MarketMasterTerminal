import { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  container: {
    my: 4,
  },
  table: {
    minWidth: 650,
  },
  priceChange: (value: number): SxProps<Theme> => ({
    color: value >= 0 ? 'success.main' : 'error.main',
  }),
  pageTitle: {
    variant: 'h2' as const,
    component: 'h1' as const,
    gutterBottom: true,
  },
};