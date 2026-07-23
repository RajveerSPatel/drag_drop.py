/*
  Calendar page logic.

  The calendar has three views:
  - Month
  - Term
  - Year

  The calendar and day view communicate through the URL.
  For example:
  day-view.html?date=2026-07-23
*/

let currentDate = new Date();
let currentView = "month";

const monthNames = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

/* ---------------------------------------------------------
   NSW SCHOOL HOLIDAYS
   --------------------------------------------------------- */

const schoolHolidays = [
  ["2025-04-14", "2025-04-24"],
  ["2025-07-07", "2025-07-18"],
  ["2025-09-29", "2025-10-10"],
  ["2025-12-22", "2026-01-26"],

  ["2026-04-07", "2026-04-17"],
  ["2026-07-06", "2026-07-17"],
  ["2026-09-28", "2026-10-09"],
  ["2026-12-18", "2027-01-27"],

  ["2027-04-01", "2027-04-16"],
  ["2027-07-05", "2027-07-16"]
];

/* ---------------------------------------------------------
   NSW PUBLIC HOLIDAYS
   --------------------------------------------------------- */

const publicHolidays = {
  "2025-01-01": "New Year's Day",
  "2025-01-27": "Australia Day",
  "2025-04-18": "Good Friday",
  "2025-04-19": "Easter Saturday",
  "2025-04-20": "Easter Sunday",
  "2025-04-21": "Easter Monday",
  "2025-04-25": "Anzac Day",
  "2025-06-09": "King's Birthday",
  "2025-08-04": "Bank Holiday",
  "2025-10-06": "Labour Day",
  "2025-12-25": "Christmas Day",
  "2025-12-26": "Boxing Day",

  "2026-01-01": "New Year's Day",
  "2026-01-26": "Australia Day",
  "2026-04-03": "Good Friday",
  "2026-04-04": "Easter Saturday",
  "2026-04-05": "Easter Sunday",
  "2026-04-06": "Easter Monday",
  "2026-04-25": "Anzac Day",
  "2026-04-27": "Anzac Day Additional",
  "2026-06-08": "King's Birthday",
  "2026-08-03": "Bank Holiday",
  "2026-10-05": "Labour Day",
  "2026-12-25": "Christmas Day",
  "2026-12-26": "Boxing Day",
  "2026-12-28": "Boxing Day Additional",

  "2027-01-01": "New Year's Day",
  "2027-01-26": "Australia Day",
  "2027-03-26": "Good Friday",
  "2027-03-27": "Easter Saturday",
  "2027-03-28": "Easter Sunday",
  "2027-03-29": "Easter Monday",
  "2027-04-25": "Anzac Day",
  "2027-04-26": "Anzac Day Additional",
  "2027-06-14": "King's Birthday",
  "2027-08-02": "Bank Holiday",
  "2027-10-04": "Labour Day",
  "2027-12-25": "Christmas Day",
  "2027-12-26": "Boxing Day",
  "2027-12-27": "Christmas Day Additional",
  "2027-12-28": "Boxing Day Additional"
};

/* ---------------------------------------------------------
   NSW SCHOOL TERMS
   --------------------------------------------------------- */

const terms = [
  { name: "Term 1 2025", start: "2025-02-06", end: "2025-04-11" },
  { name: "Term 2 2025", start: "2025-04-28", end: "2025-07-04" },
  { name: "Term 3 2025", start: "2025-07-22", end: "2025-09-26" },
  { name: "Term 4 2025", start: "2025-10-13", end: "2025-12-19" },

  { name: "Term 1 2026", start: "2026-02-02", end: "2026-04-02" },
  { name: "Term 2 2026", start: "2026-04-22", end: "2026-07-03" },
  { name: "Term 3 2026", start: "2026-07-21", end: "2026-09-25" },
  { name: "Term 4 2026", start: "2026-10-13", end: "2026-12-17" },

  { name: "Term 1 2027", start: "2027-02-01", end: "2027-04-01" },
  { name: "Term 2 2027", start: "2027-04-19", end: "2027-07-02" },
  { name: "Term 3 2027", start: "2027-07-19", end: "2027-09-24" },
  { name: "Term 4 2027", start: "2027-10-11", end: "2027-12-16" }
];

/* ---------------------------------------------------------
   BASIC HELPERS
   --------------------------------------------------------- */

function dateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSchoolHoliday(dateString) {
  return schoolHolidays.some(period => {
    return dateString >= period[0] && dateString <= period[1];
  });
}

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

function getYearClass(year) {
  if (!year) return "year-other";

  const cleanYear = String(year).replace(/\D/g, "");

  if (["7", "8", "9", "10", "11", "12"].includes(cleanYear)) {
    return `year-${cleanYear}`;
  }

  return "year-other";
}

function isToday(date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/* ---------------------------------------------------------
   OPEN DAY VIEW
   --------------------------------------------------------- */

function openDay(dateString) {
  window.location.href = `day-view.html?date=${dateString}`;
}

/* ---------------------------------------------------------
   RENDER MONTH
   --------------------------------------------------------- */

function renderMonth() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navTitle = document.getElementById("nav-title");
  const calendarGrid = document.getElementById("calendar-grid");

  navTitle.textContent = `${monthNames[month]} ${year}`;
  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const lessons = getLessons();
  const schedule = getSchedule();

  /* Add blank spaces before the first day */
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day-cell empty";
    calendarGrid.appendChild(empty);
  }

  /* Build every day in the month */
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = dateToString(date);

    const cell = document.createElement("div");
    cell.className = "day-cell";

    if (date.getDay() === 0 || date.getDay() === 6) {
      cell.classList.add("weekend");
    }

    const schoolHoliday = isSchoolHoliday(dateString);
    const publicHoliday = publicHolidays[dateString];

    if (schoolHoliday) {
      cell.classList.add("school-holiday");
    }

    if (publicHoliday) {
      cell.classList.add("public-holiday");
    }

    if (isToday(date)) {
      cell.classList.add("today");
    }

    cell.addEventListener("click", () => {
      openDay(dateString);
    });

    const number = document.createElement("div");
    number.className = "day-number";
    number.textContent = day;

    cell.appendChild(number);

    /* Show holiday name if there is one */
    if (publicHoliday) {
      const holiday = document.createElement("div");
      holiday.className = "holiday-label";
      holiday.textContent = publicHoliday;
      cell.appendChild(holiday);
    } else if (schoolHoliday) {
      const holiday = document.createElement("div");
      holiday.className = "holiday-label";
      holiday.textContent = "School holiday";
      cell.appendChild(holiday);
    }

    /* Display up to three lessons inside the day */
    const lessonIds = schedule[dateString] || [];

    lessonIds.slice(0, 3).forEach(id => {
      const lesson = lessons.find(item => String(item.id) === String(id));

      if (!lesson) return;

      const lessonElement = document.createElement("div");

      lessonElement.className =
        `calendar-lesson ${getYearClass(lesson.year)}`;

      lessonElement.textContent = lesson.title;

      cell.appendChild(lessonElement);
    });

    calendarGrid.appendChild(cell);
  }
}

/* ---------------------------------------------------------
   RENDER TERM
   --------------------------------------------------------- */

function renderTerm() {
  const termGrid = document.getElementById("term-grid");

  termGrid.innerHTML = "";

  const year = currentDate.getFullYear();

  let term = terms.find(item => {
    return year >= Number(item.start.substring(0, 4)) &&
      currentDate >= new Date(item.start) &&
      currentDate <= new Date(item.end);
  });

  if (!term) {
    term = terms.find(item =>
      Number(item.start.substring(0, 4)) === year
    );
  }

  if (!term) {
    term = terms[0];
  }

  document.getElementById("nav-title").textContent = term.name;

  const header = document.createElement("div");
  header.className = "term-header";

  const title = document.createElement("h2");
  title.textContent = term.name;

  const dates = document.createElement("p");
  dates.textContent = `${term.start} to ${term.end}`;

  header.appendChild(title);
  header.appendChild(dates);

  termGrid.appendChild(header);

  const start = new Date(term.start);
  const end = new Date(term.end);

  /* Move back to Monday so the term is displayed week by week */
  const firstMonday = new Date(start);

  const day = firstMonday.getDay();

  if (day === 0) {
    firstMonday.setDate(firstMonday.getDate() - 6);
  } else {
    firstMonday.setDate(firstMonday.getDate() - (day - 1));
  }

  let weekNumber = 1;

  while (firstMonday <= end) {
    const week = document.createElement("div");
    week.className = "term-week";

    const weekLabel = document.createElement("div");
    weekLabel.className = "term-week-label";
    weekLabel.textContent = `Week ${weekNumber}`;

    week.appendChild(weekLabel);

    for (let i = 0; i < 5; i++) {
      const date = new Date(firstMonday);
      date.setDate(firstMonday.getDate() + i);

      const dateString = dateToString(date);

      const dayCell = document.createElement("div");
      dayCell.className = "term-day";

      if (dateString < term.start || dateString > term.end) {
        dayCell.classList.add("school-holiday");
      }

      if (publicHolidays[dateString]) {
        dayCell.classList.add("public-holiday");
      }

      const number = document.createElement("div");
      number.className = "term-day-number";
      number.textContent =
        `${date.getDate()} ${monthNames[date.getMonth()].substring(0, 3)}`;

      dayCell.appendChild(number);

      dayCell.addEventListener("click", () => {
        openDay(dateString);
      });

      week.appendChild(dayCell);
    }

    termGrid.appendChild(week);

    firstMonday.setDate(firstMonday.getDate() + 7);
    weekNumber++;
  }
}

/* ---------------------------------------------------------
   RENDER YEAR
   --------------------------------------------------------- */

function renderYear() {
  const yearGrid = document.getElementById("year-grid");

  const year = currentDate.getFullYear();

  document.getElementById("nav-title").textContent = year;

  yearGrid.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const box = document.createElement("div");
    box.className = "mini-month";

    const title = document.createElement("div");
    title.className = "mini-title";
    title.textContent = monthNames[month];

    box.appendChild(title);

    const weekdays = document.createElement("div");
    weekdays.className = "mini-weekdays";

    ["S", "M", "T", "W", "T", "F", "S"].forEach(day => {
      const element = document.createElement("div");
      element.textContent = day;
      weekdays.appendChild(element);
    });

    box.appendChild(weekdays);

    const days = document.createElement("div");
    days.className = "mini-days";

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateString = dateToString(date);

      const dayElement = document.createElement("div");

      dayElement.textContent = day;

      if (isSchoolHoliday(dateString)) {
        dayElement.classList.add("mini-school-holiday");
      }

      if (publicHolidays[dateString]) {
        dayElement.classList.add("mini-public-holiday");
      }

      if (isToday(date)) {
        dayElement.classList.add("mini-today");
      }

      dayElement.addEventListener("click", () => {
        openDay(dateString);
      });

      days.appendChild(dayElement);
    }

    box.appendChild(days);

    yearGrid.appendChild(box);
  }
}

/* ---------------------------------------------------------
   SWITCH BETWEEN VIEWS
   --------------------------------------------------------- */

function switchView(view) {
  currentView = view;

  const monthView = document.getElementById("month-view");
  const termGrid = document.getElementById("term-grid");
  const yearGrid = document.getElementById("year-grid");

  const monthButton = document.getElementById("view-month");
  const termButton = document.getElementById("view-term");
  const yearButton = document.getElementById("view-year");

  /* Hide everything first */
  monthView.style.display = "none";
  termGrid.style.display = "none";
  yearGrid.style.display = "none";

  monthButton.classList.remove("active");
  termButton.classList.remove("active");
  yearButton.classList.remove("active");

  if (view === "month") {
    monthView.style.display = "block";
    monthButton.classList.add("active");
    renderMonth();
  }

  if (view === "term") {
    termGrid.style.display = "block";
    termButton.classList.add("active");
    renderTerm();
  }

  if (view === "year") {
    yearGrid.style.display = "grid";
    yearButton.classList.add("active");
    renderYear();
  }
}

/* ---------------------------------------------------------
   NAVIGATION
   --------------------------------------------------------- */

function navigate(direction) {
  if (currentView === "month") {
    currentDate.setMonth(currentDate.getMonth() + direction);
  }

  if (currentView === "term") {
    currentDate.setMonth(currentDate.getMonth() + direction * 3);
  }

  if (currentView === "year") {
    currentDate.setFullYear(currentDate.getFullYear() + direction);
  }

  renderCurrentView();
}

function renderCurrentView() {
  if (currentView === "month") renderMonth();
  if (currentView === "term") renderTerm();
  if (currentView === "year") renderYear();
}

/* ---------------------------------------------------------
   START THE CALENDAR
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  document
    .getElementById("view-month")
    .addEventListener("click", () => switchView("month"));

  document
    .getElementById("view-term")
    .addEventListener("click", () => switchView("term"));

  document
    .getElementById("view-year")
    .addEventListener("click", () => switchView("year"));

  document
    .getElementById("prev")
    .addEventListener("click", () => navigate(-1));

  document
    .getElementById("next")
    .addEventListener("click", () => navigate(1));

  document
    .getElementById("go-today")
    .addEventListener("click", () => {
      currentDate = new Date();
      renderCurrentView();
    });

  switchView("month");
});