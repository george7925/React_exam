import { LoginFormValues } from "../types/user";
import { CheckoutFormValues } from "../types/checkout";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateLogin(values: LoginFormValues): FieldErrors<LoginFormValues> {
  const errors: FieldErrors<LoginFormValues> = {};
  if (!values.username.trim()) {
    errors.username = "Username is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

export function validateCheckout(values: CheckoutFormValues): FieldErrors<CheckoutFormValues> {
  const errors: FieldErrors<CheckoutFormValues> = {};
  if (values.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  if (values.address.trim().length < 5) {
    errors.address = "Address must be at least 5 characters";
  }
  if (!values.city.trim()) {
    errors.city = "City is required";
  }
  return errors;
}
