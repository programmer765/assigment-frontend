import "./DataCard.css";
import React, { useState } from "react";
import baseURL from "../../baseURL";
import axios from "axios";
import Popup from "reactjs-popup";

const DataCard = ({ data, toggleClass }) => {
  const font = toggleClass ? "font" : "";
  const display = toggleClass ? "dis" : "";
  const typeOfOperation = "Edit Data";
  const [addData, setAddData] = useState({
    name: "",
    email: "",
    gender: "Male",
    status: "active",
  });

  const handleChange = (e, keyName) => {
    let newData = addData;
    newData[keyName] = e.target.value;
    setAddData(newData);
    console.log(addData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = baseURL + `/update/data/${data.id}`;
    const res = await axios.patch(URL, JSON.stringify(addData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.data.code === 200) {
      alert("Data edited successfully");
      window.location.reload();
    } else {
      const errorMsg = res.data.data[0].field + " " + res.data.data[0].message;
      alert(errorMsg);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      const URL = baseURL + `/delete/data/${data.id}`;
      const res = await axios.delete(URL);
      if (res.data.code === 204) {
        alert("Success");
        window.location.reload();
      } else {
        alert("Bad request, please try again!");
      }
    }
  };

  return (
    <div className="DataCard">
      <div className={`dataContainer ${font}`}>
        <div className="name">{data.name}</div>
        <div className="email">
          <p>{data.email}</p>
        </div>
        <div className="gender">{data.gender}</div>
        <div className="status">{data.status}</div>
        <div className={`buttons ${display}`}>
          {toggleClass && "buttons"}
          <div className="popupContainer editPopup">
            <Popup
              trigger={
                <button className={`edit btn ${toggleClass}`}>Edit</button>
              }
              modal
              nested
            >
              {(close) => (
                <div className="modal">
                  <div className="modalContent">
                    <div className="modalHead">{typeOfOperation}</div>
                    <form action="post" className="form">
                      <label htmlFor="" className="addName">
                        <div className="addNameText">Name</div>
                        <input
                          type="text"
                          className="addNameField"
                          onChange={(event) => handleChange(event, "name")}
                          required
                        />
                      </label>
                      <label htmlFor="" className="addEmail">
                        <div className="addEmailText">Email</div>
                        <input
                          type="email"
                          className="addEmailField"
                          onChange={(event) => handleChange(event, "email")}
                          required
                        />
                      </label>
                      <label htmlFor="" className="addGender">
                        <div className="addGenderText">Gender</div>
                        <select
                          name=""
                          className="addGenderSelect"
                          onChange={(event) => handleChange(event, "gender")}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label htmlFor="" className="addStatus">
                        <div className="addStatusText">Status</div>
                        <select
                          name=""
                          className="addStatusSelect"
                          onChange={(event) => handleChange(event, "status")}
                        >
                          <option>active</option>
                          <option>inactive</option>
                        </select>
                      </label>
                      <div className="submitBtn">
                        <button className="submit" onClick={handleSubmit}>
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="closeBtn">
                    <button onClick={() => close()} className="close">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <div className="del">
            <button
              className={`delete btn ${toggleClass}`}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
