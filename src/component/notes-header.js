class NotesHeader extends HTMLElement {
  constructor() {
    super();

    this.render();
  }
  render() {
    this.innerHTML += `
      <header class="head_bar">
      <h1>Aplikasi Pembuat Catatan</h1>
      </header>
      `;
  }
}

customElements.define("notes-header", NotesHeader);
