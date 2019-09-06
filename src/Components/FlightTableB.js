import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import styled from "styled-components";

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Th = styled.th`
  border: ${props => (props.isSelected ? "2px solid blue" : "")} !important;

  color: ${props => (props.isSecondarySorted ? "blue" : "")} !important;
`

const Td = styled.td`  
`

const Tr = styled.tr`
   ${Td} {
     border-bottom: ${props =>
    props.isSelectedRow ? "1px solid black" : ""} !important;}
   }
`

class FlightTableB extends Component {
  constructor(props) {
    super(props);
    this.sortHandler = this.sortHandler.bind(this);
    this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
    this.onContextMenuHandler = this.onContextMenuHandler.bind(this);
    this.onContextMenuHandlerTh = this.onContextMenuHandlerTh.bind(this);
    this.onMouseDownHandlerTh = this.onMouseDownHandlerTh.bind(this);

  }

  columnException(name) {
    return (
      name.startsWith("I/R") ||
      name.startsWith("IN") ||
      name.startsWith("ON") ||
      name.startsWith("STD") ||
      name.startsWith("STA")
    );
  }
  sortHandler(item, content, clicked) {
    this.props.onSort(item, content, clicked);
  }

  onContextMenuHandler(e, i) {
    this.props.handleRightClickRow(e, i);
  }

  onMouseDownHandler(e, i) {
    this.props.handleClick(e, i);
  }

  onContextMenuHandlerTh(e, item) {
    this.props.handleRightClickTh(e, item);
  }

  onMouseDownHandlerTh(e, item) {
    this.props.handleOnMouseDownTh(e, item);
  }

  onClickHandlerTd(rowKeyValue, objectKeyIndex) {
    this.props.handleOnClickTd(rowKeyValue, objectKeyIndex);
  }


  render() {
    let selectedTd = this.props.selectedTd;
    const selectedRowsPK = this.props.selectedRows.map(
      i => i["FLIGHT;BBW"] + i["GATE;BBW"]
    );
    return (
      <Table hover bordered striped size="sm" id="override">
        <thead>
          <tr>
            {Object.keys(this.props.content[0] || {})
              .filter(i => i !== "undefined" && i !== "row")
              .map((item, i) => (
                <Th
                  style={{backgroundColor: item === this.props.sorted && this.props.columnDirections[this.props.sorted] 
                    ? "lightblue" 
                    : item === this.props.sorted 
                    ? "cornflowerblue" 
                    : ""}}
                  columnDirections={this.props.columnDirections}
                  isSelected={this.props.selected === item}
                  sortedColumn={this.props.sorted}
                  isSorted={this.props.sorted === item}
                  isSecondarySorted={this.props.secondarySorted === item}
                  key={i}
                  className={[
                    item.includes(";") ? item.split(";")[1].trim() : ""
                  ].join(" ")}
                  onClick={() =>
                    this.sortHandler(item, this.props.content, true)
                  }
                  onContextMenu={e => this.onContextMenuHandlerTh(e, item)}
                  onMouseDown={e => this.onMouseDownHandlerTh(e, item)}
                  title={
                    this.props.selected
                      ? "Left/Right Arrow Keys"
                      : "Left/Middle/Right Click"
                  }
                >
                  {item.includes(";") ? item.split(";")[0].trim() : ""}
                  {/* {item === this.props.sorted && this.props.columnDirections[item]
                    ? ""
                    : this.props.sorted === item
                      ? <span>&#x25BC;</span>
                      : "" */}
                </Th>
              ))}
          </tr>
        </thead>

        <tbody className="tbody-class">
          {this.props.content
            ? this.props.content.map((i, ii) => (
              <Tr
                isSelectedRow={selectedRowsPK.includes(
                  i["FLIGHT;BBW"] + i["GATE;BBW"]
                )}
                className={ii % 2 === 1 ? "striped" : ""}
                key={"tr" + ii}
                id={ii}
                children={Object.keys(i)
                  .filter(i => i !== "undefined" && i !== "row")
                  .map((j, jj) => {

                    return (
                      <Td
                        title={i[j] ? i[j].split(";")[1] : ""}
                        isSelectedTd={selectedTd}
                        style={{
                          position: 'relative',
                          zIndex: 'auto',
                          border:
                            i[j] ?
                              selectedTd[0] === i['row'] && selectedTd[1] === jj
                                ?
                                "2.5px solid black"
                                :
                                this.props.currentTime ===
                                  i[j].split(";")[i[j].split(";").length - 1].split("@")[i[j].split(";")[i[j].split(";").length - 1].split("@").length - 1]
                                  ? "2.5px solid red"
                                  : ""
                              : ""
                        }}
                        onContextMenu={e => this.onContextMenuHandler(e, i)}
                        onMouseDown={e => this.onMouseDownHandler(e, i)}
                        key={jj}
                        onClick={() =>
                          this.onClickHandlerTd(i['row'], jj)
                        }
                        className={[
                          "tooltip",
                          i[j] ?
                            i[j].split(";").filter(k => k.length === 3) : ""
                        ].join(" ")}
                      >
                        {i[j] ? i[j].split(";")[0] : ""}
                        <div className="tooltiptext"
                          key={jj}
                          style={{
                            visibility: i['row'] === selectedTd[0] && jj === selectedTd[1] ? 'visible' : 'hidden',
                            right: jj > Object.keys(i).length - 5 ? '.5em' : ""
                          }}>
                          <div>
                            {i[j] ? i[j].split(";").length > 2 && i[j].split(";").length
                              ? i[j].split(";")[i[j].split(";").length - 1].split(" ").map((result, x) => result.length === 3 ? "" : <span key={x}>{result.includes("_") ? result.replace("_", " ") : result}<br /></span>)
                              : ""
                              : ""}
                          </div>
                        </div>
                      </Td>
                    )
                  })}
              />
            ))
            : []}
        </tbody>
      </Table>
    );
  }
}

export default FlightTableB;
