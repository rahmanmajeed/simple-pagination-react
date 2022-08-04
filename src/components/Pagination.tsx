import React from "react";
import { paginationRange } from "../utils/pagination";

type onPageChangeFunction = (pageno: number) => void;
export interface IPagination {
  total: number;
  currentPage: number;
  pageSize: any;
  onPageChange: onPageChangeFunction;
}

//calculate pagination range

function Pagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
}: IPagination) {
  const totalPageCount = paginationRange({ total, pageSize, currentPage });
  let lastPage = totalPageCount[totalPageCount.length - 1];
  const goNext = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1);
    }
  };
  const goPrevious = () => {
    if (currentPage > 0 && currentPage < lastPage) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-end items-center gap-5 m-6 px-5">
        {currentPage > 1 && (
          <p
            className="cursor-pointer px-3 py-1 border-l-0 border-r-0 border-b-0 hover:border-t-[3px] hover:border-t-sky-900"
            onClick={goPrevious}
          >
            «
          </p>
        )}

        {totalPageCount.map((page, index) => (
          <p
            key={index}
            className={`cursor-pointer px-3 py-1 border-l-0 border-r-0 border-b-0 hover:border-t-[3px] hover:border-t-sky-900 ${
              currentPage === page ? "border-[3px] border-t-indigo-800" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </p>
        ))}
        {currentPage < lastPage && (
          <p
            className="cursor-pointer px-3 py-1 border-l-0 border-r-0 border-b-0 hover:border-t-[3px] hover:border-t-sky-900"
            onClick={goNext}
          >
            »
          </p>
        )}
      </div>
    </div>
  );
}

export default Pagination;
