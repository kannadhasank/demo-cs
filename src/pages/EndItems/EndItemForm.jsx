import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@mui/material';
import './EndItemForm.css';

const EndItemForm = ({ initialData, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    specification: '',
    issue: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Mock data for dropdowns
  const specifications = [
    'S 1000D DMC',
    'MIL-STD-1234A',
    'ATA-100',
    'S 2000M'
  ];

  const issues = [
    '4.0',
    '4.0.1',
    '4.1',
    '4.2'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        specification: initialData.specification || '',
        issue: initialData.issue || ''
      });
    }
  }, [initialData]);

  const validateField = (name, value) => {
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
      name: true,
      specification: true,
      issue: true
    });

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.specification && formData.issue && Object.keys(errors).every(key => !errors[key]);
  };

  return (
    <form onSubmit={handleSubmit} className="end-item-form">
      <div className="form-content">
        <div className="form-group">
          <label className="form-label">
            End item name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`}
            placeholder="Enter end item name"
          />
          {errors.name && touched.name && (
            <span className="error-text">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Specification <span className="required">*</span>
          </label>
          <select
            name="specification"
            value={formData.specification}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-select ${errors.specification && touched.specification ? 'input-error' : ''}`}
          >
            <option value="">Select specification</option>
            {specifications.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {errors.specification && touched.specification && (
            <span className="error-text">{errors.specification}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Issue (S1000D) <span className="required">*</span>
          </label>
          <select
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-select ${errors.issue && touched.issue ? 'input-error' : ''}`}
          >
            <option value="">Select issue</option>
            {issues.map((issue) => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}
          </select>
          {errors.issue && touched.issue && (
            <span className="error-text">{errors.issue}</span>
          )}
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

EndItemForm.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default EndItemForm;
