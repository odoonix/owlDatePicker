// Get the date picker input element
const datepicker = document.getElementById("datepicker");

// Function to format the selected date
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Function to open the date picker
function openDatePicker() {
  const currentDate = new Date();
  const datePickerContainer = document.createElement("div");
  datePickerContainer.className = "date-picker-container";

  // Create the calendar header
  const header = document.createElement("div");
  header.className = "header";
  const prevButton = document.createElement("span");
  prevButton.innerHTML = "&#10094;";
  prevButton.className = "prev";
  prevButton.addEventListener("click", showPreviousMonth);
  const nextButton = document.createElement("span");
  nextButton.innerHTML = "&#10095;";
  nextButton.className = "next";
  nextButton.addEventListener("click", showNextMonth);
  const monthYear = document.createElement("span");
  monthYear.className = "month-year";
  header.appendChild(prevButton);
  header.appendChild(monthYear);
  header.appendChild(nextButton);

  // Create the calendar table
  const table = document.createElement("table");
  table.className = "calendar";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdaysRow = document.createElement("tr");
  weekdays.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = day;
    weekdaysRow.appendChild(th);
  });
  table.appendChild(weekdaysRow);

  // Function to show the calendar for the selected month
  function showCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const tbody = document.createElement("tbody");
    while (startDate <= endDate) {
      const row = document.createElement("tr");
      for (let i = 0; i < 7; i++) {
        const cell = document.createElement("td");
        if (startDate.getMonth() === month) {
          cell.textContent = startDate.getDate();
          cell.addEventListener("click", selectDate);
        }
        row.appendChild(cell);
        startDate.setDate(startDate.getDate() + 1);
      }
      tbody.appendChild(row);
    }

    // Update the month and year in the header
    monthYear.textContent = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(firstDay);
    table.appendChild(tbody);
  }

  // Function to show the previous month
  function showPreviousMonth() {
    clearCalendar();
    currentDate.setMonth(currentDate.getMonth() - 1);
    showCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }

  // Function to show the next month
  function showNextMonth() {
    clearCalendar();
    currentDate.setMonth(currentDate.getMonth() + 1);
    showCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }

  // Function to select a date
  function selectDate(event) {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      event.target.textContent
    );
    datepicker.value = formatDate(selectedDate);
    closeDatePicker();
  }

  // Function to clear the calendar
  function clearCalendar() {
    while (table.tBodies.length > 0) {
      table.removeChild(table.tBodies[0]);
    }
  }

  // Function to close the date picker
  function closeDatePicker() {
    datePickerContainer.remove();
    document.removeEventListener("click", handleOutsideClick);
  }

  // Append the calendar to the date picker container
  datePickerContainer.appendChild(header);
  datePickerContainer.appendChild(table);

  // Show the calendar for the current month
  showCalendar(currentDate.getFullYear(), currentDate.getMonth());

  // Append the date picker container to the body
  document.body.appendChild(datePickerContainer);

  // Close the date picker when clicking outside it
  function handleOutsideClick(event) {
    if (!datePickerContainer.contains(event.target) && event.target !== datepicker) {
      closeDatePicker();
    }
  }
  document.addEventListener("click", handleOutsideClick);
}

// Open the date picker on input focus
datepicker.addEventListener("focus", openDatePicker);