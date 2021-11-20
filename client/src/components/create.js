import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';

import toast from 'react-hot-toast';

export default class Create extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getDatalist = this.getDatalist.bind(this);
    this.datalist = {
      item_type: [],
      item_place: []
    };
    this.state = {
      item_name: "",
      item_type: "",
      item_quantity: 0,
      item_place: "",
      item_notes: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/record/")
      .then((response) => {
        this.setState({ records: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
    this.getDatalist("item_type");
    this.getDatalist("item_place");
    
  }

  // These methods will update the state properties.
  onChange(e) {
    console.log(this.state);
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  getDatalist(a) {
    this.datalist = {
      item_type: [],
      item_place: []
    };
    axios.post("http://localhost:5000/types/", { listkey: a }).then((res) => {
      console.log(res.data);
      res.data.forEach(element => {
        this.datalist[a].push((<option>  {element}  </option>))
      });
      console.log(this.datalist)
    }).catch((err) => {
      console.log(err)
    })
  }


  // This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();

    // When post request is sent to the create url, axios will add a new record to the database.
    const newitem = {
      item_name: this.state.item_name,
      item_type: this.state.item_type,
      item_quantity: this.state.item_quantity,
      item_place: this.state.item_place,
      item_notes: this.state.item_notes
    };

    axios
      .post("http://localhost:5000/record/add", newitem)
      .then((res) => {
        console.log(res.data)
      });
      
      toast("New item added",{style: {color:"green"},})
    // We will empty the state after posting the data to the database
    this.setState({
      item_name: "",
      item_type: "",
      item_quantity: 0,
      item_place: "",
      item_notes: ""
    });
  }

  // This following section will display the form that takes the input from the user.
  render() {

    return (
      <div style={{ marginTop: 20 }}>
        <h3>Create New Record</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name of the item: </label>
            <input
              type="text"
              className="form-control"
              id="item_name"
              value={this.state.item_name}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label>Item's type: </label>
            <input
              type="text"
              list="types"
              className="form-control"
              id="item_type"
              value={this.state.item_type}
              onChange={this.onChange}
            />
            <datalist id="types">
              {this.datalist.item_type}
            </datalist>
          </div>
          <div className="form-group">
            <label>Item's quantity: </label>
            <div className="text-center">{this.state.item_quantity}</div>
            <input
              type="range"
              max="64"
              min="0"
              className="form-control mx-auto w-75"
              id="item_quantity"
              value={this.state.item_quantity}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label>Item's place: </label>
            <input
              type="text"
              list="places"
              className="form-control"
              id="item_place"
              value={this.state.item_place}
              onChange={this.onChange}
            />
            <datalist id="places">
              {this.datalist.item_place}
            </datalist>
          </div>
          <div className="form-group">
            <label>Item's notes: </label>
            <input
              type="text"
              className="form-control"
              id="item_notes"
              value={this.state.item_notes}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group d-flex justify-content-center">
            <input
              type="submit"
              value="Create person"
              className="btn btn-primary"
            />
          </div>

        </form>
      </div>
    );
  }
}
