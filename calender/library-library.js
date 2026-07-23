/*
  Lesson Library

  This page displays every lesson stored in localStorage.
  The search box makes it easier to find lessons quickly.
*/

function getLessons() {
  try {
    return JSON.parse(localStorage.getItem("lessons")) || [];
  } catch {
    return [];
  }
}

function saveLessons(lessons) {
  localStorage.setItem(
    "lessons",
    JSON.stringify(lessons)
  );
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ---------------------------------------------------------
   DISPLAY LESSONS
   --------------------------------------------------------- */

function renderLessons(searchText = "") {

  const grid =
    document.getElementById("lesson-grid");

  const lessons = getLessons();

  const search =
    searchText.toLowerCase().trim();

  const filtered =
    lessons.filter(lesson => {

      return (
        lesson.title?.toLowerCase().includes(search) ||
        lesson.subject?.toLowerCase().includes(search) ||
        lesson.year?.toLowerCase().includes(search)
      );

    });

  grid.innerHTML = "";

  if (filtered.length === 0) {

    grid.innerHTML = `
      <div class="empty-state">
        No lessons found.
        <br><br>
        Create a new lesson to get started.
      </div>
    `;

    return;
  }

  filtered.forEach(lesson => {

    const card =
      document.createElement("div");

    card.className = "lesson-card";

    card.innerHTML = `
      <h3>${escapeHTML(lesson.title)}</h3>

      <p>
        <strong>Year:</strong>
        ${escapeHTML(lesson.year || "Other")}
      </p>

      <p>
        <strong>Subject:</strong>
        ${escapeHTML(lesson.subject || "Not specified")}
      </p>

      <p>
        ${escapeHTML(
          lesson.description ||
          "No description provided."
        )}
      </p>

      <div class="lesson-card-actions">

        <button class="edit-button">
          Edit
        </button>

        <button class="danger delete-button">
          Delete
        </button>

      </div>
    `;

    card
      .querySelector(".edit-button")
      .addEventListener("click", () => {

        window.location.href =
          `lesson-creator.html?id=${lesson.id}`;

      });

    card
      .querySelector(".delete-button")
      .addEventListener("click", () => {

        const confirmed =
          confirm(
            `Delete "${lesson.title}"?`
          );

        if (!confirmed) return;

        deleteLesson(lesson.id);

      });

    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------
   DELETE LESSON
   --------------------------------------------------------- */

function deleteLesson(id) {

  let lessons = getLessons();

  lessons =
    lessons.filter(
      lesson =>
        String(lesson.id) !== String(id)
    );

  saveLessons(lessons);

  /* Also remove the lesson from any scheduled days */
  let schedule;

  try {
    schedule =
      JSON.parse(
        localStorage.getItem("schedule")
      ) || {};
  } catch {
    schedule = {};
  }

  Object.keys(schedule).forEach(date => {

    schedule[date] =
      schedule[date].filter(
        lessonId =>
          String(lessonId) !== String(id)
      );

  });

  localStorage.setItem(
    "schedule",
    JSON.stringify(schedule)
  );

  renderLessons(
    document.getElementById("search").value
  );
}

/* ---------------------------------------------------------
   SEARCH
   --------------------------------------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderLessons();

    document
      .getElementById("search")
      .addEventListener(
        "input",
        event => {

          renderLessons(
            event.target.value
          );

        }
      );

  }
);