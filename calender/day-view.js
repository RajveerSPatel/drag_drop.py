// Read the date from the URL
const params = new URLSearchParams(window.location.search);
const selectedDate = params.get("date");

document.getElementById("date-title").textContent = selectedDate;

// Load stored lessons + schedule
const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
const schedule = JSON.parse(localStorage.getItem("schedule")) || {};

let todaysLessons = schedule[selectedDate] || [];


// Render the lessons already assigned to this date
function renderDayLessons() {
  const container = document.getElementById("day-lessons");
  container.innerHTML = "";

  todaysLessons.forEach(id => {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;

    const item = document.createElement("div");
    item.textContent = lesson.title;
    container.appendChild(item);
  });
}


// Add a lesson to this date
function addLesson(id) {
  if (!todaysLessons.includes(id)) {
    todaysLessons.push(id);
  }

  schedule[selectedDate] = todaysLessons;
  localStorage.setItem("schedule", JSON.stringify(schedule));

  renderDayLessons();
}


// Render the list of all lessons so the user can add them
function renderChooseLesson() {
  const picker = document.getElementById("choose-lesson");
  picker.innerHTML = "";

  lessons.forEach(lesson => {
    const btn = document.createElement("button");
    btn.textContent = lesson.title;
    btn.onclick = () => addLesson(lesson.id);
    picker.appendChild(btn);
  });
}


// Initial load
renderDayLessons();
renderChooseLesson();