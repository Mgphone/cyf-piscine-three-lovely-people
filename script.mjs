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
window.onload = function () {
  const stored = localStorage.getItem("stored-data-user");
  if (!stored) {
    localStorage.setItem("stored-data-user", JSON.stringify(defaultUsers));
  }

  const users = JSON.parse(localStorage.getItem("stored-data-user"));
  const listUsers = getUserIds();
  // document.querySelector("body").innerText = There are ${users.length} users;
  const infoDiv = document.createElement("div");
  infoDiv.id = "user-count";
  infoDiv.innerHTML = `There are ${listUsers.length} users`;
  document.body.append(infoDiv);

  const container = document.getElementById("select-user");
  const select = document.createElement("select");
  select.id = "userSelect";

  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    select.appendChild(option);
  });

  container.appendChild(select);
};
