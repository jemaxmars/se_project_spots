// class Api {
//   constructor({ baseUrl, headers }) {
//     this._baseUrl = baseUrl;
//     this._headers = headers;
//   }

//   getUserInfo() {
//     return fetch(`${this._baseUrl}/users/me`, {
//       headers: this._headers,
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }

//   getAppInfo() {
//     return Promise.all([this.getInitialCards(), this.getUserInfo()]);
//   }

//   getInitialCards() {
//     return fetch(`${this._baseUrl}/cards`, {
//       headers: this._headers,
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }

//   editUserInfo({ name, about }) {
//     return fetch(`${this._baseUrl}/users/me`, {
//       method: "PATCH",
//       headers: this._headers,
//       // Send the data in the body as a JSON string.
//       body: JSON.stringify({
//         name,
//         about,
//       }),
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }

//   editProfileAvatar({ avatar }) {
//     return fetch(`${this._baseUrl}/users/me/avatar`, {
//       method: "PATCH",
//       headers: this._headers,
//       body: JSON.stringify({
//         avatar: avatar,
//       }),
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }

//   addCard({ name, link }) {
//     return fetch(`${this._baseUrl}/cards`, {
//       method: "POST",
//       headers: this._headers,
//       body: JSON.stringify({ name, link }),
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }

//   deleteCard(id) {
//     return fetch(`${this._baseUrl}/cards/${id}`, {
//       method: "DELETE",
//       headers: this._headers,
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }

//   changeLikeStatus(id, isLiked) {
//     return fetch(`${this._baseUrl}/cards/${id}/likes`, {
//       method: isLiked ? "DELETE" : "PUT",
//       headers: this._headers,
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }
// }

// export default Api;

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;

    // Bind _checkResponse so it always has the correct `this`
    this._checkResponse = this._checkResponse.bind(this);
  }

  // Centralized response check method
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    }).then(this._checkResponse);
  }

  editProfileAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    }).then(this._checkResponse);
  }

  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    }).then(this._checkResponse);
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkResponse);
  }

  changeLikeStatus(id, isLiked) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    }).then(this._checkResponse);
  }
}

export default Api;
