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
const avatarSubmitBtn = editAvatarModal.querySelector(".modal__submit-button");
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

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) {
    closeModal(e.target);
  }
}

// ===================== CARD CREATION FUNCTION =====================
let selectedCard;
let selectedCardId;

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

  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  }
  cardLikeBtnEl.addEventListener("click", (e) =>
    changeLikeStatus(e, data._id)
  );

  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function changeLikeStatus(e, id) {
  const likeBtn = e.target;
  const isLiked = likeBtn.classList.contains("card__like-button_active");

  api
    .changeLikeStatus(id, isLiked)
    .then((updatedCard) => {
      // Toggle class based on updatedCard.isLiked
      if (updatedCard.isLiked) {
        likeBtn.classList.add("card__like-button_active");
      } else {
        likeBtn.classList.remove("card__like-button_active");
      }
    })
    .catch(console.error);
}


// ===================== EVENT LISTENERS =====================
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, validationConfig);
  openModal(editModal);
});
editFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const button = e.submitter;
  const originalText = button.textContent;
  button.textContent = "Saving...";

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
    .catch(console.error)
    .finally(() => {
      button.textContent = originalText;
    });
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
    const button = e.submitter;
    const originalText = button.textContent;
    button.textContent = "Saving...";

    const titleInput = addCardFormEl.querySelector("#card-title-input");
    const urlInput = addCardFormEl.querySelector("#card-url-input");

    api
      .addCard({
        name: titleInput.value,
        link: urlInput.value,
      })
      .then((cardData) => {
        const newCard = getCardElement(cardData);
        cardsListEl.prepend(newCard);
        closeModal(addCardModal);
        addCardFormEl.reset();
        disableButton(button, validationConfig);
      })
      .catch((err) => {
        console.error("Failed to add card:", err);
      })
      .finally(() => {
        button.textContent = originalText;
      });
  });

function handleAvatarSubmit(e) {
  e.preventDefault();
  const button = e.submitter;
  const originalText = button.textContent;
  button.textContent = "Saving...";

  api
    .editProfileAvatar({ avatar: avatarInput.value })
    .then((data) => {
      avatarElement.src = data.avatar;
      closeModal(editAvatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      button.textContent = originalText;
    });
}
const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(
  ".modal__close-button-delete"
);
const deleteConfirmBtn = deleteModal.querySelector(".modal_delete");
const deleteCancelBtn = deleteModal.querySelector(".modal_cancel");

//handle delete card*
function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id; // Ensure the card object includes `_id` from API
  openModal(deleteModal);
}

deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
  selectedCard = null; // reset the selected card
  selectedCardId = null; // reset the selected card ID
});

// handle delete card*
function handleDeleteSubmit(e) {
  e.preventDefault();
  if (!selectedCardId || !selectedCard) return;

  const button = e.submitter;
  const originalText = button.textContent;
  button.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      button.textContent = originalText;
    });
}

const deleteForm = document.querySelector("#delete-form");
deleteForm.addEventListener("submit", handleDeleteSubmit);

// Edit Avatar

profileAvatarBtn.addEventListener("click", () => {
  openModal(editAvatarModal);
  resetValidation(avatarForm, validationConfig);
});
avatarModalCloseBtn.addEventListener("click", () =>
  closeModal(editAvatarModal)
);

avatarForm.addEventListener("submit", handleAvatarSubmit);

// Preview Modal
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

// Overlay Close
[editModal, addCardModal, previewModal, editAvatarModal, deleteModal].forEach(
  (modal) => {
    modal.addEventListener("click", handleOverlayClick);
  }
);

// Escape Key Close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal_opened").forEach(closeModal);
  }
});

// ===================== FORM VALIDATION =====================
enableValidation(validationConfig);
