import React, { Component } from "react";
import axios from "axios";
import dotenv from "dotenv";
import toast from "react-hot-toast";
dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;
var deleteConfirm = null;
const File = (props) => (
  <li
    className="list-group-item w-100"
    onClick={props.renderFile}
    data-id={props.file._id}
  >
    <span>{props.file.name}</span>
    <span className="tags">{props.tags}</span>
    <i
      className="fa fa-close close-icon"
      onClick={(e) => {
        var date = new Date();
        if (deleteConfirm && date.getTime() - deleteConfirm.getTime() < 4000) {
          props.deleteFile(e);
          deleteConfirm = null;
        } else {
          toast("Click again for removal of file");
          deleteConfirm = date;
        }
      }}
    />
  </li>
);
class Edit extends Component {
  constructor(props) {
    super(props);
    this.printFiles = this.printFiles.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.createFile = this.createFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);

    this.onChange = this.onChange.bind(this);
    this.state = {
      selectionFilesArray: [],
      input: "",
      create_popup: false,
    };
  }
  deleteFile(e) {
    e.stopPropagation();
    axios
      .post(target + "deleteFile", {
        id: e.target.parentNode.getAttribute("data-id"),
      })
      .then((response) => {
        this.props.getFiles();
      });
  }
  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectionFilesArray: nextProps.selectionFilesArray });
  }
  renderFile(e) {
    this.props.openEditor(
      0,
      e.currentTarget.attributes.getNamedItem("data-id").value
    );
  }
  printFiles() {
    var filtred = this.state.selectionFilesArray.filter((e) => {
      return e.tags.filter((e) => e.match(new RegExp(this.state.input, "g")));
    });
    filtred = filtred.filter((e) => {
      return e.name.match(new RegExp(this.state.input, "g"));
    });
    return filtred.map((item) => {
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
          deleteFile={this.deleteFile}
        />
      );
    });
  }
  createFile() {
    var json = {
      name: this.state.input === "" ? "File" : this.state.input,
      author: window.sessionStorage.getItem("user"),
      body: "",
      tags: [],
      links: [],
    };
    axios.defaults.withCredentials = true;
    axios.post(target + "addFile", json).then((response2) => {
      this.setState({ input: "" });
      this.props.getFiles();
      this.props.openEditor(0,response2.data);
    });
  }
  render() {
    return (
      <div className="selection col-3">
        <ul className="overflow-auto">
          <li className="list-group-item w-100 align-items-center">
            <input
              id="input"
              type="text"
              value={this.state.input}
              onChange={this.onChange}
            />
            <i className="fa fa-plus-circle fa-2x" onClick={this.createFile} />
          </li>
          {this.printFiles()}
        </ul>
        <div className="tool">Hello</div>
      </div>
    );
  }
}

export default Edit;
