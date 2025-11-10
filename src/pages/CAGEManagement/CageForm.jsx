import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@mui/material';
import './CageForm.css';

const CageForm = ({ initialData, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    cageCode: '',
    name: '',
    street: '',
    country: '',
    state: '',
    city: '',
    postCode: '',
    commandLanguage: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Mock data for dropdowns
  const countries = ['US', 'UK', 'Canada', 'Germany', 'France', 'India', 'China', 'Japan'];
  const states = ['Seattle', 'California', 'Texas', 'New York', 'Florida', 'Washington'];
  const cities = ['WA', 'LA', 'Austin', 'NYC', 'Miami', 'Tacoma'];
  const commandLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        cageCode: initialData.cageCode || '',
        name: initialData.name || '',
        street: initialData.street || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        postCode: initialData.postCode || '',
        commandLanguage: initialData.commandLanguage || '',
        remarks: initialData.remarks || '',
      });
    }
  }, [initialData]);

  const validateField = (name, value) => {
    // Remarks and commandLanguage are optional, all other fields are required
    if (name === 'remarks' || name === 'commandLanguage') {
      return '';
    }
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      cageCode: true,
      name: true,
      street: true,
      country: true,
      state: true,
      city: true,
      postCode: true,
      commandLanguage: true,
      remarks: true
    });

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  const isFormValid = () => {
    return formData.cageCode && formData.name && formData.street &&
           formData.country && formData.state && formData.city &&
           formData.postCode && Object.keys(errors).every(key => !errors[key]);
  };

  return (
    <form onSubmit={handleSubmit} className="cage-form">
      <div className="form-content">
        <div className="form-group">
          <label className="form-label">
            CAGE Code <span className="required">*</span>
          </label>
          <input
            type="text"
            name="cageCode"
            value={formData.cageCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.cageCode && touched.cageCode ? 'input-error' : ''}`}
            placeholder="EPS0001"
          />
          {errors.cageCode && touched.cageCode && (
            <span className="error-text">{errors.cageCode}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Company Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`}
            placeholder="Aircraft Company"
          />
          {errors.name && touched.name && (
            <span className="error-text">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Street <span className="required">*</span>
          </label>
          <textarea
            name="street"
            value={formData.street}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-textarea ${errors.street && touched.street ? 'input-error' : ''}`}
            placeholder="1st Street, 1234567, 11302, 1st Avenue&#10;Seattle, WA 10983, United States"
            rows="3"
          />
          {errors.street && touched.street && (
            <span className="error-text">{errors.street}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Country <span className="required">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${errors.country && touched.country ? 'input-error' : ''}`}
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && touched.country && (
              <span className="error-text">{errors.country}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              State <span className="required">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${errors.state && touched.state ? 'input-error' : ''}`}
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && touched.state && (
              <span className="error-text">{errors.state}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              City <span className="required">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-select ${errors.city && touched.city ? 'input-error' : ''}`}
            >
              <option value="">Select city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && touched.city && (
              <span className="error-text">{errors.city}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Postal / Zip code <span className="required">*</span>
            </label>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.postCode && touched.postCode ? 'input-error' : ''}`}
              placeholder="10983"
            />
            {errors.postCode && touched.postCode && (
              <span className="error-text">{errors.postCode}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Command Language
          </label>
          <select
            name="commandLanguage"
            value={formData.commandLanguage}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-select"
          >
            <option value="">Select command language</option>
            {commandLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-textarea"
            placeholder="Text input..."
            rows="3"
          />
        </div>
      </div>

      <div className="form-actions">
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
          className="cancel-button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid() || isLoading}
          className="save-button"
        >
          {isLoading ? <CircularProgress size={20} /> : 'Save'}
        </Button>
      </div>
    </form>
  );
};

CageForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default CageForm;
