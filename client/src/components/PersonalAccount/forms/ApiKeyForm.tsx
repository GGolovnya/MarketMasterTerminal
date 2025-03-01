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
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

// Определяем типы для пропсов компонента
interface ApiKeyFormProps {
  isOpen: boolean;          // Флаг, отвечающий за видимость формы
  exchangeName: string;     // Название биржи
  onClose: () => void;      // Функция закрытия формы
  onSubmit: (formData: FormData) => void;  // Функция отправки данных формы
  initialNickName?: string;  // Начальное значение для названия подключения
  initialApiKey?: string;    // Начальное значение API ключа
  initialApiSecret?: string; // Начальное значение API секрета
  isEdit?: boolean;         // Флаг режима редактирования
}

// Определяем структуру данных формы
interface FormData {
  exchangeName: string;  // Название биржи
  apiKey: string;        // API ключ
  apiSecret: string;     // API секрет
  nickName: string;      // Название подключения
}

// Основной компонент формы API ключей
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
  // Состояние для хранения данных формы
  const [formData, setFormData] = useState<FormData>({
    exchangeName,
    apiKey: initialApiKey,
    apiSecret: initialApiSecret,
    nickName: initialNickName || `${exchangeName} - Основное`,
  });

  // Состояние для отображения/скрытия API секрета
  const [showApiSecret, setShowApiSecret] = useState<boolean>(false);

  // Получаем статус и ошибку из Redux
  const { status, error } = useSelector((state: RootState) => state.exchangeApiKeys);

  // Обработчик изменения полей формы
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Предотвращаем стандартное поведение формы
    onSubmit(formData);  // Вызываем функцию отправки с данными формы
  };

  return (
    // Компонент Collapse для анимированного появления/исчезновения
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      {/* Контейнер формы */}
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
        {/* Заголовок формы */}
        <Typography id="form-title" variant="subtitle1" sx={{ mb: 2 }}>
          {isEdit ? `Редактировать ключи ${exchangeName}` : `Подключение ${exchangeName}`}
        </Typography>

        {/* Отображение ошибки, если есть */}
        {error && status === 'failed' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Форма ввода данных */}
        <form id="api-key-form" onSubmit={handleSubmit}>
          {/* Поле для ввода API Key */}
          <TextField
            id="api-key-input"
            name="apiKey"
            label="API Key"
            value={formData.apiKey}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={!isEdit}
            variant="outlined"
            size="small"
            disabled={status === 'loading'}
          />

          {/* Поле для ввода API Secret с возможностью показать/скрыть */}
          <TextField
            id="api-secret-input"
            name="apiSecret"
            label="API Secret"
            value={formData.apiSecret}
            onChange={handleChange}
            type={showApiSecret ? 'text' : 'password'}
            fullWidth
            margin="normal"
            required={!isEdit}
            variant="outlined"
            size="small"
            disabled={status === 'loading'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    id="toggle-password-visibility"
                    aria-label="toggle password visibility"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    edge="end"
                    disabled={status === 'loading'}
                  >
                    {showApiSecret ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Поле для ввода названия подключения */}
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
            required
            placeholder="Например: Торговый, Арбитраж"
            disabled={status === 'loading'}
          />

          {/* Контейнер для кнопок действий */}
          <Box id="form-actions" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            {/* Кнопка отмены */}
            <Button
              id="cancel-button"
              variant="outlined"
              onClick={onClose}
              size="small"
              disabled={status === 'loading'}
            >
              Отмена
            </Button>
            {/* Кнопка сохранения/отправки формы */}
            <Button
              id="submit-button"
              variant="contained"
              type="submit"
              size="small"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Collapse>
  );
};

export default ApiKeyForm;