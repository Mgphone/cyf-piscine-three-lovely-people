import { getUserIds } from "./common.mjs";
import { getData, addData } from "./storage.mjs";

const userSelect = document.getElementById("user-select");
const agendaSection = document.getElementById("agenda-section");
const topicForm = document.getElementById("topic-form");
const topicNameInput = document.getElementById("topic-name");
const revisionDateInput = document.getElementById("revision-date");

function generateRevisionDates(startDate) {
  const intervals = [
    { type: "week", amount: 1 },
    { type: "month", amount: 1 },
    { type: "month", amount: 3 },
    { type: "month", amount: 6 },
    { type: "year", amount: 1 },
  ];
  const baseDate = new Date(startDate);
  const originalDay = baseDate.getDate();
  return intervals.map(({ type, amount }) => {
    const revisionDate = new Date(baseDate);
    if (type === "week") {
      revisionDate.setDate(revisionDate.getDate() + amount * 7);
    } else if (type === "month") {
      revisionDate.setMonth(revisionDate.getMonth() + amount);
      revisionDate.setDate(
        Math.min(
          originalDay,
          daysInMonth(revisionDate.getFullYear(), revisionDate.getMonth())
        )
      );
    } else if (type === "year") {
      revisionDate.setFullYear(revisionDate.getFullYear() + amount);
      revisionDate.setDate(
        Math.min(
          originalDay,
          daysInMonth(revisionDate.getFullYear(), revisionDate.getMonth())
        )
      );
    }
    return revisionDate.toISOString().split("T")[0];
  });
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
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
  const todaysDate = new Date().toISOString().split("T")[0];
  revisionDateInput.value = todaysDate;

  topicForm.addEventListener("submit", (e) => {
    e.preventDefault();
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
    const newItems = revisionDates.map((date) => ({ topic, date }));
    addData(userId, newItems);
    topicNameInput.value = "";
    revisionDateInput.value = dateToday;
    loadUserAgenda(userId);
  });
};
