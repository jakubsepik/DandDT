import React, { Component } from "react";
import axios from "axios";
import dotenv from "dotenv";
import File from "../components/file";
import Directory from "../components/directory";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { AiFillPlusCircle, AiOutlineSearch } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import toast from "react-hot-toast";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;

class Edit extends Component {
  constructor(props) {
    super(props);
    this.printFiles = this.printFiles.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.createFile = this.createFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.createDirectory = this.createDirectory.bind(this);
    this.deleteDirectory = this.deleteDirectory.bind(this);

    this.onChange = this.onChange.bind(this);
    this.state = {
      selectionFilesArray: [],
      filter: "",
      selectionTree: [],
      create_popup: false,
    };
  }
  createDirectory() {
    axios
      .post(target + "addDirectory", { name: this.state.filter })
      .then((response) => {
        toast.success("Directory created");
        this.setState({
          selectionTree: [response.data].concat(this.state.selectionTree),
          filter: "",
        });
      });
  }
  deleteFile(_id) {
    axios
      .post(target + "deleteFile", {
        _id: _id,
      })
      .then((response) => {
        this.props.closeEditor(_id);
        this.props.getFiles();
        toast.success(response.data.message);
      });
  }
  deleteDirectory(_id) {
    axios
      .post(target + "deleteDirectory", {
        _id: _id,
      })
      .then((response) => {
        this.setState({ selectionTree: response.data.newSelectionTree });
        toast.success("Directory deleted");
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
  printFiles() {
    if (
      !this.state.selectionFilesArray.length ||
      this.state.selectionFilesArray.length === 0
    )
      return null;
    //console.log(this.state.selectionTree);
    return this.state.selectionTree.map((element, index) => {
      if (element.constructor === Object) {
        return (
          <Directory
            key={element._id}
            selectionFilesArray={this.state.selectionFilesArray}
            selectionTree={element}
            filter={this.state.filter}
            renderFile={this.renderFile}
            deleteFile={this.deleteFile}
            deleteDirectory={this.deleteDirectory}
            index={index}
          />
        );
      } else {
        let item = this.state.selectionFilesArray.find(
          (x) => x._id === element
        );
        let normalize_filter = this.state.filter
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase()
          .trim();

        if (
          !item ||
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
              return false;
            })
          )
        ){
          //this.deleteFile(element);
          return null;
        }
          

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
            isDragDisabled={this.state.filter !== ""}
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
    //console.log(this.state.selectionTree);
    return (
      <div className="h-full w-[20%] border-l-2 border-border flex flex-col">
        <DragDropContext
          onDragStart={(result) => {}}
          onDragEnd={(result) => {
            //console.log(result);

            const arr = this.state.selectionTree;

            const { destination, source } = result;
            const fromIndex = source.index;
            const toIndex = destination?.index;
            const isDraggableDirectory = arr.some(
              (x) => x._id === result.draggableId
            );

            if (result.combine) {
              if (isDraggableDirectory) return;
              var directory = arr.find(
                (x) => x._id === result.combine.draggableId
              );
              if (!directory) return;
              directory.files.push(arr.splice(fromIndex, 1)[0]);
            } else {
              if (result.type === "directory") {
                var directory_index_from = arr.findIndex(
                  (x) => x._id === source.droppableId
                );

                var element = arr[directory_index_from].files.splice(
                  fromIndex,
                  1
                )[0];

                if (!toIndex) {
                  arr.splice(directory_index_from, 0, element);
                } else {
                  var directory_index_to = arr.findIndex(
                    (x) => x._id === destination.droppableId
                  );
                  arr[directory_index_to].files.splice(toIndex, 0, element);
                }
              } else {
                if (!destination || fromIndex === toIndex) return;
                arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
              }
            }

            axios
              .post(target + "updateSelectionTree", {
                selectionTree: arr,
              })
              .then((response) => {
                this.setState({ selectionTree: arr });
              });

            //pouzi coombine, pretiahnut veci na folder a bude prvy prvok

            return;
            /*if (source.droppableId === "Selection") {
              var element = arr.splice(fromIndex, 1)[0];
            } else {
              var element = arr
                .find((x) => x._id === source.droppableId)
                .files.splice(fromIndex, 0)[0];
            }

            if (destination.droppableId === "Selection") {
              arr.splice(toIndex, 0, element);
            } else {
              arr
                .find((x) => x._id === destination.droppableId)
                .files.splice(toIndex, 0, element);
            }*/
          }}
        >
          <div className="relative rounded bg-primary dark:bg-dark_primary text-black dark:text-white justify-between px-2 py-5 flex items-center h-12">
            <div className="text-quaternary text-xl w-[10%]">
              <AiOutlineSearch />
            </div>

            <input
              id="filter"
              type="text"
              value={this.state.filter}
              onChange={this.onChange}
              placeholder="Search..."
              className="w-[80%] mx-1 px-2 py-1 bg-transparent border-b-[1px] border-b-quaternary outline-none text-black dark:text-white"
            />
            {this.state.filter ? (
              <span
                className="text-quaternary absolute right-[15%] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  this.setState({ filter: "" });
                }}
              >
                <MdClear />
              </span>
            ) : null}

            <Dropdown>
              <div className="w-[10%] text-quaternary cursor-pointer hover:brightness-200 text-xl">
                <Dropdown.Toggle as={CustomToggle}>
                  <AiFillPlusCircle />
                </Dropdown.Toggle>
              </div>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <div onClick={this.createFile}>Create File</div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div onClick={this.createDirectory}>Create Directory</div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Droppable
            droppableId="Selection"
            isCombineEnabled
            isDropDisabled={this.state.filter !== ""}
          >
            {(provided) => (
              <ul
                className="w-full h-full overflow-x-hidden overflow-y-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
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
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </span>
));

export default Edit;
