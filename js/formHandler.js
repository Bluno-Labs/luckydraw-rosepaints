import { supabase } from "./supabaseClient.js";
import { validateForm } from "./validation.js";
import { setLoading, showError, showSuccess, clearMessage } from "./ui.js";

const form = document.getElementById("entryForm");
const scrollBtn = document.getElementById("scrollBtn");

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

    const data = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      code: document.getElementById("code").value.trim(),
      address: document.getElementById("address").value.trim(),
      dealer_name: document.getElementById("dealer_name").value.trim(),
    };

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

    if (error) {
      console.error(error);

      if (error.message.includes("foreign key")) {
        showError("Invalid code ❌");
      } else if (error.message.includes("unique")) {
        showError("Code already used ❌");
      } else {
        showError("Something went wrong ❌");
      }

      return;
    }

    showSuccess();
    form.reset();
  });
}