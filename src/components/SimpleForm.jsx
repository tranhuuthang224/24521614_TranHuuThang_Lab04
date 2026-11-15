import { useState } from 'react';
import { FormContext, validateForm } from '../context/FormContext';
import InputField from './InputField';
import ShowData from './ShowData';
import styles from './SimpleForm.module.css';

const initial = {
  fullName: '',
  studentId: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/**
 * Slide 14, 15, 24 Code Contract: SimpleForm.jsx
 * Synchronous derived validation in a single render pass with ZERO useEffect waterfalls.
 * Eliminates 5-layer useEffect cascading re-renders, race conditions, and infinite loop bugs.
 */
export const SimpleForm = () => {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Synchronous derived validation computed purely during render pass (Zero useEffect)
  const errors = validateForm(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (isValid) {
      setSubmittedData({ ...values });
    }
  };

  const handleReset = () => {
    setValues(initial);
    setTouched({});
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        touched,
        isSubmitted,
        isValid,
        handleChange,
        handleBlur,
        setValues,
      }}
    >
      <section className={styles.formContainer} aria-labelledby="form-heading">
        <header className={styles.formHeader}>
          <div className={styles.engineBadge}>
            Sprint 2 Engine • Synchronous Single-Pass Validation
          </div>
          <h2 id="form-heading" className={styles.formTitle}>
            Context-Driven Student Dossier Form
          </h2>
          <p className={styles.formSubtitle}>
            Zero-useEffect validation engine eliminating cascading waterfalls and race conditions.
          </p>

          <aside className={styles.metricsBar} aria-label="Real-time Form Metrics">
            <span
              className={`${styles.metricPill} ${
                isValid ? styles.metricPillValid : styles.metricPillInvalid
              }`}
            >
              {isValid ? '● Form Valid' : `● ${Object.keys(errors).length} Validation Issue(s)`}
            </span>
            <span className={styles.metricNotice}>
              Derived State Pass: Pure Render Evaluation
            </span>
          </aside>
        </header>

        <form onSubmit={handleSubmit} noValidate className={styles.formElement}>
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="e.g. Trần Hữu Thắng"
            autoComplete="name"
          />

          <InputField
            label="Student ID (MSSV)"
            name="studentId"
            placeholder="e.g. 24521614 (8 digits)"
            autoComplete="off"
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. 24521614@gm.uit.edu.vn"
            autoComplete="email"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 chars with letter & number"
            autoComplete="new-password"
          />

          <InputField
            label="Confirm Password (Cross-Field Validation)"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password to verify"
            autoComplete="new-password"
          />

          <footer className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitBtn}
              aria-label="Submit Form Data"
            >
              Submit Dossier
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetBtn}
              aria-label="Reset Form Data"
            >
              Reset Fields
            </button>
          </footer>
        </form>

        {/* Live ShowData JSON inspector rendered on valid submission */}
        {submittedData && <ShowData data={submittedData} />}
      </section>
    </FormContext.Provider>
  );
};

export default SimpleForm;
