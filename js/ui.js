export function setLoading(isLoading) {
  const btn = document.querySelector("#submitBtn");
  if (!btn) return;

  btn.disabled = isLoading;
  btn.innerText = isLoading ? "Submitting..." : "Submit Entry";
}

export function showError(msg) {
  const el = document.querySelector("#message");
  if (!el) return;

  el.innerText = msg;
  el.style.color = "#dc2626";
}

export function showSuccess() {
  const form = document.querySelector("#entryForm");
  const box = document.querySelector("#successBox");

  if (form) form.style.display = "none";
  if (box) box.classList.remove("hidden");
}

export function clearMessage() {
  const el = document.querySelector("#message");
  if (!el) return;

  el.innerText = "";
}