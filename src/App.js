import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faPeopleGroup,
  faPersonCircleXmark,
  faPersonBurst,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const getInitialState = () => {
    const value = "All";
    return value;
  };

  const [value, setValue] = useState(getInitialState);
  const [time, setTimeValue] = useState(0);

  const handleChange = (e) => {
    setValue(e.target.value);
    let allFilters = document.querySelectorAll(".table-filter");
    let filter_value_dict = {};
    allFilters.forEach((filter_i) => {
      let col_index = filter_i.parentElement.getAttribute("col-index");
      let value = filter_i.value;
      if (value !== "all") {
        filter_value_dict[col_index] = value;
      }
    });

    let col_cell_value_dict = {};
    const rows = document.querySelectorAll("#emp-table tbody tr");
    rows.forEach((row) => {
      let display_row = true;

      allFilters.forEach((filter_i) => {
        let col_index = filter_i.parentElement.getAttribute("col-index");
        col_cell_value_dict[col_index] = row.querySelector(
          "td:nth-child(" + col_index + ")"
        ).innerHTML;
      });
      for (var col_i in filter_value_dict) {
        let filter_value = filter_value_dict[col_i];
        const linCodeValues1 = new Map();
        linCodeValues1
          .set("Blue", "BL")
          .set("RED", "RD")
          .set("Orange", "OR")
          .set("Silver", "SV")
          .set("Yellow", "YL")
          .set("Green", "GR")
          .set("NoColor", "NoColor");
        console.log(filter_value, col_cell_value_dict[col_i], "##############");
        if (
          ["BL", "RD", "OR", "SV", "YL", "GR", "NoColor"].includes(filter_value)
        ) {
          var row_cell_value = linCodeValues1.get(col_cell_value_dict[col_i]);
          console.log(row_cell_value, "^^^^^^^^^^^^^");
        } else {
          var row_cell_value = col_cell_value_dict[col_i];
        }

        console.log(row_cell_value, filter_value, "*********************");
        if (row_cell_value)
          if (
            row_cell_value.indexOf(filter_value) == -1 &&
            filter_value != "all"
          ) {
            display_row = false;
            console.log("Inside Break");
            break;
          }
      }
      if (display_row == true) {
        console.log("inside True");
        row.style.display = "table-row";
      } else {
        console.log("Inside falase");
        row.style.display = "none";
      }
    });
  };
  const [trainData, setTrainData] = useState([]);
  useEffect(() => {
    console.log("i fire once");
    const url =
      "https://api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=c556af80af504f42ab0c1906b84f17ad";
    const id = setInterval(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          console.log(json);
          setTrainData(json.TrainPositions);
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchData();
      const date = new Date();
      const pst = date.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      });
      setTimeValue(pst);
    }, 10000);
  }, []);

  const uniqueSerivces = new Map();
  const uniqueLineCode = new Map();
  const uniqueCarCount = new Map();
  const linCodeValues = new Map();
  linCodeValues
    .set("RD", "Red")
    .set("OR", "Orange")
    .set("SV", "Silver")
    .set("BL", "Blue")
    .set("YL", "Yellow")
    .set("GR", "Green");

  for (let i = 0; i < trainData.length; i++) {
    if (!uniqueSerivces.has(trainData[i].ServiceType)) {
      uniqueSerivces.set(trainData[i].ServiceType, 1);
    }
    if (!uniqueLineCode.has(trainData[i].LineCode)) {
      uniqueLineCode.set(trainData[i].LineCode, 1);
    }
    if (!uniqueCarCount.has(trainData[i].CarCount)) {
      uniqueCarCount.set(trainData[i].CarCount.toString(), 1);
    }
  }
  const serviceData = [...uniqueSerivces.keys()];
  serviceData.unshift("all");
  const lineData = [...uniqueLineCode.keys()];
  lineData.unshift("all");
  const carCountData = [...uniqueCarCount.keys()];
  carCountData.unshift("all");

  const serviceTyepIcons = new Map();
  serviceTyepIcons.set("NoPassengers", faPersonCircleXmark);
  serviceTyepIcons.set("Normal", faPeopleGroup);
  serviceTyepIcons.set("Special", faPersonBurst);
  serviceTyepIcons.set("Unknown", faCircleQuestion);
  console.log(
    serviceTyepIcons.get("NoPassengers"),
    "*******************************"
  );
  console.log(trainData);
  return (
    <>
      {" "}
      <div class="heading">
        <h1>Washington Metropolitan Area Transit Authority API</h1>
      </div>
      <h3>WebSite Updated at :{time}</h3>
      <div class="outer-wrapper">
        <div class="table-wrapper">
          <table id="emp-table">
            <thead>
              <tr>
                <th col-index={1}>TrainId</th>
                <th col-index={2}>TrainNumber</th>
                <th col-index={3}>
                  ServiceType
                  <select
                    className="table-filter"
                    onChange={(e) => handleChange(e)}
                    defaultValue="ALL"
                  >
                    {serviceData.map((value) => {
                      return <option value={value}>{value}</option>;
                    })}
                  </select>
                </th>
                <th col-index={4}>SecondsAtLocation</th>
                <span>
                  <th col-index={5}>
                    LineCode
                    <select
                      className="table-filter"
                      onChange={(e) => handleChange(e)}
                    >
                      {lineData.map((value2) => {
                        return <option value={value2}>{value2}</option>;
                      })}
                    </select>
                  </th>
                </span>
                <th col-index={6}>DirectionNum</th>
                <th col-index={7}>DestinationStationCode</th>
                <th col-index={8}>CircuitId</th>
                <th col-index={9}>
                  CarCount
                  <select
                    className="table-filter"
                    onChange={(e) => handleChange(e)}
                  >
                    {carCountData.map((value1) => {
                      return <option value={value1}>{value1}</option>;
                    })}
                  </select>
                </th>
              </tr>
            </thead>
            <tbody>
              {trainData.map((train) => {
                return (
                  <tr>
                    <td>{train.TrainId}</td>
                    <td>{train.TrainNumber}</td>
                    <td>
                      {train.ServiceType}{" "}
                      <FontAwesomeIcon
                        icon={serviceTyepIcons.get(train.ServiceType)}
                      />
                    </td>
                    <td>{train.SecondsAtLocation}</td>
                    <td
                      style={{
                        height: "12px",
                        width: "15px",
                        borderColor: linCodeValues.get(train.LineCode),
                        marginLeft: "5px",
                        marginTop: "15px",
                        borderRadius: "10px",
                        borderWidth: "2px",
                      }}
                    >
                      {train.LineCode === "RD"
                        ? "RED"
                        : train.LineCode === "OR"
                        ? "Orange"
                        : train.LineCode === "SV"
                        ? "Silver"
                        : train.LineCode === "BL"
                        ? "Blue"
                        : train.LineCode === "YL"
                        ? "Yellow"
                        : train.LineCode === "GR"
                        ? "Green"
                        : train.LineCode === null
                        ? "No Color"
                        : "Black"}
                    </td>
                    <td>{train.DirectionNum}</td>
                    <td>{train.DestinationStationCode}</td>
                    <td>{train.CircuitId}</td>
                    <td>{train.CarCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
