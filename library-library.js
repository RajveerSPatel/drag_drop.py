function loadLessons() {
  return JSON.parse(localStorage.getItem("lessons")) || [];
}

const lessons = loadLessons();
const list = document.getElementById("lesson-list");
list.innerHTML = "";

if (lessons.length === 0) {
  list.textContent = "No lessons saved yet.";
} else {
  lessons.forEach(lesson => {
    const div = document.createElement("div");
    div.textContent = lesson.title;
    list.appendChild(div);
  });
}