import React from "react";
import { toast } from "react-toastify";

export default function SetFile({ setFormInputs }) {
  function setFormFiles(e) {
    const fName = e.target.files[0].name;
    const ext = fName.split(".").pop();

    const allowedExtensions = ["png", "jpg", "jpeg"];
    if (allowedExtensions.includes(ext.toLowerCase()))
      setFormInputs((preValue) => {
        return { ...preValue, file: e.target.files[0] };
      });
    else {
      setFormInputs((preValue) => {
        return { ...preValue, file: null };
      });
      toast.error(`Allowed file types: ${allowedExtensions}`, {
        pauseOnHover: false,
        theme: "colored",
      });
    }
  }

  return (
    <>
      <div className="col-lg-3">
        <label>Choose a Picture</label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={setFormFiles}
          required
        />
      </div>
    </>
  );
}
