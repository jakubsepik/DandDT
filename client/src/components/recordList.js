import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr>
    <td>{props.record.item_name}</td>
    <td>{props.record.item_type}</td>
    <td>{props.record.item_quantity}</td>
    <td>{props.record.item_place}</td>
    <td>{props.record.item_notes}</td>
    <td>
      <Link to={"/edit/" + props.record._id}>Edit</Link> |
      <a
        
        onClick={(e) => {
          e.preventDefault();
          props.deleteRecord(props.record._id);
        }}
        href="/"
      >
        Delete
      </a>
    </td>
  </tr>
);

export default class RecordList extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.state = { records: [] };
  }

  // This method will get the data from the database.
  componentDidMount() {
    axios
      .get("http://localhost:5000/record/")
      .then((response) => {
        //console.log(JSON.stringify(response));
        this.setState({ records: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // This method will delete a record based on the method
  deleteRecord(id) {
    console.log("debug");
    axios.delete("http://localhost:5000/" + id).then((response) => {
      console.log(response.data);
    });
    const tmp = this.state.records.filter((el) => el._id !== id);
    this.setState({
      records: tmp
    });
  }

  // This method will map out the users on the table
  recordList() {
    return this.state.records.map((currentrecord) => {
      //console.log(currentrecord);
      return (
        <Record
          record={currentrecord}
          deleteRecord={this.deleteRecord}
          key={currentrecord._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  render() {
    return (
      <div>
        <h3>Record List</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Place</th>
              <th>Note</th>
              <th/>
            </tr>
          </thead>
          <tbody>{this.recordList()}</tbody>
        </table>
      </div>
    );
  }
}
