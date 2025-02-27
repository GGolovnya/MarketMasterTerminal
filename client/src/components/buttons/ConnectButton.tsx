import React from 'react';
import { Button } from '@mui/material';
import { buttonStyles } from '../../style/components/buttons';

interface ConnectButtonProps {
  id: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  id,
  onClick,
  disabled,
}) => {
  return (
    <Button
      id={id}
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      sx={buttonStyles.connectButton}
    >
      Подключить
    </Button>
  );
};