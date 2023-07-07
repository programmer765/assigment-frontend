import axios from "axios";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "./App.css";
import baseURL from "./baseURL";
import DataCard from "./Components/DataCard/DataCard";

function App() {
  const [datas, setDatas] = useState([]);
  const typeOfOperation = "Add Data";
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
    const URL = baseURL + "/post/data";
    const res = await axios.post(URL, JSON.stringify(addData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.data.code === 201) {
      alert("Data added successfully");
      window.location.reload();
    } else {
      const errorMsg =
        "This " + res.data.data[0].field + " " + res.data.data[0].message;
      alert(errorMsg);
    }
  };

  const convert2csv = (objArray) => {
    let array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line !== "") line += ",";

        line += array[i][index];
      }

      str += line + "\r\n";
    }

    return str;
  };

  const handleDownload = () => {
    let data = datas;
    for (let i = 0; i < data.length; ++i) {
      delete data[i]["id"];
    }
    data.unshift(headData);
    const JSONObj = JSON.stringify(data);
    const csv = convert2csv(JSONObj);
    const exportedFilenmae = "data.csv";
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        // document.body.removeChild(link);
      }
    }
  };

  const headData = {
    name: "Name",
    email: "Email",
    gender: "Gender",
    status: "Status",
  };

  useEffect(() => {
    const getData = async () => {
      const URL = baseURL + "/get/list";
      const res = await axios.get(URL);
      setDatas(res.data);
      console.log(datas);
    };
    getData();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <DataCard data={headData} key={0} toggleClass="heading" />
      {datas &&
        datas.map((data, i) => <DataCard data={data} key={i} toggleClass="" />)}
      <div className="popupContainer">
        <div className="popupbtn">
          <Popup
            trigger={<button className="popup">Add new data</button>}
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
        <div className="downloadContainer">
          <button className="download" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
