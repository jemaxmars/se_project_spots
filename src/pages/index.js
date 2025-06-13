import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import logoImage from "../images/logo.svg";
const logoElement = document.querySelector(".header__logo");
logoElement.src = logoImage;
import avatarImage from "../images/bessie_avatar.jpg";
const avatarElement = document.querySelector(".profile__avatar");
avatarElement.src = avatarImage;
import editImage from "../images/pencil-icon.svg";
const editElement = document.querySelector(".profile__icon");
editElement.src = editImage;
import addImage from "../images/plus-sign.svg";
const addElement = document.querySelector(".add__icon");
addElement.src = addImage;
import closeImage from "../images/x-icon-hover.svg";
const closeElement = document.querySelector(".edit__profile-x-icon");
closeElement.src = closeImage;
import xImage from "../images/x-icon-hover.svg";
const xElement = document.querySelector(".new__post-x-icon");
xElement.src = xImage;

// const initialCards = [
//   {
//     name: "Golden Gate Bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
//   },
//   {
//     name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },

// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ad37a010-2c01-4629-8987-9c2e7b09f127",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log(cards);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);


const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const addCardModal = document.querySelector("#add-card-modal");
const addCardFormEl = document.querySelector("#add-card-form");
const profileAddButton = document.querySelector(".profile__add-btn");
const addCardSubmitButton = addCardModal.querySelector(".modal__submit-button");

const cardsListEl = document.querySelector(".cards__list");

const editModal = document.querySelector("#edit-profile-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-button_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-button_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardDeleteBtnEl.closest(".card").remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.target);
  }
}

editModal.addEventListener("click", handleOverlayClick);
addCardModal.addEventListener("click", handleOverlayClick);
previewModal.addEventListener("click", handleOverlayClick);

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    // Check each modal and close it if it's open
    if (editModal.classList.contains("modal_opened")) {
      closeModal(editModal);
    }
    if (addCardModal.classList.contains("modal_opened")) {
      closeModal(addCardModal);
    }
    if (previewModal.classList.contains("modal_opened")) {
      closeModal(previewModal);
    }
  }
});

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function openEditProfileModal() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

profileEditButton.addEventListener("click", openEditProfileModal);
editModalCloseButton.addEventListener("click", () => closeModal(editModal));
editFormElement.addEventListener("submit", handleEditFormSubmit);

profileAddButton.addEventListener("click", () => {
  openModal(addCardModal);
});

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

enableValidation(validationConfig);
