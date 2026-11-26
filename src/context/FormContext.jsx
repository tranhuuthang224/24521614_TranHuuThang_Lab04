import { createContext, useContext } from 'react';

/**
 * Slide 14 & Slide 24 Code Contract: FormContext.jsx
 * Synchronous Form Validation Engine with single render pass evaluation.
 * Banning cascading useEffect validation waterfalls (Anti-Pattern Slide 13).
 */
export const FormContext = createContext(null);

/**
 * Custom hook abstraction for consuming form context.
 */
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormContext.Provider');
  }
  return context;
};

/**
 * Pure synchronous validation function computed in a single render pass.
 * Implements cross-field validation (Confirm Password matches Password) as required by Slide 27.
 */
export function validateForm(values) {
  const errors = {};

  // Full Name validation
  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full Name must be at least 3 characters';
  }

  // Email validation
  if (!values.email || !values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  // Student ID (MSSV) validation
  if (!values.studentId || !values.studentId.trim()) {
    errors.studentId = 'Student ID (MSSV) is required';
  } else if (!/^\d{8}$/.test(values.studentId.trim())) {
    errors.studentId = 'Student ID must be exactly 8 digits (e.g., 24521614)';
  }

  // Password validation
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(values.password)) {
    errors.password = 'Password must contain both letters and numbers';
  }

  // Cross-Field Validation (Slide 27 Live Defense Challenge 2)
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

/**
 * Pure synchronous validation for Homework 3 Esports Appeal Form (Slide 21 & 32).
 * Evaluates all fields in a single render pass without useEffect waterfalls.
 */
export function validateAppealForm(values) {
  const errors = {};

  if (!values.representative || !values.representative.trim()) {
    errors.representative = 'Legal representative name is required';
  } else if (values.representative.trim().length < 3) {
    errors.representative = 'Representative name must be at least 3 characters';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Valid corporate or player email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Valid corporate or player email is required';
  }

  if (!values.statement || values.statement.trim().length < 20) {
    errors.statement =
      'Rebuttal must be at least 20 characters explaining technical mitigating factors';
  }

  return errors;
}

export default FormContext;
