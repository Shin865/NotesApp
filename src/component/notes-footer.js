class NotesFooter extends HTMLElement {
  constructor() {
    super();

    this.render();
  }
  render() {
    this.innerHTML += `
      <footer>
      <p>M Safri Syamsudin || AMIKOM Yogyakarta || 2024</p>
      </footer>
      `;
  }
}

customElements.define("notes-footer", NotesFooter);
