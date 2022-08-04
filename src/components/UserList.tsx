import React, { useEffect, useMemo, useReducer, useState } from "react";
import { debounce } from "../utils/common";
import { formatDMY } from "../utils/format";
import Pagination from "./Pagination";

const initial = {
  users: [],
  userBackup: [],
  searchText: "",
  gender: "",
};
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "fetchUser":
      return {
        ...state,
        users: action.payload,
        userBackup: action.payload,
      };
    case "filterUserbySearch":
      return {
        ...state,
        users: action.payload,
      };
    case "filterUserbyRadio":
      return {
        ...state,
        users: action.payload,
      };
    case "setSearchText":
      return {
        ...state,
        searchText: action.payload,
      };
    case "SET_GENDER":
      return {
        ...state,
        gender: action.payload,
      };

    default:
      return state;
  }
};
function UserList() {
  const [gender, setGender] = useState("");
  const [store, dispatch] = useReducer(reducer, initial);
  const [currentpage, setCurrentPage] = useState(1);
  const [toggle, setToggle] = useState(false);

  const pageSize = 10;

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentpage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return store.users.slice(firstPageIndex, lastPageIndex);
  }, [currentpage, store.users, store.gender]);

  const handleChange = debounce((input: any) => {
    return filterBySearch(input, store.userBackup);
  }, 1500);

  const onValueChange = (input: any) => {
    return filterByRadio(input, store.userBackup);
  };

  const filterBySearch = (value: any, userData: any) => {
    if (value[0].trim().length > 0 && !store.gender) {
      let readyString = value[0].trim().toLowerCase();
      const filteredUsers = userData.filter((user: any) => {
        if (
          user.login.username.includes(readyString) ||
          user.name.first.includes(readyString) ||
          user.name.last.includes(readyString) ||
          user.email.includes(readyString)
        ) {
          return true;
        }
      });
      dispatch({ type: "filterUserbySearch", payload: filteredUsers });
    } else if (value[0].trim().length > 0 && store.gender) {
      let readyString = value[0].trim().toLowerCase();

      // first filter gender
      const genderFilter = userData.filter(
        (user: any) => user.gender === store.gender
      );
      //second filter search box
      const filteredUsers = genderFilter.filter((user: any) => {
        if (
          user.login.username.includes(readyString) ||
          user.name.first.includes(readyString) ||
          user.name.last.includes(readyString) ||
          user.email.includes(readyString)
        ) {
          return true;
        }
      });

      dispatch({ type: "filterUserbySearch", payload: filteredUsers });
    } else if (!value[0].length && store.gender) {
      //only filter gender
      const genderFilter = userData.filter(
        (user: any) => user.gender == store.gender
      );
      dispatch({ type: "filterUserbySearch", payload: genderFilter });
    } else if (!value[0].length && !store.gender) {
      dispatch({ type: "filterUserbySearch", payload: userData });
    } else {
      dispatch({ type: "filterUserbySearch", payload: userData });
    }
  };

  const filterByRadio = (value: any, userData: any) => {
    if (!value && !store.searchText) {
      dispatch({ type: "filterUserbyRadio", payload: userData });
    } else if (!value && store.searchText) {
      let readyString = store.searchText.trim().toLowerCase();
      const filteredUsers = userData.filter((user: any) => {
        if (
          user.login.username.includes(readyString) ||
          user.name.first.includes(readyString) ||
          user.name.last.includes(readyString) ||
          user.email.includes(readyString)
        ) {
          return true;
        }
      });
      dispatch({ type: "filterUserbyRadio", payload: filteredUsers });
    } else if (value && !store.searchText) {
      const genderFilter = userData.filter((user: any) => user.gender == value);
      dispatch({ type: "filterUserbyRadio", payload: genderFilter });
    } else if (value && store.searchText) {
      let readyString = store.searchText.trim().toLowerCase();

      // first filter gender
      const genderFilter = userData.filter(
        (user: any) => user.gender === value
      );
      //second filter search box
      const filteredUsers = genderFilter.filter((user: any) => {
        if (
          user.login.username.includes(readyString) ||
          user.name.first.includes(readyString) ||
          user.name.last.includes(readyString) ||
          user.email.includes(readyString)
        ) {
          return true;
        }
      });

      dispatch({ type: "filterUserbyRadio", payload: filteredUsers });
    } else {
      dispatch({ type: "filterUserbyRadio", payload: userData });
    }
  };

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=50")
      .then((res) => res.json())
      .then((json) => dispatch({ type: "fetchUser", payload: json.results }))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col justify-start items-start rounded-md w-full">
        <div className="w-full flex justify-between items-center">
          <input
            type="text"
            name=""
            id=""
            className="p-3 my-5 rounded-md w-1/6 border border-slate-300"
            placeholder="search here"
            onChange={(e) => {
              dispatch({ type: "setSearchText", payload: e.target.value });
              handleChange(e.target.value);
            }}
          />
          <div className="inline-flex gap-5">
            <p>filter by: </p>

            <div>
              <input
                type="radio"
                id="all"
                name="gender"
                value=""
                checked={gender === ""}
                onChange={(e) => {
                  dispatch({ type: "SET_GENDER", payload: e.target.value });

                  setGender(e.target.value);
                  onValueChange(e.target.value);
                }}
              />
              &nbsp;
              <label htmlFor="all">All</label>
            </div>

            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => {
                  dispatch({ type: "SET_GENDER", payload: e.target.value });
                  setGender(e.target.value);
                  onValueChange(e.target.value);
                }}
              />
              &nbsp;
              <label htmlFor="male">Male</label>
            </div>

            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => {
                  dispatch({ type: "SET_GENDER", payload: e.target.value });
                  setGender(e.target.value);
                  onValueChange(e.target.value);
                }}
              />
              &nbsp;
              <label htmlFor="female">Female</label>
            </div>
          </div>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => setToggle(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        {toggle ? (
          <div className="w-full flex flex-wrap justify-start items-center gap-5">
            {currentTableData.map((user: any, index: number) => (
              <div
                key={index}
                className="flex justify-start gap-5 items-start rounded-md shadow-lg w-80 h-auto border border-slate-300 p-3"
              >
                <div className="relative h-8 w-8 rounded-full border border-slate-50">
                  <img
                    src={user.picture.medium}
                    alt="img"
                    className="h-full w-full rounded-full border border-slate-500"
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg text-dark text-left">
                    {`${user.name.first} ${user.name.last}`}
                    <br />
                    <span className="text-gray-400 text-base font-normal">
                      {user.email}
                    </span>
                  </p>
                  <p className="font-medium text-dark font-sans">
                    👮 [{user.login.username}]
                  </p>
                  <p className="font-medium text-dark font-sans">
                    📅 [{formatDMY(user.registered.date)}]
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                <tr
                  key={index}
                  className="text-center border border-b-slate-200"
                >
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
        )}
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
