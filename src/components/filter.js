import React from "react";

const Filter = ({ filterHandler }) => (
  <div>
    filter shown with: <input onChange={filterHandler} />
  </div>
);

export default Filter;
