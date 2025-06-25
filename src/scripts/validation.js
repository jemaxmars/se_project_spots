export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button--disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const getErrorElement = (form, input) =>
  form.querySelector(`#${input.id}-error`);

const showInputError = (form, input, config) => {
  const errorEl = getErrorElement(form, input);
  errorEl.textContent = input.validationMessage;
  input.classList.add(config.inputErrorClass);
};

const hideInputError = (form, input, config) => {
  const errorEl = getErrorElement(form, input);
  errorEl.textContent = "";
  input.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (form, input, config) => {
  input.validity.valid
    ? hideInputError(form, input, config)
    : showInputError(form, input, config);
};

const hasInvalidInput = (inputs) =>
  inputs.some((input) => !input.validity.valid);

const disableButton = (button, config) => {
  button.disabled = true;
  button.classList.add(config.inactiveButtonClass);
};

const enableButton = (button, config) => {
  button.disabled = false;
  button.classList.remove(config.inactiveButtonClass);
};

const toggleButtonState = (inputs, button, config) =>
  hasInvalidInput(inputs)
    ? disableButton(button, config)
    : enableButton(button, config);

const resetValidation = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);
  inputs.forEach((input) => hideInputError(form, input, config));
  disableButton(button, config);
};

const setEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  toggleButtonState(inputs, button, config);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, button, config);
    });
  });
};

const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => setEventListeners(form, config));
};

export {
  enableValidation,
  resetValidation,
  disableButton,
  showInputError,
  hideInputError,
  checkInputValidity,
  hasInvalidInput,
  toggleButtonState,
};