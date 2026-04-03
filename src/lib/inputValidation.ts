import * as React from "react";

/**
 * Sanitizes phone input: digits only, max 10 characters.
 */
export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

/**
 * Sanitizes name input: alphabets and spaces only.
 */
export function sanitizeName(value: string): string {
  return value.replace(/[^a-zA-Z\s]/g, "");
}

/**
 * usePhoneInput — returns props to spread onto an <Input> for phone fields.
 * Usage:
 *   const [phone, setPhone] = React.useState("");
 *   <Input {...usePhoneInput(phone, setPhone)} />
 */
export function usePhoneInput(
  value: string,
  onChange: (val: string) => void
): React.InputHTMLAttributes<HTMLInputElement> {
  return {
    value,
    inputMode: "numeric" as const,
    maxLength: 10,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(sanitizePhone(e.target.value));
    },
  };
}

/**
 * useNameInput — returns props to spread onto an <Input> for name fields.
 */
export function useNameInput(
  value: string,
  onChange: (val: string) => void
): React.InputHTMLAttributes<HTMLInputElement> {
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(sanitizeName(e.target.value));
    },
  };
}

/**
 * makePhoneChangeHandler — react-hook-form compatible onChange wrapper.
 * Pass to field.onChange.
 */
export function makePhoneChangeHandler(
  fieldOnChange: (...event: any[]) => void
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    fieldOnChange(sanitizePhone(e.target.value));
  };
}

/**
 * makeNameChangeHandler — react-hook-form compatible onChange wrapper.
 */
export function makeNameChangeHandler(
  fieldOnChange: (...event: any[]) => void
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    fieldOnChange(sanitizeName(e.target.value));
  };
}
