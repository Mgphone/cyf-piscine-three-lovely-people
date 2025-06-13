import { getUserIds } from "./common.mjs";
import { getData, addData } from "./storage.mjs";

const userSelect = document.getElementById("user-select");
const agendaSection = document.getElementById("agenda-section");
const topicForm = document.getElementById("topic-form");
const topicNameInput = document.getElementById("topic-name");
const revisionDateInput = document.getElementById("revision-date");

function generateRevisionDates(startDate) {
  const intervals = [7, 30, 90, 180, 365]; // in days
  const baseDate = new Date(startDate + "T00:00:00");
  return intervals.map((days) => {
    const revisionDate = new Date(baseDate);
    revisionDate.setDate(revisionDate.getDate() + days);
    return revisionDate.toISOString().split("T")[0];
  });
}
function changeUKformat(date) {
  let splitDate = date.split("-");
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
}
function setupUserDropdown() {
  const users = getUserIds();

  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });
  userSelect.value = "";
  agendaSection.textContent = "Please select a user to see their agenda.";
}
function displayAgenda(agendaItems) {
  agendaSection.innerHTML = "";
  if (agendaItems.length === 0) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "no-agenda-message";
    const boldText = document.createElement("b");
    boldText.append("No upcoming agenda items.");
    messageDiv.appendChild(boldText);
    agendaSection.appendChild(messageDiv);
    return;
  }
  const list = document.createElement("ul");
  agendaItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${changeUKformat(item.date)}: ${item.topic}`;
    list.appendChild(listItem);
  });
  agendaSection.appendChild(list);
}
function loadUserAgenda(userId) {
  if (!userId) {
    agendaSection.innerHTML = "";
    agendaSection.textContent = "Please select a user to see their agenda.";
    return;
  }

  const agenda = getData(userId) || [];
  const today = new Date().toISOString().split("T")[0];
  const futureAgenda = agenda
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  displayAgenda(futureAgenda);
}
window.onload = function () {
  setupUserDropdown();
  userSelect.addEventListener("change", (e) => {
    loadUserAgenda(e.target.value);
  });
  // Default date picker to today's date when the page loads
  const todaysDate = new Date().toISOString().split("T")[0];
  revisionDateInput.value = todaysDate;

  // Function for form submission
  topicForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Start with today's date
    const dateToday = new Date().toISOString().split("T")[0];

    const userId = userSelect.value;
    const topic = topicNameInput.value.trim();
    const startDate = revisionDateInput.value;

    if (!userId) {
      alert("Please select a user first.");
      return;
    }
    if (!topic || !startDate) {
      alert("Please enter both a topic and a date.");
      return;
    }

    const revisionDates = generateRevisionDates(startDate);
    const newItems = revisionDates.map((date) => ({ topic, date })); // Converts each revision date into an object

    addData(userId, newItems); // Stores all the new agenda entries for the selected user

    topicNameInput.value = ""; // Reset the form after submission
    revisionDateInput.value = dateToday; // Reset the date picker to today after submission

    loadUserAgenda(userId); // Reload the user's agenda to reflect the new entries
  });
};
