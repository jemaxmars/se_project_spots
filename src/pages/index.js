// ===================== IMPORTS =====================
import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// ===================== IMAGES =====================
import logoImage from "../images/logo.svg";
import avatarImage from "../images/bessie_avatar.jpg";
import editImage from "../images/pencil-icon.svg";
import addImage from "../images/plus-sign.svg";
import closeImage from "../images/x-icon-hover.svg";
import xImage from "../images/x-icon-hover.svg";
import deleteCloseImage from "../images/delete-modal-x-icon.svg";

// ===================== API INITIALIZATION =====================
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ad37a010-2c01-4629-8987-9c2e7b09f127",
    "Content-Type": "application/json",
  },
});

// ===================== IMAGE ELEMENT SETUP =====================
document.querySelector(".header__logo").src = logoImage;
const avatarElement = document.querySelector(".profile__avatar");
avatarElement.src = avatarImage;
document.querySelector(".profile__icon").src = editImage;
document.querySelector(".add__icon").src = addImage;
document.querySelector(".edit__profile-x-icon").src = closeImage;
document.querySelector(".new__post-x-icon").src = xImage;
document.querySelector(".edit__avatar-x-icon").src = closeImage;
document.querySelector(".modal__delete-x-icon").src = deleteCloseImage;
console.log("Delete close image:", deleteCloseImage);

// ===================== PROFILE ELEMENTS =====================
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatarBtn = document.querySelector(".profile__avatar-btn");

// ===================== EDIT PROFILE MODAL =====================
const editModal = document.querySelector("#edit-profile-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// ===================== AVATAR MODAL ELEMENTS =====================
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = editAvatarModal.querySelector(".modal__form");
const avatarSubmitBtn = editAvatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = editAvatarModal.querySelector(
  ".modal__close-button"
);
const avatarInput = editAvatarModal.querySelector("#profile-avatar-input");

// ===================== ADD CARD MODAL ELEMENTS =====================
const addCardModal = document.querySelector("#add-card-modal");
const addCardFormEl = document.querySelector("#add-card-form");
const profileAddButton = document.querySelector(".profile__add-btn");
const addCardSubmitButton = addCardModal.querySelector(".modal__submit-button");

// ===================== CARD ELEMENTS =====================
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardsListEl = document.querySelector(".cards__list");

// ===================== PREVIEW MODAL ELEMENTS =====================
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-button_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

// ===================== API: LOAD INITIAL DATA =====================
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarElement.src = userInfo.avatar;
  })
  .catch(console.error);

// ===================== MODAL HELPERS =====================
function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.target);
  }
}

// ===================== CARD CREATION FUNCTION =====================
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-button_active");
  });

  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// ===================== EVENT LISTENERS =====================
// Edit Profile
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

editFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error);
});

editModalCloseButton.addEventListener("click", () => closeModal(editModal));

// Add Card
profileAddButton.addEventListener("click", () => openModal(addCardModal));

addCardModal
  .querySelector(".modal__close-button")
  .addEventListener("click", () => {
    closeModal(addCardModal);
  });

addCardFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleInput = addCardFormEl.querySelector("#card-title-input");
  const urlInput = addCardFormEl.querySelector("#card-url-input");

  const newCard = getCardElement({
    name: titleInput.value,
    link: urlInput.value,
  });

  cardsListEl.prepend(newCard);
  closeModal(addCardModal);
  addCardFormEl.reset();
  disableButton(addCardSubmitButton, validationConfig);
});

function handleAvatarSubmit(e) {
  e.preventDefault();
  const newAvatarUrl = avatarInput.value;

  api
    .editProfileAvatar({ avatar: newAvatarUrl })
    .then((data) => {
      avatarElement.src = data.avatar;
      closeModal(editAvatarModal);
      avatarForm.reset();
    })
    .catch(console.error);
}

// Edit Avatar
profileAvatarBtn.addEventListener("click", () => openModal(editAvatarModal));
avatarModalCloseBtn.addEventListener("click", () =>
  closeModal(editAvatarModal)
);

avatarForm.addEventListener("submit", handleAvatarSubmit);

// Preview Modal
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// Overlay Close
[editModal, addCardModal, previewModal, editAvatarModal].forEach((modal) => {
  modal.addEventListener("click", handleOverlayClick);
});

// Escape Key Close
document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    document.querySelectorAll(".modal_opened").forEach(closeModal);
  }
});

// ===================== FORM VALIDATION =====================
enableValidation(validationConfig);
