import React, { Component } from "react";
import "./EmployeeTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";


const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;


class AdminEmployeeTable extends Component {
  state = {
    employeeData: [],
    loading: true,

    columnDefs: [
      {
        headerName: "Nom",
        field: "nom",
        sortable: true,
        width: 130,

        // filter: true ,
      },
      {
        headerName: "Prenom",
        field: "prenom",
        sortable: true,
        width: 130,

        // filter: true ,
      },
      {
        headerName: "Matricule",
        field: "matricule",
        sortable: true,
        width: 130,

        // filter: true ,
      },
      {
        headerName: "",
        field: "info",
        filter: false,
        width: 30,
        // cellRenderer:this.ageCellRendererFunc,
        // cellRendererFramework: function(params) {
        //   return <button OnClick={console.log("pa",params)}>Test</button>;
        // },
        cellRendererFramework: this.renderInfoButton.bind(this),


      },
      {
        headerName: "",
        field: "edit",
        filter: false,
        width: 30,
        // cellRenderer:this.ageCellRendererFunc,
        // cellRendererFramework: function(params) {
        //   return <button OnClick={console.log("pa",params)}>Test</button>;
        // },
        cellRendererFramework: this.renderEditButton.bind(this),


      },
      {
        headerName: "",
        field: "delete",
        filter: false,
        width: 30,
        // cellRenderer:this.ageCellRendererFunc,
        // cellRendererFramework: function(params) {
        //   return <button OnClick={console.log("pa",params)}>Test</button>;
        // },
        cellRendererFramework: this.renderButton.bind(this),


      },

    ],
    rowData: [],
    defaultColDef: {
      resizable: true,
      width: 100,
      filter: "agTextColumnFilter"
      // filter: true ,
    },
    getRowHeight: function (params) {
      return 35;
    }
  };
  employeeObj = [];
  rowDataT = [];

  loadEmployeeData = () => {
    axios
      .get("http://localhost:5000/employees", {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then(response => {
        this.employeeObj = response.data;
        console.log(response.data);
        this.setState({ employeeData: response.data });
        this.setState({ loading: false });
        this.rowDataT = [];
        this.employeeObj.map(data => {
          let temp = {
            data,
            nom: data["nom"],
            prenom: data["prenom"],
            matricule: data["matricule"]
          };

          this.rowDataT.push(temp);
        });
        this.setState({ rowData: this.rowDataT });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onEmployeeDelete = e => {
    console.log(e);
    if (window.confirm("Are you sure to delete this record? ") == true) {
      window.alert("You are not allowed to perform this operation");
      // axios
      //   .delete("https://employee-management-fk-api.herokuapp.com/api/employee/" + e, {
      //     headers: {
      //       authorization: localStorage.getItem("token") || ""
      //     }
      //   })
      //   .then(res => {
      //     this.componentDidMount();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
  };
  componentDidMount() {
    this.loadEmployeeData();
  }
  handleClick = (e) => {
    console.log(e);
  }
  renderInfoButton(params) {
    console.log(params);
    return <div>
      <FontAwesomeIcon
        icon={faInfoCircle}
        onClick={() => this.props.onEmpInfo(params.data.data)}
      /></div>;
  }
  renderButton(params) {
    console.log(params);
    return <FontAwesomeIcon
      icon={faTrash}
      onClick={() => this.onEmployeeDelete(params.data.data["_id"])}
    />;
  }
  renderEditButton(params) {
    console.log(params);
    return <FontAwesomeIcon
      icon={faEdit}
      onClick={() => this.props.onEditEmployee(params.data.data)}
    />;
  }

  searchChange = e => {
    console.log(e.target.value);
    this.setState({ searchData: e.target.value });
  };
  // getFilteredEmp() {
  //   return this.employeeObj.filter(emp => {
  //     return (
  //       emp["Email"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["role"][0]["RoleName"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["FirstName"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["MiddleName"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["LastName"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["DOB"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["ContactNo"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["EmployeeCode"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["department"][0]["DepartmentName"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["position"][0]["PositionName"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase()) ||
  //       emp["DateOfJoining"]
  //         .toLowerCase()
  //         .includes(this.state.searchData.toLocaleLowerCase())
  //     );
  //   });
  // }

  render() {
    // let filteredEmp = this.getFilteredEmp();
    return (
      <div id="table-outer-div-scroll">
        <h2 id="role-title">Employee Details</h2>

        <Button
          variant="primary"
          id="add-button"
          onClick={this.props.onAddEmployee}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add
        </Button>

        <div id="clear-both" />
        {!this.state.loading ? (
          <div
            id="table-div"
            className="ag-theme-balham"
          //   style={
          //     {
          //     height: "500px",
          //     width: "100%"
          //   }
          // }
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              columnTypes={this.state.columnTypes}
              rowData={this.state.rowData}
              // floatingFilter={true}
              // onGridReady={this.onGridReady}
              pagination={true}
              paginationPageSize={10}
              getRowHeight={this.state.getRowHeight}
            />
          </div>
        ) : (
            <div id="loading-bar">
              <RingLoader
                css={override}
                sizeUnit={"px"}
                size={50}
                color={"#0000ff"}
                loading={true}
              />
            </div>
          )}

      </div>
    );
  }
}

export default AdminEmployeeTable;
