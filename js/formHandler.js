import { supabase } from "./supabaseClient.js";
import { validateForm } from "./validation.js";
import { setLoading, showError, showSuccess, clearMessage } from "./ui.js";

const form = document.getElementById("entryForm");
const scrollBtn = document.getElementById("scrollBtn");
const dateInput = document.getElementById("invoice_date");

if (dateInput) {
  dateInput.addEventListener("keydown", (e) => {
    if (
      (e.key === "Backspace" && (e.target.selectionStart === 5 || e.target.selectionStart === 8)) ||
      (e.key === "Delete" && (e.target.selectionStart === 4 || e.target.selectionStart === 7))
    ) {
      e.preventDefault();
    }
  });

  dateInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 8) value = value.slice(0, 8);

    let formatted = value;

    if (value.length > 4) {
      formatted = value.slice(0, 4) + "-" + value.slice(4);
    }

    if (value.length > 6) {
      formatted =
        value.slice(0, 4) +
        "-" +
        value.slice(4, 6) +
        "-" +
        value.slice(6);
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