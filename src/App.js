import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import CheckboxShift from "./Components/Checkbox";
import {
  Title,
  Time,
  FlightException,
  Misc,
  IpadHelp
} from "./Components/Stateless";
import FlightTableB from "./Components/FlightTableB";
import Button from "react-bootstrap/Button";
import resizePage from "./Functions/resizePage";
import { demo } from "./demo";
import { version, FOLDER, test } from "./properties";
import { StationButton } from "./Components/StationButton";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: true,
      columnOrder: [],
      deletedColumns: [],
      deletedRows: [],
      selectedRows: [],
      currentRowSort: [],
      resizable: false,
      refresh: true,
      selected: false,
      help: true,
      leftClick: true,
      middleClick: false,
      rightClick: false,
      showSelectedOnly: false,
      hideSelectedOnly: false,
      initalLoad: true,
      demo: test,
      iPadHelp: false
    };
  }

  componentDidMount() {
    if (this.state.demo) {
      let location = this.props.location.pathname;

      // let formatLocation =
      //   location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
      //     ? location.slice(1, -6)
      //     : location.slice(1);
      let data = demo.split("\n");

      return new Promise((res, rej) => {
        this.setState({
          flightType: data[1].split(",")[0],
          shiftOne: data[0]
            .split(",")
            .filter((item, i) => i > 1 && i < 4 && item.trim() !== ""),
          shiftTwo: data[1]
            .split(",")
            .filter((item, i) => i > 1 && i < 4 && item.trim() !== ""),
          shiftThree: data[2]
            .split(",")
            .filter((item, i) => i > 1 && i < 4 && item.trim() !== ""),
          rmas: [
            data[0].split(",")[0],
            data[1].split(",")[0],
            data[2].split(",")[0]
          ],
          misc: data[3].split(","),
          maints:
            location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
              ? ""
              : data[2].split(",").filter(i => i.includes("Maint"))[0],
          spares:
            location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
              ? ""
              : data[2].split(",").filter(i => i.includes("Spare"))[0],
          opens:
            location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
              ? ""
              : data[2].split(",").filter(i => i.includes("Open"))[0],
          maintBool: true,
          spareBool: true,
          openBool: true,
          otherBool: true,
          shiftBools: {
            shiftOne: data[0].split(",")[1].slice(0, 1) === "X",
            shiftTwo: data[1].split(",")[1].slice(0, 1) === "X",
            shiftThree: data[2].split(",")[1].slice(0, 1) === "X"
          },
          fileLines: data,
          fileLinesContent: data
            .filter(
              (item, i) =>
                i > 3 &&
                item.match(/^\w/) &&
                item !== "NULL" &&
                item.trim() !== ""
            )
            .map((j, k) => {
              if (k === 0) {
              }
              let obj = {};
              for (var h = 0; h < data[4].length; h++) {
                obj[data[4].split(",")[h]] = j.split(",")[h];
              }
              obj["row"] = k;
              return obj;
            }),
          currentDate: data[0].split(",")[4],
          currentTime: data[0].split(",")[6],
          direction: true
        });
        res();
      })
        .then(() =>
          this.setState({
            availableMaints: parseInt(this.state.maints.match(/\d+/)[0]),
            availableSpares: parseInt(this.state.spares.match(/\d+/)[0]),
            availableOpens: parseInt(this.state.opens.match(/\d+/)[0])
          })
        )
        .then(() => this.filter())
        .then(() => this.setState({ initialState: this.state }));
    } else {
      this.getFile();
    }
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }

  getFile() {
    let location = this.props.location.pathname;

    let formatLocation =
      location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
        ? location.slice(1, -6)
        : location.slice(1);

    fetch(FOLDER + `${formatLocation}.csv`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          flightType: data[1].split(",")[0],
          shiftOne: data[0]
            .split(",")
            .filter((item, i) => i > 1 && i < 4 && item.trim() !== ""),
          shiftTwo: data[1]
            .split(",")
            .filter((item, i) => i > 1 && i < 4 && item.trim() !== ""),
          shiftThree: data[2]
            .split(",")
            .filter((item, i) => i > 1 && i < 4 && item.trim() !== ""),
          rmas: [
            data[0].split(",")[0],
            data[1].split(",")[0],
            data[2].split(",")[0]
          ],
          misc: data[3].split(","),
          maints:
            location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
              ? ""
              : data[2].split(",").filter(i => i.includes("Maint"))[0],
          spares:
            location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
              ? ""
              : data[2].split(",").filter(i => i.includes("Spare"))[0],
          opens:
            location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
              ? ""
              : data[2].split(",").filter(i => i.includes("Open"))[0],
          maintBool: true,
          spareBool: true,
          openBool: true,
          otherBool: true,
          shiftBools: {
            shiftOne: data[0].split(",")[1].slice(0, 1) === "X",
            shiftTwo: data[1].split(",")[1].slice(0, 1) === "X",
            shiftThree: data[2].split(",")[1].slice(0, 1) === "X"
          },
          fileLines: data,
          fileLinesContent: data
            .filter(
              (item, i) =>
                i > 3 &&
                item.match(/^\w/) &&
                item !== "NULL" &&
                item.trim() !== ""
            )
            .map((j, k) => {
              if (k === 0) {
              }
              let obj = {};
              for (var h = 0; h < data[4].length; h++) {
                obj[data[4].split(",")[h]] = j.split(",")[h];
              }
              obj["row"] = k;
              return obj;
            }),
          columnDirections: data.filter((item, i) => i === 4)[0].split(",").reduce((obj, c) => {
            obj[c] = false;
            return obj;
          }, {}),
          currentDate: data[0].split(",")[4],
          currentTime: data[0].split(",")[6],
          direction: true
        });
      })
      .then(() =>
        location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
          ? ""
          : this.setState({
            availableMaints: parseInt(this.state.maints.match(/\d+/)[0]),
            availableSpares: parseInt(this.state.spares.match(/\d+/)[0]),
            availableOpens: parseInt(this.state.opens.match(/\d+/)[0])
          })
      )
      .then(() => this.filter())
      .then(() => this.setState({ initialState: this.state }))
      .then(() => {
        if (this.state.initalLoad) {
          this.setState({ initalLoad: false });
          let location = this.props.location.pathname.split("/");
          let content = this.state.currentContent;
          let columns = this.state.currentContent
            ? Object.keys(this.state.currentContent[0])
            : "";

          if (columns) {
            if (location.length === 4) {
              if (location[3] === "DEICE") {
                let index = columns.indexOf("DILOC;BBW");
                this.onSort(columns[index], content, null);
              } else {
                let index = columns.indexOf("IREQ;BBW");
                this.onSort(columns[index], content, null);
              }
            } else {
              let data = this.state.misc;
              let index = data.indexOf("^^^^^");
              this.onSort(columns[index], content, null);
            }
          }
        } else {
          let content = this.state.currentContent;
          let isSorted = this.state.isSorted;
          this.onSort(isSorted, content);
        }
      })
      .then(() =>
        this.setState({
          timer: setInterval(() => {
            fetch(FOLDER + `${formatLocation}.csv`)
              .then((response) =>
                response.json().then(data => {
                  if (
                    JSON.stringify(data) ===
                    JSON.stringify(this.state.fileLines)
                  ) {
                    console.log("Data unchanged.");
                  } else {
                    this.setState({
                      shiftOne: data[0]
                        .split(",")
                        .filter(
                          (item, i) => i > 1 && i < 4 && item.trim() !== ""
                        ),
                      shiftTwo: data[1]
                        .split(",")
                        .filter(
                          (item, i) => i > 1 && i < 4 && item.trim() !== ""
                        ),
                      shiftThree: data[2]
                        .split(",")
                        .filter(
                          (item, i) => i > 1 && i < 4 && item.trim() !== ""
                        ),
                      misc: data[3].split(","),
                      maints:
                        location.slice(-5) === "INLET" ||
                          location.slice(-5) === "DEICE"
                          ? ""
                          : data[2]
                            .split(",")
                            .filter(i => i.includes("Maint"))[0],
                      spares:
                        location.slice(-5) === "INLET" ||
                          location.slice(-5) === "DEICE"
                          ? ""
                          : data[2]
                            .split(",")
                            .filter(i => i.includes("Spare"))[0],
                      opens:
                        location.slice(-5) === "INLET" ||
                          location.slice(-5) === "DEICE"
                          ? ""
                          : data[2]
                            .split(",")
                            .filter(i => i.includes("Open"))[0],
                      fileLines: data,
                      fileLinesContent: data
                        .filter(
                          (item, i) =>
                            i > 3 &&
                            item.match(/^\w/) &&
                            item !== "NULL" &&
                            item.trim() !== ""
                        )
                        .map((j, k) => {
                          if (k === 0) {
                          }
                          let obj = {};
                          for (var h = 0; h < data[4].length; h++) {
                            obj[data[4].split(",")[h]] = j.split(",")[h];
                          }
                          obj["row"] = k;
                          return obj;
                        }),
                      currentDate: data[0].split(",")[4],
                      currentTime: data[0].split(",")[6]
                    }, () => {
                      if (!location.slice(-5) === "INLET" || !location.slice(-5) === "DEICE") {
                        this.setState({
                          availableMaints: parseInt(
                            this.state.maints.match(/\d+/)[0]
                          ),
                          availableSpares: parseInt(
                            this.state.spares.match(/\d+/)[0]
                          ),
                          availableOpens: parseInt(this.state.opens.match(/\d+/)[0])
                        })
                      }
                      this.filter()
                      return;
                    });
                    console.log("Different Data Detected");
                  }
                })
              )
          }, 15000)
        })
      )
      .catch(e => {
        this.setState({ noFile: true, exception: e });
        // alert(e)
        console.log(e);
      });
  }

  filter() {
    let shiftOneDay = this.state.shiftOne ? this.state.shiftOne[0] : "";
    let shiftTwoDay = this.state.shiftTwo ? this.state.shiftTwo[0] : "";
    let shiftThreeDay = this.state.shiftThree ? this.state.shiftThree[0] : "";
    let maintBool = this.state.maintBool ? this.state.maintBool : "";
    let spareBool = this.state.spareBool ? this.state.spareBool : "";
    let openBool = this.state.openBool ? this.state.openBool : "";
    let otherBool = this.state.otherBool ? this.state.otherBool : "";
    let deletedColumns = this.state.deletedColumns
      ? this.state.deletedColumns
      : [];
    let deletedRows = this.state.deletedRows
      ? this.state.deletedRows.map(i => i["FLIGHT;BBW"] + " " + i["GATE;BBW"])
      : [];
    let columnOrder = this.state.columnOrder ? this.state.columnOrder : [];
    let selectedRows = this.state.selectedRows
      ? this.state.selectedRows.map(i => i["FLIGHT;BBW"] + i["GATE;BBW"])
      : [];
    let showSelectedOnly = this.state.showSelectedOnly
      ? this.state.showSelectedOnly
      : "";
    let hideSelectedOnly = this.state.hideSelectedOnly
      ? this.state.hideSelectedOnly
      : "";
    let content = this.state.fileLinesContent
      ? this.state.fileLinesContent
        .reduce((acc, c) => {
          let weekDay = c["SHIFT;BBW"]
            ? c["SHIFT;BBW"].split(";")[0].replace("_", "-")
            : "";
          if (!deletedRows.includes(c["FLIGHT;BBW"] + " " + c["GATE;BBW"])) {
            let newObj = Object.keys(c).reduce((newObj, key) => {
              if (!deletedColumns.includes(key)) {
                newObj[key] = c[key];
              }
              return newObj;
            }, {});

            if (this.state.shiftBools["shiftOne"]) {
              if (shiftOneDay.includes(weekDay)) {
                acc.push(newObj);
              }
            }
            if (this.state.shiftBools["shiftTwo"]) {
              if (shiftTwoDay.includes(weekDay)) {
                acc.push(newObj);
              }
            }
            if (this.state.shiftBools["shiftThree"]) {
              if (shiftThreeDay.includes(weekDay)) {
                acc.push(newObj);
              }
            }
          }
          return acc;
        }, [])
        .filter(obj => {
          let flightType = obj["FLIGHT;BBW"]
            ? obj["FLIGHT;BBW"].split(";")[0].trim()
            : "";
          if (!maintBool) {
            if (flightType === "MAINT") {
              return false;
            }
          }
          if (!spareBool) {
            if (flightType === "SPARE") {
              return false;
            }
          }
          if (!openBool) {
            if (flightType === "OPEN") {
              return false;
            }
          }
          if (!otherBool) {
            if (
              flightType !== "MAINT" &&
              flightType !== "SPARE" &&
              flightType !== "OPEN"
            ) {
              return false;
            }
          }
          return true;
        })
        .reduce((arr, obj) => {
          if (columnOrder.length > 0) {
            let newObj = {};
            columnOrder.forEach(k => (newObj[k] = obj[k]));
            arr.push(newObj);
            return arr;
          } else {
            arr.push(obj);
            return arr;
          }
        }, [])
        .filter(i => {
          if (hideSelectedOnly) {
            if (selectedRows.includes(i["FLIGHT;BBW"] + i["GATE;BBW"])) {
              return false;
            }
            return true;
          }
          if (showSelectedOnly) {
            if (selectedRows.includes(i["FLIGHT;BBW"] + i["GATE;BBW"])) {
              return true;
            }
            return false;
          }
          return true;
        })
      : "";

    if (this.state.isSorted) {
      this.onSort(this.state.isSorted, content, null);
    } else {
      this.setState({
        currentContent: content
      });
    }
  }

  refresh() {
    this.setState(
      {
        refresh: !this.state.refresh
      },
      () => {
        if (this.state.refresh) {
          let location = this.props.location.pathname;
          let formatLocation =
            location.slice(-5) === "INLET" || location.slice(-5) === "DEICE"
              ? location.slice(1, -6)
              : location.slice(1);
          this.setState({
            timer: setInterval(() => {
              fetch(FOLDER + `${formatLocation}.csv`)
                .then((response) =>
                  response.json().then(data => {
                    if (
                      JSON.stringify(data) ===
                      JSON.stringify(this.state.fileLines)
                    ) {
                      console.log("Data unchanged.");
                    } else {
                      this.setState({
                        shiftOne: data[0]
                          .split(",")
                          .filter(
                            (item, i) => i > 1 && i < 4 && item.trim() !== ""
                          ),
                        shiftTwo: data[1]
                          .split(",")
                          .filter(
                            (item, i) => i > 1 && i < 4 && item.trim() !== ""
                          ),
                        shiftThree: data[2]
                          .split(",")
                          .filter(
                            (item, i) => i > 1 && i < 4 && item.trim() !== ""
                          ),
                        misc: data[3].split(","),
                        maints:
                          location.slice(-5) === "INLET" ||
                            location.slice(-5) === "DEICE"
                            ? ""
                            : data[2]
                              .split(",")
                              .filter(i => i.includes("Maint"))[0],
                        spares:
                          location.slice(-5) === "INLET" ||
                            location.slice(-5) === "DEICE"
                            ? ""
                            : data[2]
                              .split(",")
                              .filter(i => i.includes("Spare"))[0],
                        opens:
                          location.slice(-5) === "INLET" ||
                            location.slice(-5) === "DEICE"
                            ? ""
                            : data[2]
                              .split(",")
                              .filter(i => i.includes("Open"))[0],
                        fileLines: data,
                        fileLinesContent: data
                          .filter(
                            (item, i) =>
                              i > 3 &&
                              item.match(/^\w/) &&
                              item !== "NULL" &&
                              item.trim() !== ""
                          )
                          .map((j, k) => {
                            if (k === 0) {
                            }
                            let obj = {};
                            for (var h = 0; h < data[4].length; h++) {
                              obj[data[4].split(",")[h]] = j.split(",")[h];
                            }
                            obj["row"] = k;
                            return obj;
                          }),
                        currentDate: data[0].split(",")[4],
                        currentTime: data[0].split(",")[6]
                      }, () => {
                        if (!location.slice(-5) === "INLET" || !location.slice(-5) === "DEICE") {
                          this.setState({
                            availableMaints: parseInt(
                              this.state.maints.match(/\d+/)[0]
                            ),
                            availableSpares: parseInt(
                              this.state.spares.match(/\d+/)[0]
                            ),
                            availableOpens: parseInt(this.state.opens.match(/\d+/)[0])
                          })
                        }
                        this.filter()
                        return;
                      });
                      console.log("Different Data Detected");
                    }
                  })
                )
            }, 15000)
          });
        } else {
          clearInterval(this.state.timer);
        }
      }
    );
  }

  resetColumns() {
    this.setState(
      {
        deletedColumns: [],
        selectedColumn: "",
        columnOrder: []
      },
      () => this.filter()
    );
  }

  resetFlights() {
    this.setState(
      {
        deletedRows: [],
        shiftOne: this.state.initialState.shiftOne,
        shiftTwo: this.state.initialState.shiftTwo,
        shiftThree: this.state.initialState.shiftThree,
        maints: this.state.initialState.maints,
        spares: this.state.initialState.spares,
        opens: this.state.initialState.opens,
        maintBool: true,
        spareBool: true,
        openBool: true,
        otherBool: true,
        showSelectedOnly: false,
        hideSelectedOnly: false,
        selectedRows: []
      },
      () => this.filter()
    );
  }

  showSelected() {
    let show = this.state.showSelectedOnly;

    if (show) {
      this.setState({ showSelectedOnly: false }, () => this.filter());
    } else {
      this.setState({ showSelectedOnly: true, hideSelectedOnly: false }, () =>
        this.filter()
      );
    }
  }

  hideSelected() {
    let hide = this.state.hideSelectedOnly;
    if (hide) {
      this.setState({ hideSelectedOnly: false }, () => this.filter());
    } else {
      this.setState({ showSelectedOnly: false, hideSelectedOnly: true }, () =>
        this.filter()
      );
    }
  }

  handleColumnExceptionSort(column, content, clicked) {
    // let direction = this.state.direction;

    let direction = this.state.columnDirections[column]

    let sortedData = content.sort((a, b) => {
      if (a[column]) {
        let nameA = a[column]
          .split(";")[1]
          .toUpperCase()
          .trim();
        let nameB = b[column]
          .split(";")[1]
          .toUpperCase()
          .trim();
        if (nameA === "") {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        if (nameA === nameB) {
          nameA = a["FLIGHT;BBW"]
            .split(";")[1]
            .toUpperCase()
            .trim();
          nameB = b["FLIGHT;BBW"]
            .split(";")[1]
            .toUpperCase()
            .trim();
          if (nameA === "") {
            return 1;
          }
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        }
      }
      return 0;
    });

    if (clicked) {
      if (direction) {
        sortedData.reverse();
      }
      this.setState({
        currentContent: sortedData,
        columnDirections: {...this.state.columnDirections, [column]: !this.state.columnDirections[column]}  
      });
    } else {
      this.setState({
        currentContent: sortedData
      });
    }
  }

  handleFlightSort(column, content, clicked) {
    // let direction = this.state.direction;

    let direction = this.state.columnDirections[column]

    let sortedData = content.sort((a, b) => {
      let nameA = a["FLIGHT;BBW"]
        .split(";")[0]
        .toUpperCase()
        .trim();
      let nameB = b["FLIGHT;BBW"]
        .split(";")[0]
        .toUpperCase()
        .trim();
      if (nameA === "") {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      if (nameA === nameB) {
        nameA = a["GATE;BBW"]
          .split(";")[0]
          .toUpperCase()
          .trim();
        nameB = b["GATE;BBW"]
          .split(";")[0]
          .toUpperCase()
          .trim();
        if (nameA === "") {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      }

      return 0;
    });

    if (clicked) {
      if (direction) {
        sortedData.reverse();
      }
      this.setState({
        currentContent: sortedData,
        columnDirections: {...this.state.columnDirections, [column]: !this.state.columnDirections[column]}  
      });
    } else {
      this.setState({
        currentContent: sortedData
      });
    }
  }

  onSort(column, content, clicked) {
    if (this.state.middleClick) {
      this.deleteColumn(column);
    } else if (this.state.rightClick) {
      if (clicked) {
        this.selectColumn(column);
      }
    } else {

      this.setState({ isSorted: column });

      if (column === "FLIGHT;BBW") {
        this.setState({ isSecondarySorted: "GATE;BBW" });
        this.handleFlightSort(column, content, clicked);
      } else if (
        column === "AC;BBW" ||
        column === "GATE;BBW" ||
        column === "STA;BBW" ||
        column === "STD;BBW" ||
        column === "BCON;BBW" ||
        column === "PUSH;BBW" ||
        column === "TAXI;BBW" ||
        column === "OUT;BBW" ||
        column === "OFF;BBW" ||
        column === "I/R;BBW" ||
        column === "IN;BBW" ||
        column === "ON;BBW" ||
        column === "IREQ;BBW" ||
        column === "ISTR;BBW" ||
        column === "ICMP;BBW" ||
        column === "DREQ;BBW" ||
        column === "ONPD;BBW" ||
        column === "OFPD;BBW" ||
        column === "OUT;BBW"
      ) {
        this.setState({ isSecondarySorted: "FLIGHT;BBW" });
        this.handleColumnExceptionSort(column, content, clicked);
      } else {
        let type = this.state.rmas[1].split(";")[0];
        type === "INBOUND"
          ? this.setState({ isSecondarySorted: "STA;BBW" })
          : this.setState({ isSecondarySorted: "STD;BBW" });

        // let direction = this.state.direction;
        let direction = this.state.columnDirections[column]

        let sortedData = content.sort((a, b) => {
          if (a[column]) {
            let nameA = a[column]
              .split(";")[0]
              .toUpperCase()
              .trim();
            let nameB = b[column]
              .split(";")[0]
              .toUpperCase()
              .trim();

            if (nameA === "") {
              return 1;
            }
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            if (nameA === nameB) {
              if (type === "INBOUND") {
                if (a["STA;BBW"]) {
                  nameA = a["STA;BBW"]
                    .split(";")[0]
                    .toUpperCase()
                    .trim();
                  nameB = b["STA;BBW"]
                    .split(";")[0]
                    .toUpperCase()
                    .trim();
                  if (nameA === "") {
                    return 1;
                  }
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                }
              } else {
                if (a["STD;BBW"]) {
                  nameA = a["STD;BBW"]
                    .split(";")[0]
                    .toUpperCase()
                    .trim();
                  nameB = b["STD;BBW"]
                    .split(";")[0]
                    .toUpperCase()
                    .trim();
                  if (nameA === "") {
                    return 1;
                  }
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                }
              }
            }
          }
          return 0;
        });

        // if (!direction && clicked) {
        //   sortedData.sort((a, b) => {
        //     let nameA = a[column]
        //       .split(";")[0]
        //       .toUpperCase()
        //       .trim();
        //     let nameB = b[column]
        //       .split(";")[0]
        //       .toUpperCase()
        //       .trim();
        //     if (nameA === "") {
        //       return 1;
        //     }
        //     if (nameA < nameB) {
        //       return 1;
        //     }
        //     if (nameA > nameB) {
        //       return -1;
        //     }
        //     if (nameA === nameB) {
        //       if (type === "INBOUND") {
        //         if (a["STA;BBW"]) {
        //           nameA = a["STA;BBW"]
        //             .split(";")[0]
        //             .toUpperCase()
        //             .trim();
        //           nameB = b["STA;BBW"]
        //             .split(";")[0]
        //             .toUpperCase()
        //             .trim();
        //           if (nameA === "") {
        //             return 1;
        //           }
        //           if (nameA < nameB) {
        //             return -1;
        //           }
        //           if (nameA > nameB) {
        //             return 1;
        //           }
        //         }
        //       } else {
        //         if (a["STD;BBW"]) {
        //           nameA = a["STD;BBW"]
        //             .split(";")[0]
        //             .toUpperCase()
        //             .trim();
        //           nameB = b["STD;BBW"]
        //             .split(";")[0]
        //             .toUpperCase()
        //             .trim();
        //           if (nameA === "") {
        //             return 1;
        //           }
        //           if (nameA < nameB) {
        //             return -1;
        //           }
        //           if (nameA > nameB) {
        //             return 1;
        //           }
        //         }
        //       }
        //     }
        //     return 0;
        //   });
        // }

        if (clicked) {
          if (direction) {
            sortedData.reverse();
          }
          this.setState({
            currentContent: sortedData,
            columnDirections: {...this.state.columnDirections, [column]: !this.state.columnDirections[column]}
          });
        } else {
          this.setState({
            currentContent: sortedData
          });
        }
      }
    }
  }

  onCheck(name) {
    this.setState(
      {
        shiftBools: {
          ...this.state.shiftBools,
          [name]: !this.state.shiftBools[name]
        }
      },
      () => this.filter()
    );
  }

  onCheckException(exception) {
    if (exception.trim().startsWith("Maint")) {
      this.setState(
        {
          maintBool: !this.state.maintBool
        },
        () => this.filter()
      );
    } else if (exception.trim().startsWith("Spare")) {
      this.setState(
        {
          spareBool: !this.state.spareBool
        },
        () => this.filter()
      );
    } else if (exception.trim().startsWith("Open")) {
      this.setState(
        {
          openBool: !this.state.openBool
        },
        () => this.filter()
      );
    } else if (exception.startsWith("Flights ")) {
      this.setState(
        {
          otherBool: !this.state.otherBool
        },
        () => this.filter()
      );
    }
  }

  deleteColumn(column) {
    let deletedColumns = this.state.deletedColumns;
    if (!column.startsWith("FLIGHT") && !column.startsWith("GATE")) {
      deletedColumns.push(column);
    }
    let currentContent = this.state.currentContent.map(i => {
      return Object.keys(i).reduce((newObj, k) => {
        if (k !== column) {
          newObj[k] = i[k];
        } else if (column.startsWith("FLIGHT") || column.startsWith("GATE")) {
          newObj[k] = i[k];
        }
        return newObj;
      }, {});
    });
    this.setState({
      currentContent: currentContent,
      deletedColumns: deletedColumns,
      columnOrder: Object.keys(currentContent[0])
    });
  }

  handleOnMouseDownTh(e, column) {
    e.preventDefault();

    if (e.button === 1) {
      this.deleteColumn(column);
    }
  }

  selectColumn(column) {
    document.getElementsByClassName("App")[0].focus();
    this.setState({
      selectedColumn: this.state.selectedColumn === column ? "" : column
    });
  }

  handleRightClickTh(e, column) {
    e.preventDefault();
    this.selectColumn(column);
  }

  leftArrowKey(selectedColumn, currentContent, columns, columnsLength, index) {
    if (index > 0) {
      let tmp = columns[index];
      columns[index] = columns[index - 1];
      columns[index - 1] = tmp;

      let newRows = currentContent.map(obj => {
        let keys = Object.keys(obj);
        let keyTmp = keys[index];
        keys[index] = keys[index - 1];
        keys[index - 1] = keyTmp;
        let newObj = keys.reduce((o, c) => {
          o[c] = obj[c];
          return o;
        }, {});
        return newObj;
      });

      // let selectedColumIndex = Object.keys(currentContent[0]).indexOf(selectedColumn)

      let selectedTd = this.state.selectedTd;

      this.setState({
        // selectedTd: selectedTd ? selectedTd[1] === selectedColumIndex ? [selectedTd[0], selectedTd[1] - 1] : selectedTd : [],
        currentContent: newRows,
        columnOrder: Object.keys(newRows[0])
      });
    }
  }

  rightArrowKey(selectedColumn, currentContent, columns, columnsLength, index) {
    if (index < columnsLength - 1) {
      let tmp = columns[index];
      columns[index] = columns[index + 1];
      columns[index + 1] = tmp;

      let newRows = currentContent.map(obj => {
        let keys = Object.keys(obj);
        let keyTmp = keys[index];
        keys[index] = keys[index + 1];
        keys[index + 1] = keyTmp;
        let newObj = keys.reduce((o, c) => {
          o[c] = obj[c];
          return o;
        }, {});
        return newObj;
      });

      // let selectedColumIndex = Object.keys(currentContent[0]).indexOf(selectedColumn)

      let selectedTd = this.state.selectedTd;

      this.setState({
        // selectedTd: selectedTd ? selectedTd[1] === selectedColumIndex ? [selectedTd[0], selectedTd[1] + 1] : selectedTd : [],
        currentContent: newRows,
        columnOrder: Object.keys(newRows[0])
      });
    }
  }

  handleKeyPress(e) {
    if (this.state.selectedColumn) {
      if (e.keyCode === 37 || e.keyCode === 39) {
        e.preventDefault();
        let selectedColumn = this.state.selectedColumn;
        let currentContent = this.state.currentContent;
        let columns = Object.keys(currentContent[0]);
        let columnsLength = columns.length;
        let index = columns.indexOf(selectedColumn);

        if (e.keyCode === 37) {
          this.leftArrowKey(
            selectedColumn,
            currentContent,
            columns,
            columnsLength,
            index
          );
          // if (index > 0) {
          //   let tmp = columns[index];
          //   columns[index] = columns[index - 1];
          //   columns[index - 1] = tmp;

          //   let newRows = currentContent.map(obj => {
          //     let keys = Object.keys(obj);
          //     let keyTmp = keys[index];
          //     keys[index] = keys[index - 1];
          //     keys[index - 1] = keyTmp;
          //     let newObj = keys.reduce((o, c) => {
          //       o[c] = obj[c];
          //       return o;
          //     }, {});
          //     return newObj;
          //   });
          //   this.setState({
          //     currentContent: newRows,
          //     columnOrder: Object.keys(newRows[0])
          //   });
          // }
        } else {
          this.rightArrowKey(
            selectedColumn,
            currentContent,
            columns,
            columnsLength,
            index
          );
          // if (index < columnsLength - 1) {
          //   let tmp = columns[index];
          //   columns[index] = columns[index + 1];
          //   columns[index + 1] = tmp;

          //   let newRows = currentContent.map(obj => {
          //     let keys = Object.keys(obj);
          //     let keyTmp = keys[index];
          //     keys[index] = keys[index + 1];
          //     keys[index + 1] = keyTmp;
          //     let newObj = keys.reduce((o, c) => {
          //       o[c] = obj[c];
          //       return o;
          //     }, {});
          //     return newObj;
          //   });
          //   this.setState({
          //     currentContent: newRows,
          //     columnOrder: Object.keys(newRows[0])
          //   });
          // }
        }
      }
    }
  }

  selectRow(i) {
    let selectedRows = this.state.selectedRows;
    let selectedRowsPK = selectedRows.map(j => j["FLIGHT;BBW"] + j["GATE;BBW"]);

    if (selectedRowsPK.includes(i["FLIGHT;BBW"] + i["GATE;BBW"])) {
      this.setState({
        selectedRows: selectedRows.filter(
          k =>
            k["FLIGHT;BBW"] + k["GATE;BBW"] !== i["FLIGHT;BBW"] + i["GATE;BBW"]
        )
      });
    } else {
      selectedRows.push(i);
      this.setState({ selectedRows: selectedRows });
    }
  }

  handleRightClickRow(e, i) {
    e.preventDefault();
    this.selectRow(i);
  }

  handleClick(e, i) {
    e.preventDefault();

    if (e.button === 0) {
      if (this.state.middleClick) {
        this.deleteRow(i);
      } else if (this.state.rightClick) {
        this.selectRow(i);
      }
    } else if (e.button === 1) {
      this.deleteRow(i);
    } else if (e.button === 2) {
    }
  }

  deleteRow(i) {
    let currentRow = Object.values(i).join("");
    // let shift = i["SHIFT;BBW"] ? i["SHIFT;BBW"].split(";")[0].trim() : "";
    // let shiftFlight = i["FLIGHT;BBW"]
    //   ? i["FLIGHT;BBW"].split(";")[0].trim()
    //   : "";

    // let shiftOne = this.state.shiftOne;
    // let shiftTwo = this.state.shiftTwo;
    // let shiftThree = this.state.shiftThree;

    // let maints = this.state.maints;
    // let spares = this.state.spares;
    // let opens = this.state.opens;

    let deletedRows = this.state.deletedRows;

    // if (shiftOne[0].split(" ")[0] === shift) {
    //   if (
    //     !parseInt(shiftOne[1].replace(/\D/g, "") - 1 < 0) &&
    //     (shiftFlight !== "OPEN" &&
    //       shiftFlight !== "MAINT" &&
    //       shiftFlight !== "SPARE")
    //   ) {
    //     let decrement = parseInt(shiftOne[1].replace(/\D/g, "")) - 1;
    //     shiftOne = [
    //       shiftOne[0],
    //       "Flights  " + decrement + ";" + shiftOne[1].split(";")[1]
    //     ];
    //     this.setState({ shiftOne: shiftOne });
    //   } else {
    //     if (shiftFlight === "OPEN") {
    //       let decrement = parseInt(opens.replace(/\D/g, "")) - 1;
    //       opens = "Open " + decrement + opens.slice(-4);
    //       this.setState({ opens: opens });
    //     } else if (shiftFlight === "MAINT") {
    //       let decrement = parseInt(maints.replace(/\D/g, "")) - 1;
    //       maints = "Maint " + decrement + maints.slice(-4);
    //       this.setState({ maints: maints });
    //     } else if (shiftFlight === "SPARE") {
    //       let decrement = parseInt(spares.replace(/\D/g, "")) - 1;
    //       spares = "Spare " + decrement + spares.slice(-4);
    //       this.setState({ spares: spares });
    //     }
    //   }
    // } else if (shiftTwo[0].split(" ")[0] === shift) {
    //   if (
    //     !parseInt(shiftTwo[1].replace(/\D/g, "") - 1 < 0) &&
    //     (shiftFlight !== "OPEN" &&
    //       shiftFlight !== "MAINT" &&
    //       shiftFlight !== "SPARE")
    //   ) {
    //     let decrement = parseInt(shiftTwo[1].replace(/\D/g, "")) - 1;
    //     shiftTwo = [
    //       shiftTwo[0],
    //       "Flights  " + decrement + ";" + shiftTwo[1].split(";")[1]
    //     ];
    //     this.setState({ shiftTwo: shiftTwo });
    //   } else {
    //     if (shiftFlight === "OPEN") {
    //       let decrement = parseInt(opens.replace(/\D/g, "")) - 1;
    //       opens = "Open " + decrement + opens.slice(-4);
    //       this.setState({ opens: opens });
    //     } else if (shiftFlight === "MAINT") {
    //       let decrement = parseInt(maints.replace(/\D/g, "")) - 1;
    //       maints = "Maint " + decrement + maints.slice(-4);
    //       this.setState({ maints: maints });
    //     } else if (shiftFlight === "SPARE") {
    //       let decrement = parseInt(spares.replace(/\D/g, "")) - 1;
    //       spares = "Spare " + decrement + spares.slice(-4);
    //       this.setState({ spares: spares });
    //     }
    //   }
    // } else if (shiftThree[0].split(" ")[0] === shift) {
    //   if (
    //     !parseInt(shiftThree[1].replace(/\D/g, "") - 1 < 0) &&
    //     (shiftFlight !== "OPEN" &&
    //       shiftFlight !== "MAINT" &&
    //       shiftFlight !== "SPARE")
    //   ) {
    //     let decrement = parseInt(shiftThree[1].replace(/\D/g, "")) - 1;
    //     shiftThree = [
    //       shiftThree[0],
    //       "Flights  " + decrement + ";" + shiftThree[1].split(";")[1]
    //     ];
    //     this.setState({ shiftThree: shiftThree });
    //   } else {
    //     if (shiftFlight === "OPEN") {
    //       let decrement = parseInt(opens.replace(/\D/g, "")) - 1;
    //       opens = "Open " + decrement + opens.slice(-4);
    //       this.setState({ opens: opens });
    //     } else if (shiftFlight === "MAINT") {
    //       let decrement = parseInt(maints.replace(/\D/g, "")) - 1;
    //       maints = "Maint " + decrement + maints.slice(-4);
    //       this.setState({ maints: maints });
    //     } else if (shiftFlight === "SPARE") {
    //       let decrement = parseInt(spares.replace(/\D/g, "")) - 1;
    //       spares = "Spare " + decrement + spares.slice(-4);
    //       this.setState({ spares: spares });
    //     }
    //   }
    // }

    this.setState({
      currentContent: this.state.currentContent.reduce((arr, obj) => {
        let row = Object.values(obj).join("");
        if (!(row === currentRow)) {
          arr.push(obj);
        } else {
          deletedRows.push(obj);
        }
        return arr;
      }, [])
    });
  }

  displayHelp() {
    this.setState({ help: !this.state.help });
  }

  exportContent() {
    let titles =
      Object.keys(this.state.currentContent[0])
        .map(i => i.split(";")[0])
        .filter(j => j !== "undefined" && j !== "row")
        .join(",") + "\n";
    let currentContent = this.state.currentContent
      .map(i =>
        Object.values(i)
          .filter(k => k !== undefined && typeof k !== "number")
          .map(j => {
            return j.split(";")[j.split(";").length - 2];
          })
          .join(",")
      )
      .join("\n");
    let csv = "data:text/csv;charset=utf-8," + titles + currentContent;

    let encodedUri = encodeURI(csv);

    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  handlePrint() {
    document.getElementsByTagName("table")[0].style.height = "100%";
    window.print();
    document.getElementsByTagName("table")[0].style.height = "80vh";
  }

  leftClickMode() {
    if (!this.state.leftClick) {
      this.setState({ leftClick: true, middleClick: false, rightClick: false });
    }
  }

  middleClickMode() {
    if (!this.state.middleClick) {
      this.setState({ middleClick: true, leftClick: false, rightClick: false });
    }
  }

  rightClickMode() {
    if (!this.state.rightClick) {
      this.setState({ rightClick: true, leftClick: false, middleClick: false });
    }
  }

  moveColumnLeft(e) {
    e.preventDefault();
    let selectedColumn = this.state.selectedColumn;
    let currentContent = this.state.currentContent;
    let columns = Object.keys(currentContent[0]);
    let columnsLength = columns.length;
    let index = columns.indexOf(selectedColumn);
    this.leftArrowKey(
      selectedColumn,
      currentContent,
      columns,
      columnsLength,
      index
    );
  }

  moveColumnRight(e) {
    e.preventDefault();
    let selectedColumn = this.state.selectedColumn;
    let currentContent = this.state.currentContent;
    let columns = Object.keys(currentContent[0]);
    let columnsLength = columns.length;
    let index = columns.indexOf(selectedColumn);
    this.rightArrowKey(
      selectedColumn,
      currentContent,
      columns,
      columnsLength,
      index
    );
  }

  handleOnClickTd(rowKeyValue, objectKeyIndex) {

    // let selectedTd = rowObject['row'] + ":" + objectKeyIndex;
    // let selectedTd = [rowObject, objectKeyIndex]
    // this.setState({ selectedTd: this.state.selectedTd[0] === selectedTd[0] && this.state.selectedTd[1] === selectedTd[1] ? "" : selectedTd })
    if (this.state.leftClick) {
      this.setState({ selectedTd: this.state.selectedTd ? this.state.selectedTd[0] === rowKeyValue && this.state.selectedTd[1] === objectKeyIndex ? [] : [rowKeyValue, objectKeyIndex] : [rowKeyValue, objectKeyIndex] })
    }

  }

  render() {
    const maintBool = this.state.maintBool ? this.state.maintBool : "";
    const spareBool = this.state.spareBool ? this.state.spareBool : "";
    const openBool = this.state.openBool ? this.state.openBool : "";
    const otherBool = this.state.otherBool ? this.state.otherBool : "";
    const content = this.state.currentContent ? this.state.currentContent : [];
    const misc = this.state.misc ? this.state.misc : "";
    const maints = this.state.maints ? this.state.maints : "";
    const spares = this.state.spares ? this.state.spares : "";
    const opens = this.state.opens ? this.state.opens : "";
    const availableMaints = this.state.availableMaints
      ? this.state.availableMaints
      : "";
    const availableSpares = this.state.availableSpares
      ? this.state.availableSpares
      : "";
    const availableOpens = this.state.availableOpens
      ? this.state.availableOpens
      : "";
    const currentTime = this.state.currentTime ? this.state.currentTime : "";
    const currentDate = this.state.currentDate ? this.state.currentDate : "";
    const shiftBools = this.state.shiftBools ? this.state.shiftBools : "";
    const title = this.state.rmas ? this.state.rmas : "";
    const shiftOne = this.state.shiftOne ? this.state.shiftOne : "";
    const shiftTwo = this.state.shiftTwo ? this.state.shiftTwo : "";
    const shiftThree = this.state.shiftThree ? this.state.shiftThree : "";
    const location = this.props.location.pathname;
    const noFile = this.state.noFile ? this.state.noFile : "";
    const help = this.state.help ? this.state.help : "";
    const selectedRows = this.state.selectedRows ? this.state.selectedRows : "";
    const iPadHelp = this.state.iPadHelp ? this.state.iPadHelp : "";
    const exception = this.state.exception ? this.state.exception : "";
    const selectedTd = this.state.selectedTd ? this.state.selectedTd : "";
    const shiftOneFlights = shiftOne
      ? parseInt(shiftOne[1].match(/\d+/)[0])
      : 0;
    const shiftTwoFlights = shiftTwo
      ? parseInt(shiftTwo[1].match(/\d+/)[0])
      : 0;
    const shiftThreeFlights = shiftThree
      ? parseInt(shiftThree[1].match(/\d+/)[0])
      : 0;

    const availableFlights = Object.keys(shiftBools)
      .filter(i => shiftBools[i])
      .reduce(
        (num, c) =>
          c === "shiftOne"
            ? (num += shiftOneFlights)
            : c === "shiftTwo"
              ? (num += shiftTwoFlights)
              : c === "shiftThree"
                ? (num += shiftThreeFlights)
                : (num += 0),
        0
      );


    return noFile ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh"
        }}
      >
        <h1>No File Found</h1>

        <NavLink to={"/home"}>
          <Button variant="outline-secondary" className="home">
            Home
          </Button>
        </NavLink>
      </div>
    ) : (
        <div className="app-container">
          <div
            id="main"
            className="App"
            tabIndex="0"
            onKeyDown={this.handleKeyPress.bind(this)}
          >
            <div className="App-header">
              <div className="header-content">
                <div className="header-content-left">
                  <Title
                    className={title ? title[0].slice(-3) : ""}
                    text={title ? title[0].slice(0, -4) : ""}
                  />
                  <Title
                    className={title ? title[1].slice(-3) : ""}
                    text={title ? title[1].slice(0, -4) : ""}
                  />
                  <Title
                    className={title ? title[2].slice(-3) : ""}
                    text={title ? title[2].slice(0, -4) : ""}
                  />
                </div>
                <div className="header-content-middle">
                  <div className="shifts">
                    <CheckboxShift
                      id="shiftOne"
                      lClassName={shiftOne ? shiftOne[0].slice(-3) : ""}
                      name={"shiftOne"}
                      shiftActive={shiftBools.shiftOne}
                      onCheck={this.onCheck.bind(this)}
                      inputText={shiftOne ? shiftOne[0].slice(0, -4) : ""}
                      pClassName={shiftOne ? shiftOne[1].slice(-3) : ""}
                      pText={shiftOne ? shiftOne[1].slice(0, -4) : ""}
                      isDisabled={this.state.middleClick || this.state.rightClick}
                      style={{
                        color:
                          this.state.middleClick || this.state.rightClick
                            ? "grey"
                            : ""
                      }}
                    />
                    <CheckboxShift
                      id="shiftTwo"
                      lClassName={shiftTwo ? shiftTwo[0].slice(-3) : ""}
                      name={"shiftTwo"}
                      shiftActive={shiftBools.shiftTwo}
                      onCheck={this.onCheck.bind(this)}
                      inputText={shiftTwo ? shiftTwo[0].slice(0, -4) : ""}
                      pClassName={shiftTwo ? shiftTwo[1].slice(-3) : ""}
                      pText={shiftTwo ? shiftTwo[1].slice(0, -4) : ""}
                      isDisabled={this.state.middleClick || this.state.rightClick}
                      style={{
                        color:
                          this.state.middleClick || this.state.rightClick
                            ? "grey"
                            : ""
                      }}
                    />
                    <CheckboxShift
                      id="shiftThree"
                      lClassName={shiftThree ? shiftThree[0].slice(-3) : ""}
                      name={"shiftThree"}
                      shiftActive={shiftBools.shiftThree}
                      onCheck={this.onCheck.bind(this)}
                      inputText={shiftThree ? shiftThree[0].slice(0, -4) : ""}
                      pClassName={shiftThree ? shiftThree[1].slice(-3) : ""}
                      pText={shiftThree ? shiftThree[1].slice(0, -4) : ""}
                      isDisabled={this.state.middleClick || this.state.rightClick}
                      style={{
                        color:
                          this.state.middleClick || this.state.rightClick
                            ? "grey"
                            : ""
                      }}
                    />
                  </div>
                </div>
                <div className="header-content-buttons">
                  <div className="header-content-buttons-row">
                    <Button
                      id="show-selected"
                      size="sm"
                      style={{ width: "100%", margin: "2px 0 2px 0" }}
                      variant={
                        this.state.showSelectedOnly
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => this.showSelected()}
                      className=""
                      disabled={this.state.middleClick || this.state.rightClick}
                    >
                      Show <br /> Selected
                  </Button>
                  </div>
                  <div className="header-content-buttons-row">
                    <Button
                      id="hide-selected"
                      size="sm"
                      style={{ width: "100%", margin: "2px 0 2px 0" }}
                      variant={
                        this.state.hideSelectedOnly
                          ? "primary"
                          : "outline-primary"
                      }
                      onClick={() => this.hideSelected()}
                      className=""
                      disabled={this.state.middleClick || this.state.rightClick}
                    >
                      Hide <br /> Selected
                  </Button>
                  </div>
                </div>
                <div className="header-content-buttons-reset">
                  <div className="header-content-buttons-row">
                    {/* <Button
                  id="delete-column"
                  size="sm"
                  variant={this.state.delete ? "danger" : "outline-danger"}
                  onClick={() => this.delete()}
                  className=""
                >
                  Delete <br /> Column
                </Button> */}
                    <Button
                      id="reset-columns"
                      size="sm"
                      style={{ width: "100%", margin: "2px 0 2px 0" }}
                      variant="outline-danger"
                      onClick={() => this.resetColumns()}
                      className=""
                      disabled={this.state.middleClick || this.state.rightClick}
                    >
                      Reset <br /> Columns
                  </Button>
                  </div>
                  <div className="header-content-buttons-row">
                    <Button
                      id="reset-flights"
                      size="sm"
                      style={{ width: "100%", margin: "2px 0 2px 0" }}
                      variant="outline-danger"
                      onClick={() => this.resetFlights()}
                      className=""
                      disabled={this.state.middleClick || this.state.rightClick}
                    >
                      Reset <br /> Flights
                  </Button>
                  </div>
                </div>
                <div className="header-content-buttons-two">
                  <div className="header-content-buttons-row">
                    <Button
                      id="auto-sizing"
                      size="sm"
                      style={{ width: "100%", margin: "2px 0 2px 0" }}
                      variant={
                        this.state.resizable ? "success" : "outline-success"
                      }
                      onClick={() =>
                        this.setState({ resizable: !this.state.resizable }, () =>
                          resizePage(this.state.resizable)
                        )
                      }
                    >
                      Auto <br /> Sizing
                  </Button>
                  </div>
                  <div className="header-content-buttons-row">
                    <Button
                      id="auto-refresh"
                      size="sm"
                      style={{ width: "100%", margin: "2px 0 2px 0" }}
                      variant={this.state.refresh ? "success" : "outline-success"}
                      onClick={() => this.refresh()}
                      disabled={this.state.middleClick || this.state.rightClick}
                    >
                      Auto <br /> Refresh
                  </Button>
                  </div>
                </div>
                <div className="header-content-buttons-three">
                  <div className="header-content-buttons-row">
                    <NavLink style={{ marginBottom: '5px' }} to={"/home"}>
                      <Button
                        variant="outline-secondary"
                        className="home"
                        size="sm"
                        disabled={this.state.middleClick || this.state.rightClick}
                      >
                        Home
                    </Button>
                    </NavLink>
                    <StationButton
                      isDisabled={this.state.middleClick || this.state.rightClick}
                    />
                  </div>
                  <div
                    style={{ marginTop: "5px" }}
                    className="header-content-buttons-row"
                  >
                    <Button
                      id="ipad-help"
                      variant={
                        this.state.iPadHelp ? "warning" : "outline-warning"
                      }
                      className="home"
                      size="sm"
                      onClick={() =>
                        this.setState({ iPadHelp: !this.state.iPadHelp })
                      }
                      disabled={this.state.middleClick || this.state.rightClick}
                    >
                      Help
                  </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "12px"
                    }}
                  >
                    <FlightException
                      checked={otherBool}
                      onCheckException={this.onCheckException.bind(this)}
                      className={"BBW"}
                      style={{
                        color:
                          this.state.middleClick || this.state.rightClick
                            ? "grey"
                            : ""
                      }}
                      isDisabled={this.state.middleClick || this.state.rightClick}
                      exception={
                        otherBool
                          ? "Flights " +
                          content.reduce(
                            (num, c) =>
                              c["FLIGHT;BBW"] &&
                                !c["FLIGHT;BBW"].startsWith("MAINT") &&
                                !c["FLIGHT;BBW"].startsWith("SPARE") &&
                                !c["FLIGHT;BBW"].includes("OPEN")
                                ? (num += 1)
                                : (num += 0),
                            0
                          )
                          : "Flights " + availableFlights
                      }
                    />
                  </div>
                </div>
                <div className="header-content-right">
                  <div style={{ textAlign: "right" }} />
                  <div className="header-content-right-row-1">
                    <Button
                      id="print"
                      size="sm"
                      style={{ marginRight: "20px" }}
                      variant="outline-success"
                      onClick={() => this.handlePrint()}
                      className={"print-span"}
                    >
                      {"Print"}
                    </Button>
                    <Time
                      className={title ? title[0].slice(-3) : ""}
                      time={
                        currentTime
                          ? currentDate.split(";")[0] +
                          " at " +
                          currentTime.split(";")[0]
                          : ""
                      }
                    />{" "}
                    &nbsp;{"v" + version}
                  </div>

                  <div className="header-content-right-row-2">
                    {location.slice(-5) === "INLET" ||
                      location.slice(-5) === "DEICE" ? (
                        ""
                      ) : (
                        <React.Fragment>
                          <FlightException
                            checked={maintBool}
                            onCheckException={this.onCheckException.bind(this)}
                            style={{
                              margin: "0 10px 0 0",
                              color:
                                this.state.middleClick || this.state.rightClick
                                  ? "grey"
                                  : ""
                            }}
                            className={maints ? maints.split(";")[1] : ""}
                            // exception={maints ? maints.split(";")[0] : ""}
                            exception={
                              maintBool
                                ? "Maint " +
                                content.reduce(
                                  (num, c) =>
                                    c["FLIGHT;BBW"].startsWith("MAINT")
                                      ? (num += 1)
                                      : (num += 0),
                                  0
                                )
                                : "Maint " + availableMaints
                            }
                            isDisabled={
                              this.state.middleClick || this.state.rightClick
                            }
                          />
                          <FlightException
                            checked={spareBool}
                            onCheckException={this.onCheckException.bind(this)}
                            style={{
                              margin: "0 10px 0 0",
                              color:
                                this.state.middleClick || this.state.rightClick
                                  ? "grey"
                                  : ""
                            }}
                            className={spares ? spares.split(";")[1] : ""}
                            // exception={spares ? spares.split(";")[0] : ""}
                            exception={
                              spareBool
                                ? "Spare " +
                                content.reduce(
                                  (num, c) =>
                                    c["FLIGHT;BBW"].startsWith("SPARE")
                                      ? (num += 1)
                                      : (num += 0),
                                  0
                                )
                                : "Spare " + availableSpares
                            }
                            isDisabled={
                              this.state.middleClick || this.state.rightClick
                            }
                          />
                          <FlightException
                            checked={openBool}
                            onCheckException={this.onCheckException.bind(this)}
                            style={{
                              color:
                                this.state.middleClick || this.state.rightClick
                                  ? "grey"
                                  : ""
                            }}
                            className={opens ? opens.split(";")[1] : ""}
                            // exception={opens ? opens.split(";")[0] : ""}
                            exception={
                              openBool
                                ? "Open " +
                                content.reduce(
                                  (num, c) =>
                                    c["FLIGHT;BBW"].includes("OPEN")
                                      ? (num += 1)
                                      : (num += 0),
                                  0
                                )
                                : "Open " + availableOpens
                            }
                            isDisabled={
                              this.state.middleClick || this.state.rightClick
                            }
                          />
                        </React.Fragment>
                      )}
                  </div>
                  <div className="header-content-right-row-3">
                    <Button
                      id="left-click"
                      size="sm"
                      variant={
                        this.state.leftClick ? "secondary" : "outline-secondary"
                      }
                      onClick={() => this.leftClickMode()}
                      className=""
                    >
                      Left
                    <br /> Action
                  </Button>
                    <Button
                      id="middle-click"
                      size="sm"
                      variant={
                        this.state.middleClick ? "secondary" : "outline-secondary"
                      }
                      onClick={() => this.middleClickMode()}
                      className=""
                    >
                      Middle <br /> Delete
                  </Button>
                    <Button
                      id="right-click"
                      size="sm"
                      variant={
                        this.state.rightClick ? "secondary" : "outline-secondary"
                      }
                      onClick={() => this.rightClickMode()}
                      className=""
                    >
                      Right <br /> Select
                  </Button>
                  </div>
                  {this.state.rightClick && this.state.selectedColumn ? (
                    <div className="header-content-right-row-4">
                      <Button
                        id="move-left"
                        size="sm"
                        variant={"info"}
                        onClick={e => this.moveColumnLeft(e)}
                        className=""
                      >
                        Move <br /> Left
                    </Button>
                      <Button
                        id="move-right"
                        size="sm"
                        variant={"info"}
                        onClick={e => this.moveColumnRight(e)}
                        className=""
                      >
                        Move <br /> Right
                    </Button>
                    </div>
                  ) : (
                      ""
                    )}
                </div>
              </div>
              {misc ? (
                <Misc
                  help={help}
                  misc={misc}
                  displayHelp={this.displayHelp.bind(this)}
                  exportContent={this.exportContent.bind(this)}
                />
              ) : (
                  ""
                )}
              {iPadHelp ? <IpadHelp /> : ""}
            </div>

            <div className="App-content">
              <FlightTableB
                currentTime={
                  this.state.currentTime
                    ? this.state.currentTime.split(";")[0]
                    : ""
                }
                sorted={this.state.isSorted}
                secondarySorted={this.state.isSecondarySorted}
                selected={this.state.selectedColumn}
                handleRightClickTh={this.handleRightClickTh.bind(this)}
                handleOnMouseDownTh={this.handleOnMouseDownTh.bind(this)}
                handleClick={this.handleClick.bind(this)}
                handleRightClickRow={this.handleRightClickRow.bind(this)}
                handleOnClickTd={this.handleOnClickTd.bind(this)}
                onSort={this.onSort.bind(this)}
                content={content}
                selectedRows={selectedRows}
                selectedTd={selectedTd}
              />
            </div>
          </div>
        </div>
      );
  }
}

export default App;
