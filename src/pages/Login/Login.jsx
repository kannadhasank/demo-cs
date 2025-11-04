import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { login, reset } from '@store/slices/authSlice';
import Button from '@common/Button/Button';
import Input from '@common/Input/Input';
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/dashboard');
    }

    if (isError) {
      setErrors({ general: message });
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(login(formData));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <div className="login-hero">
            <h1 className="hero-title">{t('app.subtitle')}</h1>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop"
                alt="Professional"
              />
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="logo-section">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="logo-icon">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h2>{t('app.title')}</h2>
            </div>

            <p className="welcome-text">{t('auth.welcomeTo')} CSDB</p>
            <p className="description-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

            <form onSubmit={handleSubmit} className="login-form">
              <h3 className="form-title">{t('auth.login')}</h3>

              {errors.general && <div className="error-banner">{errors.general}</div>}

              <Input
                label={t('auth.email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.email')}
                error={errors.email}
                required
              />

              <Input
                label={t('auth.password')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.password')}
                error={errors.password}
                required
              />

              <div className="form-footer">
                <a href="/forgot-password" className="forgot-link">
                  {t('auth.forgotPassword')}
                </a>
              </div>

              <Button type="submit" variant="primary" size="medium" fullWidth disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.login')}
              </Button>

              <p className="signup-text">
                {t('auth.dontHaveAccount')}{' '}
                <a href="/register" className="signup-link">
                  {t('auth.signUp')}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
