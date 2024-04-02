class NotesList extends HTMLElement {
  constructor() {
    super();

    this.render();
  }
  render() {
    this.innerHTML += `
      <section tabindex="0" id="listNote" class="note-list"></section>
      `;
  }
}

customElements.define("notes-list", NotesList);
