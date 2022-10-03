import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useUserContext } from "..";

const Pagination = observer(() => {
  const { device } = useUserContext();
  const pageCount = device && Math.ceil(device.count / device.limit);
  const pages = [...Array(pageCount)].map((e, i) => (e = i + 1));
  return (
    <div className="pagination">
      {pages.map((page) => (
        <div
          className={`pagination__item ${device?.page == page ? "pagination__item--selected" : ""}`}
          key={page}
          onClick={() => device?.setPage(page)}
        >
          {page}
        </div>
      ))}
    </div>
  );
});

export default Pagination;
