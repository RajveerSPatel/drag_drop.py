// Get elements
const calendarGrid = document.getElementById("calendar-grid");
const yearGrid = document.getElementById("year-grid");
const monthTitle = document.getElementById("month-title");

// Selected month/year
let selYear = 2026;
let selMonth = 2; // 0 = Jan

// Month view generator
function genCalendar(year, month) {
  calendarGrid.innerHTML = "";

  const date = new Date(year, month);
  const monthName = date.toLocaleString("default", { month: "long" });

  monthTitle.textContent = `${monthName} ${year}`;

  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Add blank cells before day 1
  for (let i = 0; i < firstWeekday; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty";
    calendarGrid.appendChild(emptyCell);
  }

  // Add actual days
  for (let dayNumber = 1; dayNumber <= totalDaysInMonth; dayNumber++) {
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    dayCell.textContent = dayNumber;
    calendarGrid.appendChild(dayCell);
  }
}

// Year view generator
function genYear(year) {
  yearGrid.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const monthBox = document.createElement("div");
    monthBox.className = "month-box";

    const monthName = new Date(year, month).toLocaleString("default", { month: "long" });
    monthBox.innerHTML = `<h3>${monthName}</h3>`;

    const miniGrid = document.createElement("div");
    miniGrid.className = "mini-grid";

    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // empty cells
    for (let i = 0; i < firstWeekday; i++) {
      miniGrid.appendChild(document.createElement("div"));
    }

    // numbered days
    for (let d = 1; d <= totalDays; d++) {
      const day = document.createElement("div");
      day.textContent = d;
      miniGrid.appendChild(day);
    }

    monthBox.appendChild(miniGrid);
    yearGrid.appendChild(monthBox);
  }
}

// View buttons
document.getElementById("view-month").onclick = () => {
  calendarGrid.style.display = "grid";
  yearGrid.style.display = "none";
  genCalendar(selYear, selMonth);
};

document.getElementById("view-year").onclick = () => {
  calendarGrid.style.display = "none";
  yearGrid.style.display = "block";
  genYear(selYear);
};

// 6. Month navigation
document.getElementById("prev").onclick = () => {
  selMonth--;
  if (selMonth < 0) {
    selMonth = 11;
    selYear--;
  }
  genCalendar(selYear, selMonth);
};

document.getElementById("next").onclick = () => {
  selMonth++;
  if (selMonth > 11) {
    selMonth = 0;
    selYear++;
  }
  genCalendar(selYear, selMonth);
};

// 7. Start on current month
genCalendar(selYear, selMonth);
