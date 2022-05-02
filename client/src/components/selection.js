import React, { Component } from "react";
import axios from "axios";
import dotenv from "dotenv";
import File from "../components/file";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;

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
      selectionTree: [],
      create_popup: false,
    };
  }
  deleteFile(e) {
    e.stopPropagation();
    this.props.closeEditor(e.target.parentNode.getAttribute("data-id"));
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
  componentDidMount() {
    axios.get(target + "getSelectionTree").then((response) => {
      this.setState({ selectionTree: response.data });
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
  updateSelectionTree(){

  }
  printFiles() {
    if (!this.state.selectionFilesArray.length||this.state.selectionFilesArray.length === 0) return null;
    return this.state.selectionTree.map((element, index) => {
      if (element.constructor === Object) {
        return null;
        /*
          <Directory
            key={element.name}
            selectionFilesArray={this.state.selectionFilesArray}
            selectionTree={element}
            renderFile={this.renderFile}
            deleteFile={this.deleteFile}
          />
        );*/
      } else {
        let item = this.state.selectionFilesArray.find(
          (x) => x._id === element
        );
        if (!item) return null;
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
                _id={item._id}
                index={index}
                />
        );
      }
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
      this.props.getFiles();
      this.state.selectionTree.unshift(response2.data);
      this.setState({ input: "" });
      this.props.openEditor(0, response2.data);
    });
  }
  render() {
    return (
      <div className="selection col-3">
        <DragDropContext onDragEnd={(result)=>{
          if (!result.destination) return;
          const tmp = this.state.selectionTree[result.source.index]
          this.state.selectionTree[result.source.index]=this.state.selectionTree[result.destination.index]
          this.state.selectionTree[result.destination.index]=tmp;
          axios.post(target + "updateSelectionTree",{selectionTree:this.state.selectionTree}).then((response) => {
            
          });
        }}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="overflow-auto characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <li className="list-group-item w-100 align-items-center">
                  <input
                    id="input"
                    type="text"
                    value={this.state.input}
                    onChange={this.onChange}
                  />
                  <i
                    className="fa fa-plus-circle fa-2x"
                    onClick={this.createFile}
                  />
                </li>
                {this.printFiles()}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="tool">Hello</div>
      </div>
    );
  }
}

export default Edit;
