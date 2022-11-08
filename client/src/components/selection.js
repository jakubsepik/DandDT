import React, { Component } from "react";
import axios from "axios";
import dotenv from "dotenv";
import File from "../components/file";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AiFillPlusCircle, AiOutlineSearch } from "react-icons/ai";
import toast from "react-hot-toast";
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
      filter: "",
      selectionTree: [],
      create_popup: false,
    };
  }
  deleteFile(_id) {
    axios
      .post(target + "deleteFile", {
        _id: _id,
      })
      .then((response) => {
        this.props.closeEditor(_id);
        this.props.getFiles();
        toast.success("File deleted");
      });
  }
  onChange(e) {
    this.setState({
      filter: e.target.value,
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
  renderFile(_id) {
    this.props.openEditor(0, _id);
  }
  updateSelectionTree() {}
  printFiles() {
    if (
      !this.state.selectionFilesArray.length ||
      this.state.selectionFilesArray.length === 0
    )
      return null;
    //console.log(this.state.selectionTree);
    return this.state.selectionTree.map((element, index) => {
      if (element.constructor === Object) { 
        //console.log(element);
        return false;
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
        console.log(item);
        let normalize_filter = this.state.filter
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase()
          .trim();
        if (!item) {
          return false;
        }
        if (
          !(
            item.name
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toLowerCase()
              .trim()
              .includes(normalize_filter) ||
            item.tags.some((tag) => {
              if (
                tag
                  .normalize("NFD")
                  .replace(/\p{Diacritic}/gu, "")
                  .toLowerCase()
                  .trim()
                  .includes(normalize_filter)
              )
                return true;
            })
          )
        )
          return null;
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
      name: !this.state.filter ? "File" : this.state.filter,
    };
    axios.defaults.withCredentials = true;
    axios.post(target + "addFile", json).then((response2) => {
      this.props.getFiles();
      this.state.selectionTree.unshift(response2.data);
      this.setState({ filter: "" });
      this.props.openEditor(0, response2.data);
    });
  }
  render() {
    return (
      <div className="h-full w-[20%] border-l-2 border-border flex overflow-y-auto">
        <DragDropContext
          onDragEnd={async (result) => {
            if (!result.destination) return;

            const fromIndex = result.source.index;
            const toIndex = result.destination.index;
            const arr = this.state.selectionTree;
            
            var element = arr.splice(fromIndex, 1)[0];
            arr.splice(toIndex, 0, element);
            
            axios
              .post(target + "updateSelectionTree", {
                selectionTree: arr,
              })
              .then((response) => {
                this.setState({selectionTree:arr})
              });
          }}
        >
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="w-full h-full overflow-x-hidden"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <li className="flex items-center py-2 px-1">
                  <div className="text-quaternary text-xl w-[10%]">
                    <AiOutlineSearch />
                  </div>
                  <input
                    id="filter"
                    type="text"
                    value={this.state.filter}
                    onChange={this.onChange}
                    placeholder="Search..."
                    className="w-[80%] transition-all mx-1 px-2 py-1 bg-transparent border-[1px] border-primary border-b-quaternary outline-none focus:placeholder:text-transparent text-white focus:border-quaternary focus:rounded-2xl"
                  />
                  <div
                    className="w-[10%] text-quaternary cursor-pointer hover:brightness-200 text-xl"
                    onClick={this.createFile}
                  >
                    <AiFillPlusCircle />
                  </div>
                </li>
                {this.printFiles()}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="absolute hidden">Hello</div>
      </div>
    );
  }
}

export default Edit;
