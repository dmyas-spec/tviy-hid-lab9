// Навчальні правила формату. Вони не підтверджують існування номера чи скриньки.
export const REGEX_PHONE = /^\+380\d{9}$/;
export const REGEX_EMAIL = /^[A-Z0-9_%+-]+(?:\.[A-Z0-9_%+-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
export const REGEX_NAME = /^\p{L}[\p{L}\p{M}]*(?:[ ’'ʼ-][\p{L}\p{M}]+)*$/u;

export function validateName(raw) {
  const value = raw.trim().normalize("NFC");
  if (value.length < 2) return "Введіть ім’я: щонайменше 2 символи.";
  if (value.length > 60) return "Скоротіть ім’я до 60 символів.";
  return REGEX_NAME.test(value) ? "" : "Використовуйте літери, пробіл, апостроф або дефіс.";
}

export function validateEmail(raw) {
  const value = raw.trim();
  const local = value.split("@")[0];
  if (!value) return "Введіть електронну пошту.";
  if (value.length > 254 || local.length > 64) return "Електронна адреса задовга.";
  return REGEX_EMAIL.test(value) ? "" : "Введіть email латиницею, наприклад name@example.com.";
}

export function validatePhone(value) {
  if (!value) return "Введіть номер телефону.";
  // Не прибираємо пробіли й не переписуємо введення: формат має бути строгим.
  return REGEX_PHONE.test(value) ? "" : "Очікуємо +380 і рівно 9 цифр, без пробілів та дефісів.";
}

export function validateMessage(raw) {
  const value = raw.trim();
  if (value.length < 10) return "Напишіть повідомлення: щонайменше 10 символів.";
  return value.length <= 1000 ? "" : "Скоротіть повідомлення до 1000 символів.";
}

export function validateAgreement(checked) {
  return checked ? "" : "Підтвердьте згоду з політикою навчальної форми.";
}
