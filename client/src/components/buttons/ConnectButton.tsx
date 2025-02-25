import React from 'react';
import { Button } from '@mui/material';
import { buttonStyles } from '../../style/components/buttons';

interface ConnectButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={buttonStyles.connectButton}
    >
      Подключить
    </Button>
  );
};