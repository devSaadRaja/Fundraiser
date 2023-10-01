import React, { useState } from "react";

export default function FilterCategory({ setFilteredData, projectsData }) {
  const [categories, setCategories] = useState("All Categories");

  function changeCategory(e) {
    const cat = e.target.value;
    setCategories(cat);
    if (cat === "All Categories") setFilteredData(projectsData);
    else if (cat === "Education")
      setFilteredData(projectsData.filter((d) => d.category === "Education"));
    else if (cat === "Business")
      setFilteredData(projectsData.filter((d) => d.category === "Business"));
    else if (cat === "Music")
      setFilteredData(projectsData.filter((d) => d.category === "Music"));
    else if (cat === "Others")
      setFilteredData(projectsData.filter((d) => d.category === "Others"));
  }

  return (
    <>
      <div className="col-lg-6">
        <div id="search-form">
          <div className="row">
            <div className="col-lg-7"></div>
            <div className="col-lg-5">
              <select
                name="category"
                className="form-select"
                value={categories}
                aria-label="Default select example"
                id="chooseCategory"
                onChange={changeCategory}
              >
                <option value="All Categories">All Categories</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Music">Music &amp; Arts</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
