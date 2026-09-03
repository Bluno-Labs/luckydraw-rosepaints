export function validateForm(data) {

  const {
    full_name,
    phone,
    code,
    province,
    district,
    municipality,
    ward,
    local_area,
    dealer_name,
    bill_name,
    invoice_number,
    invoice_date,
    purchase_amount
  } = data;

  // ✅ Required fields
  if (
    !full_name || !phone || !code ||
    !province || !district || !municipality ||
    !ward || !local_area ||
    !dealer_name || !bill_name ||
    !invoice_number || !invoice_date ||
    !purchase_amount
  ) {
    return "Please fill all required fields ❌";
  }

  // ✅ Code validation
  if (!/^[A-Z0-9]{6}$/.test(code)) {
  return "Coupon code must be 6 characters (letters & numbers) ❌";
}

  // ✅ Phone validation
  if (!/^\d{7,15}$/.test(phone)) {
    return "Invalid mobile number ❌";
  }

  // ✅ Ward (numeric)
  if (!/^\d+$/.test(ward)) {
    return "Ward must be a number ❌";
  }

  // ✅ Date format (YYYY-MM-DD)
  const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (!datePattern.test(invoice_date)) {
    return "Invalid date format (YYYY-MM-DD) ❌";
  }

  // ✅ Purchase amount
  if (isNaN(purchase_amount) || Number(purchase_amount) <= 0) {
    return "Invalid purchase amount ❌";
  }

  return null;
}