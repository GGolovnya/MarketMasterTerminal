import React from 'react';
import { IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { buttonStyles } from '../../style/components/buttons';

interface EditButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      size="small"
      sx={buttonStyles.editButton}
    >
      <Edit />
    </IconButton>
  );
};