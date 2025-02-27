import React from 'react';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { buttonStyles } from '../../style/components/buttons';

// Определение типов props компонента
interface DeleteButtonProps {
  id: string;
  onClick: () => void;  // Функция обработчик клика
  disabled?: boolean;   // Флаг отключения кнопки (опциональный)
}

// Компонент кнопки удаления
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  id,
  onClick,
  disabled,
}) => {
  return (
    <IconButton
      id={id}
      onClick={onClick}
      disabled={disabled}
      size="small"
      sx={buttonStyles.deleteButton} // Применяем стили из buttonStyles
    >
      <Delete /> {/* Иконка удаления из Material Icons */}
    </IconButton>
  );
};