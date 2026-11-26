import { useId } from 'react';
import { useFormContext } from '../context/FormContext';
import styles from './InputField.module.css';

/**
 * Slide 24 / 25 Code Contract: InputField.jsx
 * Deterministic accessibility binding with useId(), aria-invalid, aria-describedby,
 * and semantic role="alert" error messaging.
 */
export const InputField = ({
  label,
  name,
  as = 'input',
  error: explicitError,
  value: explicitValue,
  onChange: explicitOnChange,
  onBlur: explicitOnBlur,
  ...props
}) => {
  // 1. Unique ID generation & error linking via React 19 useId()
  const id = useId();
  const errorId = `${id}-error`;

  // Safely consume context if available
  let contextValue;
  let contextError;
  let contextChange;
  let contextBlur;

  try {
    const ctx = useFormContext();
    if (ctx && name) {
      contextValue = ctx.values?.[name];
      const isTouched = ctx.touched?.[name] || ctx.isSubmitted;
      contextError = isTouched ? ctx.errors?.[name] : undefined;
      contextChange = ctx.handleChange;
      contextBlur = ctx.handleBlur;
    }
  } catch {
    // Graceful fallback for standalone usage
  }

  const value = explicitValue !== undefined ? explicitValue : (contextValue ?? '');
  const error = explicitError !== undefined ? explicitError : contextError;
  const onChange = explicitOnChange || contextChange;
  const onBlur = explicitOnBlur || contextBlur;

  const FieldElement = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`field-group ${styles.fieldGroup}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <FieldElement
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`${styles.input} ${as === 'textarea' ? styles.textarea : ''} ${
          error ? styles.inputError : ''
        }`}
        {...props}
      />
      {error && (
        <span id={errorId} role="alert" className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
