class NotesForm extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.customValidationTitleHandler =
      this.customValidationTitleHandler.bind(this);
    this.customValidationBodyHandler =
      this.customValidationBodyHandler.bind(this);
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        max-width: 800px;
        width: 80%;
        margin: 0 auto;
        padding: 16px;
      }
  
      body, input, button {
        font-family: 'Open Sans', sans-serif;
      }
      
      input, button {
        font-size: 16px;
        background: gainsboro;
        cursor: pointer;
      }

      .input_section {
        display: flex;
        flex-direction: column;
        padding: 16px;
        border: 1px solid black;
        border-radius: 10px;
      }
      
      .input_section > h2 {
        text-align: center;
        color: #363737;
      }
      
      .input_section > form > .input {
        margin: 8px 0;
      }
      
      .input_section > form > button {
        background-color: #363737;
        color: white;
        border: 0;
        border-radius: 5px;
        display: block;
        width: 100%;
        padding: 8px;
        cursor: pointer;
      }
      
      .input_section > form > button > span {
        font-weight: bold;
      }
      
      .input_section > form > .input > input {
        display: block;
        width: 100%;
        height:40px;
        border-radius: 5px;
      }
      
      .input_section > form > .input > textarea{
        display: block;
        width: 100%;
        height: 100px;
        border-radius: 5px;
      }
      
      .input_section > form > .input > label {
        color: #363737;
        font-weight: bold;
      }
      
      .input_section > form > .input_inline {
        margin: 12px 0;
        display: flex;
        align-items: center;
      }
      
      .input_section > form > .input_inline > label {
        color: #363737;
        font-weight: bold;
        margin-right: 10px;
      }

      .validation-message {
        margin-block-start: 0.5rem;
        color: red;
    }

      `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <section class="input_section">
        <h2>Masukkan Catatan Baru</h2>
        <form id="form">
        <div class="input">
            <label for="inputNoteTitle">Judul</label>
            <input id="title" type="text" name="title" required>
            <p id="titleValidation" class="validation-message" aria-live="polite"></p>
        </div>
        <div class="input">
            <label for="inputTextNote">Catatan</label>
            <textarea id="body" name="body" type="text" required></textarea>
            <p id="bodyValidation" class="validation-message" aria-live="polite"></p>
        </div>
        <button id="submit" type="submit"><span>Tambahkan Catatan</span></button>
        </form>
      </section>
      `;

    this._shadowRoot
      .querySelector("#form")
      .addEventListener("submit", this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    const title = this._shadowRoot.querySelector("#title").value;
    const body = this._shadowRoot.querySelector("#body").value;

    const addNoteEvent = new CustomEvent("insertNote", {
      detail: { title, body },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(addNoteEvent);

    this._shadowRoot.querySelector("#title").value = "";
    this._shadowRoot.querySelector("#body").value = "";
  }

  setupEventListeners() {
    const titleInput = this._shadowRoot.querySelector("#title");
    const bodyInput = this._shadowRoot.querySelector("#body");

    titleInput.addEventListener("input", this.customValidationTitleHandler);
    bodyInput.addEventListener("input", this.customValidationBodyHandler);
  }

  customValidationTitleHandler(event) {
    const titleInput = event.target;
    const titleValidationMessage =
      this._shadowRoot.querySelector("#titleValidation");

    if (!titleInput.value.trim()) {
      titleValidationMessage.innerText = "Title is required.";
    } else {
      titleValidationMessage.innerText = "";
    }
  }

  customValidationBodyHandler(event) {
    const bodyInput = event.target;
    const bodyValidationMessage =
      this._shadowRoot.querySelector("#bodyValidation");

    if (!bodyInput.value.trim()) {
      bodyValidationMessage.innerText = "Body is required.";
    } else {
      bodyValidationMessage.innerText = "";
    }
  }
}

customElements.define("notes-form", NotesForm);
