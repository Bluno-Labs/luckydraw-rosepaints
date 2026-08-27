// js/validation.js

export function validateForm({ name, phone, code, address, dealer_name }) {
  
  if (!name || !phone || !code || !address || !dealer_name) {
    return "All fields are required ❌";
  }

  // 7 digit numeric code
  if (!/^\d{7}$/.test(code)) {
    return "Code must be 7 digits ❌";
  }

  // basic phone validation (adjust if needed)
  if (!/^\d{7,15}$/.test(phone)) {
    return "Invalid phone number ❌";
  }

  return null;
}