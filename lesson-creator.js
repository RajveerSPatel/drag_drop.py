function loadLessons() {
  return JSON.parse(localStorage.getItem("lessons")) || [];
}

function saveLessons(lessons) {
  localStorage.setItem("lessons", JSON.stringify(lessons));
}

document.getElementById("save-lesson").onclick = () => {
  const title = document.getElementById("lesson-title").value.trim();
  const desc = document.getElementById("lesson-desc").value.trim();

  if (!title) {
    alert("Please enter a lesson title.");
    return;
  }

  const lessons = loadLessons();

  const lesson = {
    id: Date.now(),
    title,
    description: desc
  };

  lessons.push(lesson);
  saveLessons(lessons);

  alert("Lesson saved.");
  document.getElementById("lesson-title").value = "";
  document.getElementById("lesson-desc").value = "";
};