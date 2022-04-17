import React, { Component } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Editor from "../components/editor";
import Selection from "../components/selection";
import Tab from "../components/tab";
//import DraftEditor from "../components/draftEditor"
import toast from "react-hot-toast";
import dotenv from "dotenv";

dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorsArray: [],
      selectionFilesArray: [],
      currentEditor: null,
    };
    this.linkToFiles = [];
    this.focus_id = null;
    this.setFocus = this.setFocus.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.printEditorsTabs = this.printEditorsTabs.bind(this);
    this.closeEditor = this.closeEditor.bind(this);

    this.getFiles = this.getFiles.bind(this);
  }
  componentDidMount() {
    this.getFiles();
  }
  setCurrentEditor(id) {}
  getFiles() {
    axios.get(target + "getFiles").then((response) => {
      this.setState({ selectionFilesArray: response.data });
    });
  }
  setFocus(id) {
    this.focus_id = id;
  }
  closeEditor(id) {
    if (this.state.currentEditor._id === id) {
      if (this.state.editorsArray.length > 1)
        this.openEditor(0,this.state.editorsArray[0]._id);
      else this.setState({ currentEditor: null });
    }
    var filtred = this.state.editorsArray.filter((el) => {
      return el._id !== id;
    });
    this.setState({ editorsArray: filtred });
    this.getFiles();
  }
  /**
   * Open file editor
   * @param {number} type - 0: open new editor or focus,
   *
   * 1: open new editor or close,
   *
   * 2: replace current editor with new
   * @param {string} to_id - id of file from editor where this function was called
   * @param {string} from_id - id of file which will be opened
   */
  openEditor(type, to_id, from_id = undefined) {
    console.log("%s %s %s", type, to_id, from_id);
    if (type === 0) {
      let to_index = this.state.editorsArray.findIndex((e) => e._id === to_id);
      if (to_index === -1) {
        axios.post(target + "getFile", { id: to_id }).then((res) => {
          var tmp = this.state.editorsArray;
          tmp.push(res.data);
          this.setState({ editorsArray: tmp, currentEditor: res.data });
        });
      } else {
        axios.post(target + "getFile", { id: to_id }).then((res) => {
          this.setState({ currentEditor: res.data });
        });
      }
    }
    /*
    let target_index = from_id?this.state.editorsArray.findIndex(e=>e._id===from_id):undefined;
    let to_index=this.state.editorsArray.findIndex(e=>e._id===to_id)
    if(to_index!==-1 && from_id!==undefined){
      toast.error("editor otvoreny",{id:"error-same"})
      return
    }
    
    if(this.state.editorsArray.length===4 && target_index===undefined && to_index===-1){
      toast("max 4 editory",{id:"error-same",icon:'⚠️'})
      return
    }
    
    if(to_index!==-1 && from_id===undefined){
      this.closeEditor(to_id)
      return    
    }
    axios.post(target + "getFile", { id: to_id }).then((res) => {
      var tmp = this.state.editorsArray;
      if(target_index === undefined) 
        tmp.push(res.data)
      else{
        tmp[target_index]=res.data
      }
      this.focus_id=tmp[0]._id
      this.setState({ editorsArray: tmp });
    });
    */
  }
  printEditorsTabs() {
    return this.state.editorsArray.map((item) => {
      return (
        <Tab
          item={item}
          closeEditor={this.closeEditor}
          key={item._id}
          openEditor={this.openEditor}
        />
      );
    });
  }

  render() {
    return (
      <div className="">
        <Navbar />
        <div className="row">
          <section className="col-9">
            <div className="tabs">{this.printEditorsTabs()}</div>
            {this.state.currentEditor ? (
              <Editor
                key={this.state.currentEditor._id}
                setFocus={this.setFocus}
                fileObject={this.state.currentEditor}
                selectionLinks={this.state.selectionFilesArray}
                closeEditor={this.closeEditor}
                openEditor={this.openEditor}
                getFiles={this.getFiles}
              />
            ) : null}
          </section>
          <Selection
            openEditor={this.openEditor}
            getFiles={this.getFiles}
            selectionFilesArray={this.state.selectionFilesArray}
          />
        </div>
      </div>
    );
  }
}
