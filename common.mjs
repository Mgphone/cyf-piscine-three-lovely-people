export function getUserIds() {
  const users = JSON.parse(localStorage.getItem("stored-data-user"));
  return users.map((user) => user.id);
  //   return ["1", "2", "3", "4", "5"];
}
