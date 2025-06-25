export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  button.textContent = isLoading ? loadingText : buttonText;
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
