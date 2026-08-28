import { supabase } from "./supabaseClient.js";
import { validateForm } from "./validation.js";
import { setLoading, showError, showSuccess, clearMessage } from "./ui.js";

const form = document.getElementById("entryForm");
const scrollBtn = document.getElementById("scrollBtn");

const dateInput = document.getElementById("invoice_date");

if (dateInput) {
  dateInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // Allow digits + dash
    value = value.replace(/[^\d-]/g, "");

    // Prevent multiple dashes in wrong places
    let parts = value.split("-");

    // Rebuild from digits only
    let digits = value.replace(/\D/g, "").slice(0, 8);

    let formatted = "";

    if (digits.length <= 4) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    } else {
      formatted =
        digits.slice(0, 4) +
        "-" +
        digits.slice(4, 6) +
        "-" +
        digits.slice(6);
    }

    // 🔥 KEY FIX: If user manually typed dash, respect it
    if (value.endsWith("-") && formatted.length < 10) {
      formatted += "-";
    }

    e.target.value = formatted;
  });
}
/* =========================
   SCROLL BUTTON LOGIC
========================= */
if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    document.querySelector(".form-section")?.scrollIntoView({
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollBtn.style.opacity = "0";
      scrollBtn.style.pointerEvents = "none";
    } else {
      scrollBtn.style.opacity = "1";
      scrollBtn.style.pointerEvents = "auto";
    }
  });
}

/* =========================
   FORM SUBMISSION
========================= */
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearMessage();

    // 🔥 MATCHES YOUR NEW FORM + DB
    const data = {
      full_name: document.getElementById("full_name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      code: document.getElementById("code").value.trim(),

      province: document.getElementById("province").value.trim(),
      district: document.getElementById("district").value.trim(),
      municipality: document.getElementById("municipality").value.trim(),
      ward: document.getElementById("ward").value.trim(),
      local_area: document.getElementById("local_area").value.trim(),

      dealer_name: document.getElementById("dealer_name").value.trim(),
      bill_name: document.getElementById("bill_name").value.trim(),
      invoice_number: document.getElementById("invoice_number").value.trim(),
      invoice_date: document.getElementById("invoice_date").value.trim(),

      purchase_amount: Number(
        document.getElementById("purchase_amount").value
      )
    };

    /* =========================
       VALIDATION
    ========================= */
    const validationError = validateForm(data);
    if (validationError) {
      showError(validationError);
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("entries")
      .insert([data]);

    setLoading(false);

    /* =========================
       ERROR HANDLING
    ========================= */
    if (error) {
      console.error(error);

      if (error.message.includes("foreign key")) {
        showError("Invalid coupon code ❌");
      } else if (error.message.includes("unique")) {
        showError("This code is already used ❌");
      } else {
        showError("Submission failed. Please try again ❌");
      }

      return;
    }

    /* =========================
       SUCCESS
    ========================= */
    showSuccess();

    form.reset();

    // Optional UX improvement
    form.style.display = "none";
    document.getElementById("successBox")?.classList.remove("hidden");
  });
}