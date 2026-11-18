import { validateName, validateEmail, validatePhone, validateMessage, validateAgreement } from "./validation-rules.mjs";

const form = document.querySelector("#feedbackForm");
if (form) {
  const modal = document.querySelector("#feedbackModal");
  const submitButton = document.querySelector("#feedbackSubmit");
  const summary = document.querySelector("#formStatus");
  const touched = new Set();
  let submitted = false;
  let submitting = false;
  let returnFocus = submitButton;
  let pageWasLocked = false;

  const validators = {
    username: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
    agreement: validateAgreement,
  };
  const controls = Object.keys(validators).map((id) => document.getElementById(id));
  const colors = ["border-line", "border-red-600", "border-green-700"];

  function paint(control, state, text = "") {
    const error = document.getElementById(`${control.id}Error`);
    const success = document.getElementById(`${control.id}Success`);
    control.classList.remove(...colors);
    control.classList.add(state === "error" ? "border-red-600" : state === "success" ? "border-green-700" : "border-line");
    control.dataset.state = state;
    control.setAttribute("aria-invalid", String(state === "error"));
    // textContent трактує повідомлення як текст, не як HTML.
    error.textContent = text;
    error.hidden = state !== "error";
    success.hidden = state !== "success";
  }

  function showError(control, message) { paint(control, "error", message); }
  function showSuccess(control) { paint(control, "success"); }
  function clearError(control) { paint(control, "normal"); }
  function read(control) { return control.type === "checkbox" ? control.checked : control.value; }
  function validateField(control) {
    const message = validators[control.id](read(control));
    if (message) showError(control, message);
    else showSuccess(control);
    return !message;
  }

  controls.forEach((control) => {
    control.addEventListener("blur", () => {
      touched.add(control.id);
      validateField(control);
    });
    control.addEventListener(control.type === "checkbox" ? "change" : "input", () => {
      summary.textContent = "";
      if (control.type === "checkbox") touched.add(control.id);
      if (submitted || touched.has(control.id)) validateField(control);
      else if (!validators[control.id](read(control))) showSuccess(control);
      else clearError(control); // Не показуємо ранню помилку під час першого введення.
    });
  });

  function closeModal() { if (modal.open) modal.close(); }
  document.querySelector("#closeFeedbackModal").addEventListener("click", closeModal);
  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });
  modal.addEventListener("click", (event) => {
    if (event.target !== modal) return;
    const box = modal.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (outside) closeModal(); // Натискання всередині білої картки не закриває вікно.
  });
  modal.addEventListener("close", () => {
    if (!pageWasLocked) document.documentElement.classList.remove("overflow-hidden");
    submitting = false;
    submitButton.disabled = false;
    returnFocus.focus({ preventScroll: true });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitting || modal.open) return;
    submitted = true;
    const invalid = controls.filter((control) => !validateField(control));
    if (invalid.length) {
      summary.textContent = `Перевірте поля з помилками: ${invalid.length}. Дані не надіслано.`;
      invalid[0].focus();
      return;
    }
    submitting = true;
    submitButton.disabled = true;
    returnFocus = event.submitter || submitButton;
    // Навчальна імітація: fetch/API/localStorage відсутні, введене не передається.
    form.reset();
    touched.clear();
    submitted = false;
    controls.forEach(clearError);
    summary.textContent = "";
    pageWasLocked = document.documentElement.classList.contains("overflow-hidden");
    document.documentElement.classList.add("overflow-hidden");
    modal.showModal(); // Native dialog: top layer, inert-фон і модальна Tab-навігація.
    document.querySelector("#closeFeedbackModal").focus();
  });

  // Без JS disabled-кнопка не дозволяє звичайне надсилання полів з name.
  form.noValidate = true;
  submitButton.disabled = false;
}
