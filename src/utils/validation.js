import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  NAME_REGEX,
} from "./regex";

// Email
export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";

  if (!EMAIL_REGEX.test(email))
    return "Enter a valid email.";

  return "";
};

// Password
export const validatePassword = (password) => {
  if (!password)
    return "Password is required.";

  if (!PASSWORD_REGEX.test(password))
    return "Password must contain uppercase, lowercase, number and special character.";

  return "";
};

// Name
export const validateName = (name) => {
  if (!name.trim())
    return "Name is required.";

  if (!NAME_REGEX.test(name))
    return "Name should contain only letters.";

  return "";
};

// Confirm Password
export const validateConfirmPassword = (
  password,
  confirmPassword
) => {
  if (!confirmPassword)
    return "Confirm Password is required.";

  if (password !== confirmPassword)
    return "Passwords do not match.";

  return "";
};