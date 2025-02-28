import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Collapse,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface ApiKeyFormProps {
  isOpen: boolean;
  exchangeName: string;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialNickName?: string;
  initialApiKey?: string;
  initialApiSecret?: string;
  isEdit?: boolean;
}

interface FormData {
  apiKey: string;
  apiSecret: string;
  nickName: string;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  isOpen,
  exchangeName,
  onClose,
  onSubmit,
  initialNickName = '',
  initialApiKey = '',
  initialApiSecret = '',
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    apiKey: initialApiKey,
    apiSecret: initialApiSecret,
    nickName: initialNickName,
  });
  const [showApiSecret, setShowApiSecret] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <Paper
        id="api-key-form-paper"
        sx={{
          width: '100%',
          padding: 2,
          marginTop: 1,
          marginBottom: 2,
          border: '1px solid',
          borderColor: 'primary.main',
          boxShadow: 2,
        }}
      >
        <Typography id="form-title" variant="subtitle1" sx={{ mb: 2 }}>
          {isEdit ? 'Редактировать ключи' : `Подключение ${exchangeName}`}
        </Typography>

        <form id="api-key-form" onSubmit={handleSubmit}>
          <TextField
            id="api-key-input"
            name="apiKey"
            label="API Key"
            value={formData.apiKey}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            size="small"
          />

          <TextField
            id="api-secret-input"
            name="apiSecret"
            label="API Secret"
            value={formData.apiSecret}
            onChange={handleChange}
            type={showApiSecret ? 'text' : 'password'}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    id="toggle-password-visibility"
                    aria-label="toggle password visibility"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    edge="end"
                  >
                    {showApiSecret ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            id="nickname-input"
            name="nickName"
            label="Название подключения"
            value={formData.nickName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            size="small"
            placeholder="Например: Торговый, Арбитраж"
          />

          <Box id="form-actions" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button
              id="cancel-button"
              variant="outlined"
              onClick={onClose}
              size="small"
            >
              Отмена
            </Button>
            <Button
              id="submit-button"
              variant="contained"
              type="submit"
              size="small"
            >
              {isEdit ? 'Обновить' : 'Сохранить'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Collapse>
  );
};

export default ApiKeyForm;