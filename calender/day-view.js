/*
  Day View

  This page receives a date from the calendar using:
  day-view.html?date=YYYY-MM-DD

  Lessons are stored in localStorage so the calendar,
  lesson library and day view all use the same information.
*/

const params = new URLSearchParams(window.location.search);

let selectedDate = params.get("date");

if (!selectedDate) {
  selectedDate = new Date().toISOString().split("T")[0];
}

/* ---------------------------------------------------------
   DATA HELPERS
   --------------------------------------------------------- */

function getLessons() {
  try {
    return JSON.parse(localStorage.getItem("lessons")) || [];
  } catch {
    return [];
  }
}

function getSchedule() {
  try {
    return JSON.parse(localStorage.getItem("schedule")) || {};
  } catch {
    return {};
  }
}

function saveSchedule(schedule) {
  localStorage.setItem("schedule", JSON.stringify(schedule));
}

function getYearClass(year) {
  const cleanYear = String(year || "").replace(/\D/g, "");

  if (["7", "8", "9", "10", "11", "12"].includes(cleanYear)) {
    return `year-${cleanYear}`;
  }

  return "year-other";
}

/* ---------------------------------------------------------
   DATE INFORMATION
   --------------------------------------------------------- */

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* ---------------------------------------------------------
   RENDER THE DAY
   --------------------------------------------------------- */

function renderDay() {
  document.getElementById("date-title").textContent =
    formatDate(selectedDate);

  const lessons = getLessons();
  const schedule = getSchedule();

  const lessonIds = schedule[selectedDate] || [];

  const board = document.getElementById("schedule-board");

  board.innerHTML = "";

  if (lessonIds.length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        No lessons have been added to this day yet.
      </div>
    `;
  }

  lessonIds.forEach((lessonId, index) => {

    const lesson = lessons.find(
      item => String(item.id) === String(lessonId)
    );

    if (!lesson) return;

    const item = document.createElement("div");

    item.className =
      `schedule-item ${getYearClass(lesson.year)}`;

    item.draggable = true;

    item.dataset.index = index;

    item.innerHTML = `
      <div class="drag-handle">☰</div>

      <div class="schedule-content">
        <div class="schedule-title">
          ${escapeHTML(lesson.title)}
        </div>

        <div class="schedule-meta">
          Year ${escapeHTML(lesson.year || "Other")}
          ${lesson.subject ? " • " + escapeHTML(lesson.subject) : ""}
          ${lesson.duration ? " • " + escapeHTML(lesson.duration) : ""}
        </div>
      </div>

      <button class="remove-lesson" data-id="${lesson.id}">
        Remove
      </button>
    `;

    /* Remove button */
    item
      .querySelector(".remove-lesson")
      .addEventListener("click", event => {
        event.stopPropagation();
        removeLesson(lesson.id);
      });

    /* Start dragging */
    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
    });

    board.appendChild(item);
  });

  setupDragAndDrop();

  renderLessonOptions();
}

/* ---------------------------------------------------------
   DRAG AND DROP
   --------------------------------------------------------- */

function setupDragAndDrop() {
  const board = document.getElementById("schedule-board");

  board.addEventListener("dragover", event => {
    event.preventDefault();

    const dragging = board.querySelector(".dragging");

    if (!dragging) return;

    const afterElement = getDragAfterElement(
      board,
      event.clientY
    );

    if (!afterElement) {
      board.appendChild(dragging);
    } else {
      board.insertBefore(dragging, afterElement);
    }
  });

  board.addEventListener("drop", () => {
    saveNewOrder();
  });
}

function getDragAfterElement(container, y) {
  const elements = [
    ...container.querySelectorAll(
      ".schedule-item:not(.dragging)"
    )
  ];

  return elements.reduce(
    (closest, child) => {

      const box = child.getBoundingClientRect();

      const offset =
        y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return {
          offset,
          element: child
        };
      }

      return closest;

    },
    {
      offset: Number.NEGATIVE_INFINITY,
      element: null
    }
  ).element;
}

function saveNewOrder() {
  const schedule = getSchedule();

  const items = [
    ...document.querySelectorAll(".schedule-item")
  ];

  schedule[selectedDate] = items.map(
    item => {
      const title = item.querySelector(".remove-lesson");

      return title.dataset.id;
    }
  );

  saveSchedule(schedule);
}

/* ---------------------------------------------------------
   ADD AND REMOVE LESSONS
   --------------------------------------------------------- */

function addLesson(lessonId) {
  const schedule = getSchedule();

  if (!schedule[selectedDate]) {
    schedule[selectedDate] = [];
  }

  if (
    !schedule[selectedDate].some(
      id => String(id) === String(lessonId)
    )
  ) {
    schedule[selectedDate].push(lessonId);
  }

  saveSchedule(schedule);

  renderDay();
}

function removeLesson(lessonId) {
  const schedule = getSchedule();

  if (!schedule[selectedDate]) return;

  schedule[selectedDate] =
    schedule[selectedDate].filter(
      id => String(id) !== String(lessonId)
    );

  saveSchedule(schedule);

  renderDay();
}

function renderLessonOptions() {
  const container =
    document.getElementById("lesson-options");

  const lessons = getLessons();

  const schedule = getSchedule();

  const currentIds =
    schedule[selectedDate] || [];

  container.innerHTML = "";

  if (lessons.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        You don't have any lessons yet.
        <br><br>
        Create a lesson in the Lesson Creator first.
      </div>
    `;

    return;
  }

  lessons.forEach(lesson => {

    const alreadyAdded =
      currentIds.some(
        id => String(id) === String(lesson.id)
      );

    const option =
      document.createElement("div");

    option.className = "lesson-option";

    option.innerHTML = `
      <div class="lesson-option-info">
        <div class="lesson-option-title">
          ${escapeHTML(lesson.title)}
        </div>

        <div class="lesson-option-meta">
          Year ${escapeHTML(lesson.year || "Other")}
          ${lesson.subject ? " • " + escapeHTML(lesson.subject) : ""}
        </div>
      </div>

      <button ${alreadyAdded ? "disabled" : ""}>
        ${alreadyAdded ? "Added" : "Add"}
      </button>
    `;

    if (!alreadyAdded) {
      option
        .querySelector("button")
        .addEventListener("click", () => {
          addLesson(lesson.id);
        });
    }

    container.appendChild(option);
  });
}

/* Small helper to safely display user-entered text */
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", renderDay);