function main() {
  const baseUrl = "https://notes-api.dicoding.dev/v2";

  const getNonarchivedNote = async () => {
    try {
      showLoading();
      const response = await fetch(`${baseUrl}/notes`);
      const responseJson = await response.json();

      if (responseJson.data.length > 0) {
        renderAllNotes(responseJson.data);
      } else {
        showResponseMessage("Tidak ada catatan untuk ditampilkan");
        renderAllNotes(responseJson.data);
      }
    } catch (error) {
      showResponseMessage(error);
    } finally {
      hideLoading();
    }
  };

  const getArchivedNote = async () => {
    try {
      showLoading();
      const response = await fetch(`${baseUrl}/notes/archived`);
      const responseJson = await response.json();

      if (responseJson.data.length > 0) {
        renderAllNotes(responseJson.data);
      } else {
        showResponseMessage("Tidak ada catatan untuk ditampilkan");
        renderAllNotes(responseJson.notes);
      }
    } catch (error) {
      showResponseMessage(error);
    } finally {
      hideLoading();
    }
  };

  const insertNote = async (note) => {
    try {
      showLoading();
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      };
      const response = await fetch(`${baseUrl}/notes`, options);
      const responseJson = await response.json();
      showResponseMessage(responseJson.message);
      getNonarchivedNote();
    } catch (error) {
      showResponseMessage(error);
    } finally {
      hideLoading();
    }
  };

  const removeNote = (noteId) => {
    showLoading();
    fetch(`${baseUrl}/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        showResponseMessage(responseJson.message);
        if (sortNotes.selectedIndex == 0) {
          getNonarchivedNote();
        } else {
          getArchivedNote();
        }
      })
      .catch((error) => {
        showResponseMessage(error);
      })
      .finally(() => {
        hideLoading();
      });
  };

  const ArchiveNote = async (id) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(`${baseUrl}/notes/${id}/archive`, options);
      const responseJson = await response.json();
      showResponseMessage(responseJson.message);
      getNonarchivedNote();
    } catch (error) {
      showResponseMessage(error);
    }
  };

  const NonarchiveNote = async (id) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(`${baseUrl}/notes/${id}/unarchive`, options);
      const responseJson = await response.json();
      showResponseMessage(responseJson.message);
      getArchivedNote();
    } catch (error) {
      showResponseMessage(error);
    }
  };

  const renderAllNotes = (notes) => {
    const listNoteElement = document.querySelector("#listNote");
    listNoteElement.innerHTML = "";

    notes.forEach((note) => {
      const noteItem = document.createElement("div");
      noteItem.classList.add("note-item");
      noteItem.setAttribute("tabindex", "0");

      const textTitle = document.createElement("h2");
      textTitle.innerText = note.title;

      const textBody = document.createElement("p");
      textBody.innerText = note.body;

      const archivedButton = document.createElement("button");
      archivedButton.setAttribute("type", "button");

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");
      trashButton.setAttribute("type", "button");
      trashButton.addEventListener("click", function () {
        const confirmation = confirm(
          "Are you sure you want to delete this note?",
        );
        if (confirmation) {
          removeNote(note.id);
        }
      });

      if (note.archived) {
        archivedButton.classList.add("non-archived-button");
        archivedButton.addEventListener("click", function () {
          NonarchiveNote(note.id);
        });
      } else {
        archivedButton.classList.add("archived-button");
        archivedButton.addEventListener("click", function () {
          ArchiveNote(note.id);
        });
      }

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("action");
      buttonContainer.append(archivedButton, trashButton);

      noteItem.append(textTitle, textBody, buttonContainer);
      listNoteElement.appendChild(noteItem);
    });
  };

  const showResponseMessage = (message = "Check your internet connection") => {
    alert(message);
  };

  document.addEventListener("DOMContentLoaded", () => {
    getNonarchivedNote();
    sortNotes.selectedIndex = 0;
  });

  document.addEventListener("insertNote", function (event) {
    const { title, body } = event.detail;

    const newNote = {
      title: title,
      body: body,
    };

    insertNote(newNote);
    sortNotes.selectedIndex = 0;
  });

  const showLoading = () => {
    document.getElementById("loading").style.display = "block";
  };

  const hideLoading = () => {
    document.getElementById("loading").style.display = "none";
  };

  const sortNotes = document.getElementById("sortNotes");
  sortNotes.addEventListener("change", function () {
    if (sortNotes.selectedIndex == 0) {
      getNonarchivedNote();
    } else {
      getArchivedNote();
    }
  });
}

export default main;
