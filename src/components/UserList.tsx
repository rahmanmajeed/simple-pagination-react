import React, { useEffect, useMemo, useReducer, useState } from "react";
import { debounce } from "../utils/common";
import { formatDMY } from "../utils/format";
import Pagination from "./Pagination";

const initial = {
     users: [],
     userBackup: [],
     searchText: "",
     filterby: ""
}
const reducer = (state:any, action:any) => {
    switch (action.type) {
      case 'fetchUser':
        return {
          ...state,
          users: action.payload,
          userBackup: action.payload
        };
      default:
        return state;
    }
}
function UserList() {
  // const [users, setUsers] = useState([]);
  const [store, dispatch]  = useReducer(reducer, initial)
  const [currentpage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentpage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return store.users.slice(firstPageIndex, lastPageIndex);
  }, [currentpage, store.users]);

  const handleChange = debounce((input:any) => {
    return filterBySearch(input, store.userBackup);
  },1500);

  const filterBySearch = (value:any, userData:any) => {
    if (value.trim().length > 0) {
      let readyString = value.trim().toLowerCase();
    const filteredUsers = userData.filter((user:any) =>user.username.includes(readyString));
    console.log(filteredUsers,'filt');
    }

  }

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=50")
      .then((res) => res.json())
      .then((json) => dispatch({type:'fetchUser', payload:json.results}))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-start items-start rounded-md">
        <input
          type="text"
          name=""
          id=""
          className="p-3 my-5 rounded-md w-1/6 border border-slate-300"
          placeholder="search here"
          onChange={(e) => handleChange(e.target.value)}
        />
        <table className="table-fixed w-full border-collapse border border-slate-400">
          <thead>
            <tr>
              <th className="custom-th text-center">Name</th>
              <th className="custom-th text-center">Registration Date</th>
              <th className="custom-th text-center">Username</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.map((user: any, index: number) => (
              <tr key={index} className="text-center border border-b-slate-200">
                <td className="py-5 px-3">
                  <div className="flex justify-start gap-5 items-center">
                    <div className="relative h-8 w-8 rounded-full border border-slate-50">
                      <img
                        src={user.picture.medium}
                        alt="img"
                        className="h-full w-full rounded-full border border-slate-500"
                      />
                    </div>
                    <div>
                      <div className="text-left">
                        {`${user.name.first} ${user.name.last}`}
                        <br />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-5">{formatDMY(user.registered.date)}</td>
                <td className="py-5">[{user.login.username}]</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        total={store.users.length}
        currentPage={currentpage}
        pageSize={pageSize}
        onPageChange={(pageno: number) => setCurrentPage(pageno)}
      />
    </div>
  );
}

export default UserList;
