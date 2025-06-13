import { getUserIds } from "./common.mjs";
import { getData, addData, clearData } from "./storage.mjs";
import { generateRevisionDatesUTC } from "./utils/generateRevisionDatesUTC.mjs";
//this is DOM elements
const userSelect = document.getElementById("user-select");
const agendaSection = document.getElementById("agenda-section");
const topicForm = document.getElementById("topic-form");
const topicNameInput = document.getElementById("topic-name");
const revisionDateInput = document.getElementById("revision-date");
const clearBtn = document.getElementById("clear-storage-btn");

function changeUKformat(date) {
  let splitDate = date.split("-");
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
}
//select drop with userId
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
//display agenda
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
//if there is userId and loadUser agenda
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
//window onload and the function start from here
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
    const revisionDates = generateRevisionDatesUTC(startDate);
    const newItems = revisionDates.map((date) => ({ topic, date }));
    addData(userId, newItems);
    topicNameInput.value = "";
    revisionDateInput.value = dateToday;
    loadUserAgenda(userId);
  });
  //clear user data
  clearBtn.addEventListener("click", () => {
    const userId = userSelect.value;
    if (!userId) {
      alert("Please select a user to clear data.");
      return;
    }
    const storedDataKey = `stored-data-user-${userId}`;
    const existingData = localStorage.getItem(storedDataKey);
    if (!existingData) {
      alert(`No data found for user ${userId}.`);
      return;
    }
    clearData(userId);
    agendaSection.innerHTML = "";
    topicForm.reset();
    alert(`Data for user ${userId} has been cleared.`);
  });
};
