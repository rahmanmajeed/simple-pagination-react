import React from "react";
import UserList from "./UserList";

function Container() {
  return (
    <div className="flex flex-col gap-16 justify-start items-start p-5 mt-2">
      <h1 className="text-xl font-bold">User List</h1>
      <UserList />
    </div>
  );
}

export default Container;
