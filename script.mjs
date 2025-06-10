import { getUserIds } from "./common.mjs";

const defaultUsers = [
  {
    id: 1,
    name: "User 1",
    agenda: [
      { topic: "Functions in JS", date: "2025-07-26" },
      { topic: "Variables in JS", date: "2025-08-15" },
    ],
  },
  {
    id: 2,
    name: "User 2",
    agenda: [],
  },
  {
    id: 3,
    name: "User 3",
    agenda: [{ topic: "Async JS", date: "2025-09-01" }],
  },
  {
    id: 4,
    name: "User 4",
    agenda: [],
  },
  {
    id: 5,
    name: "User 5",
    agenda: [
      { topic: "DOM Manipulation", date: "2025-07-20" },
      { topic: "ES6 Features", date: "2025-08-05" },
    ],
  },
];
const intervals = {
  "1 Week": 7,
  "1 Month": 30,
  "3 Months": 90,
  "6 Months": 180,
  "1 Year": 365,
};

window.onload = function () {
  const stored = localStorage.getItem("stored-data-user");
  if (!stored) {
    localStorage.setItem("stored-data-user", JSON.stringify(defaultUsers));
  }
  let myAgenda;

  const users = JSON.parse(localStorage.getItem("stored-data-user"));
  const listUsers = getUserIds();
  // document.querySelector("body").innerText = There are ${users.length} users;
  const infoDiv = document.createElement("div");
  infoDiv.id = "user-count";
  infoDiv.innerHTML = `There are ${listUsers.length} users`;
  document.body.append(infoDiv);

  //start drop select user
  const selectUser = document.getElementById("select-user");
  const select = document.createElement("select");
  select.id = "user-select";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Please choose a user";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  users.map((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    select.appendChild(option);
  });

  container.appendChild(select);
  //end select user
  //start date
  const dateContainer = document.getElementById("select-date");
  const dateSelect = document.createElement("select");
  dateSelect.id = "date-select";
  const defaultDateOption = document.createElement("option");
  defaultDateOption.value = "";
  defaultDateOption.textContent = "Please choose a user";
  defaultDateOption.disabled = true;
  defaultDateOption.selected = true;
  dateSelect.appendChild(defaultDateOption);
  Object.entries(intervals).forEach(([label, days]) => {
    const option = document.createElement("option");
    option.value = days;
    option.textContent = label;
    dateSelect.appendChild(option);
  });
  dateContainer.appendChild(dateSelect);
  //end select user

  select.addEventListener("change", () => {
    const selectedId = parseInt(select.value);
    const selectedUser = users.find((user) => user.id === selectedId);
    console.log("Selected user:", selectedUser);
    myAgenda = selectedUser?.agenda;
    const agendaDisplay = document.getElementById("agenda-display");
    agendaDisplay.innerHTML = "";

    if (
      !selectedUser ||
      !selectedUser.agenda ||
      selectedUser.agenda.length === 0
    ) {
      agendaDisplay.textContent = "No agenda data available.";
    } else {
      selectedUser.agenda.forEach(({ topic, date }, index) => {
        const div = document.createElement("div");
        div.textContent = `${topic} – ${date}`;
        div.className =
          index % 2 === 0 ? "agenda-item even" : "agenda-item odd";
        agendaDisplay.appendChild(div);
      });
    }
  });
};
