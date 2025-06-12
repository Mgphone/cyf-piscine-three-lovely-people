import { getUserIds } from "./common.mjs";
import { getData } from "./storage.mjs";
import timeUntil from "./timeUntil.mjs";

const userSelect = document.getElementById("user-select");
const agendaSection = document.getElementById("agenda-section");
const topicForm = document.getElementById("topic-form");
const topicNameInput = document.getElementById("topic-name");
const revisionDateInput = document.getElementById("revision-date");

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

function loadUserAgenda(userId) {
  if (!userId) {
    agendaSection.innerHTML = "";
    agendaSection.textContent = "Please select a user to see their agenda.";
    return;
  }

  const agenda = getData(userId);

  if (!agenda || agenda.length === 0) {
    agendaSection.textContent = "No agenda found for this user.";
  } else {
    agendaSection.innerHTML = "<ol></ol>";
    agenda[userId].topics.forEach((topic) => {
      const li = document.createElement("li");
      li.innerText = `${topic.name} to be done in ${timeUntil(topic.date)}`;
      agendaSection.appendChild(li);
    });
  }
}

window.onload = function () {
  setupUserDropdown();
  userSelect.addEventListener("change", (e) => {
    loadUserAgenda(e.target.value);
  });
};
