import React, { Component } from "react";
// This will require to npm install axios
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;
const File = (props) => (
  <li className="list-group-item w-100" onClick={props.renderFile} data-id={props.file._id}>
    <span>{props.file.name}</span>
    <span className="tags">{props.tags}</span>
  </li>
);
class Edit extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);
    this.printFiles = this.printFiles.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.createFile = this.createFile.bind(this);
    this.state = {
      selectionFilesArray:[],
      create_popup: false,
    };
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({selectionFilesArray:nextProps.selectionFilesArray})
  }
  renderFile(e) {
    this.props.pass_id(e.currentTarget.attributes.getNamedItem("data-id").value)
  } 
  printFiles() {
    return this.state.selectionFilesArray.map((item) => {
      let tags = [];
      if (item.hasOwnProperty("tags")) {
        item.tags.sort();
        item.tags.forEach((tag) => {
          tags.push(
            <span className={tag} key={tag}>
              {tag}
            </span>
          );
        });
      }
      return (
        <File
          file={item}
          tags={tags}
          key={item._id}
          renderFile={this.renderFile}
        />
      );
    });
  }
  createFile() {
    axios.defaults.withCredentials = false;
    axios
      .get("https://random-word-api.herokuapp.com/word?swear=0")
      .then((response) => {
        console.log(response.data);
        var json = {
          name: response.data[0],
          author: "author",
          body: "",
          tags: [],
          links: [],
        };
        axios.defaults.withCredentials = true;
        axios.post(target + "addFile",json).then((response2)=>{
          //json["_id"]=response2.data
          //this.setState({selectionFilesArray:this.state.selectionFilesArray.concat(json)})
          this.props.getFiles();
        })
        
      });
  }
  render() {
    return (
      <div className="selection col-3">
        <ul className=" list-group">
          <li className="list-group-item w-100">
            <input type="text" />
            <button onClick={this.createFile}>pridat</button>
          </li>
          {this.printFiles()}
        </ul>
      </div>
    );
  }
}

export default Edit;
