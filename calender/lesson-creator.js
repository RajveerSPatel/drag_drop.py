/*
  Lesson Creator

  This page handles both:
  - Creating a new lesson
  - Editing an existing lesson

  If the URL contains an ID, for example:
  lesson-creator.html?id=12345

  the matching lesson is loaded for editing.
*/

const params =
  new URLSearchParams(
    window.location.search
  );

const editId =
  params.get("id");

let editingLesson = null;

/* ---------------------------------------------------------
   DATA HELPERS
   --------------------------------------------------------- */

function getLessons() {

  try {

    return JSON.parse(
      localStorage.getItem("lessons")
    ) || [];

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

/* ---------------------------------------------------------
   LOAD LESSON FOR EDITING
   --------------------------------------------------------- */

function loadEditingLesson() {

  if (!editId) return;

  const lessons =
    getLessons();

  editingLesson =
    lessons.find(
      lesson =>
        String(lesson.id) ===
        String(editId)
    );

  if (!editingLesson) return;

  document.getElementById(
    "form-title"
  ).textContent =
    "Edit Lesson";

  document.getElementById(
    "title"
  ).value =
    editingLesson.title || "";

  document.getElementById(
    "subject"
  ).value =
    editingLesson.subject || "";

  document.getElementById(
    "year"
  ).value =
    editingLesson.year || "";

  document.getElementById(
    "duration"
  ).value =
    editingLesson.duration || "";

  document.getElementById(
    "type"
  ).value =
    editingLesson.type || "";

  document.getElementById(
    "description"
  ).value =
    editingLesson.description || "";

  document.getElementById(
    "notes"
  ).value =
    editingLesson.notes || "";
}

/* ---------------------------------------------------------
   SAVE LESSON
   --------------------------------------------------------- */

function saveLesson(event) {

  event.preventDefault();

  const title =
    document
      .getElementById("title")
      .value
      .trim();

  if (!title) {

    alert(
      "Please enter a lesson title."
    );

    return;

  }

  const lesson = {

    id:
      editingLesson
        ? editingLesson.id
        : Date.now(),

    title,

    subject:
      document
        .getElementById("subject")
        .value
        .trim(),

    year:
      document
        .getElementById("year")
        .value,

    duration:
      document
        .getElementById("duration")
        .value
        .trim(),

    type:
      document
        .getElementById("type")
        .value,

    description:
      document
        .getElementById("description")
        .value
        .trim(),

    notes:
      document
        .getElementById("notes")
        .value
        .trim(),

    updatedAt:
      new Date().toISOString()

  };

  let lessons =
    getLessons();

  if (editingLesson) {

    lessons =
      lessons.map(
        existing => {

          if (
            String(existing.id) ===
            String(editingLesson.id)
          ) {

            return {
              ...existing,
              ...lesson
            };

          }

          return existing;

        }
      );

  } else {

    lesson.createdAt =
      new Date().toISOString();

    lessons.push(lesson);

  }

  saveLessons(lessons);

  alert(
    editingLesson
      ? "Lesson updated successfully."
      : "Lesson created successfully."
  );

  /* Return to the lesson library */
  window.location.href =
    "lesson-library.html";
}

/* ---------------------------------------------------------
   START PAGE
   --------------------------------------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadEditingLesson();

    document
      .getElementById("lesson-form")
      .addEventListener(
        "submit",
        saveLesson
      );

  }
);