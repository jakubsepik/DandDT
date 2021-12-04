import React, { Component } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Editor from "../components/editor";
import Selection from "../components/selection";
import dotenv from "dotenv";
import toast from "react-hot-toast";
dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileObjectArray:[]
    };
    this.pass_id = this.pass_id.bind(this);
    this.printEditors = this.printEditors.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
  }
  closeEditor(id){
    console.log(id)
    var filtred = this.state.fileObjectArray.filter((el)=>{
      return el._id!==id;
    })
    this.setState({fileObjectArray:filtred})
  }
  pass_id(id) {
    if(this.state.fileObjectArray.length===3){
      toast.error("max 3 editory")
      return
    }
    axios.post(target + "getFile", { id: id }).then((res) => {
      console.log(res.data);
      var tmp = this.state.fileObjectArray;
      this.setState({ fileObject: tmp.push(res.data) });
    });
  }
  printEditors(){
    return this.state.fileObjectArray.map(item=>{
      return(
        <Editor key={item._id} fileObject={item} closeEditor={this.closeEditor}/>
      )
    })
  }
  render() {
    console.log("dashboard render");
    console.log(this.state.fileObjectArray)
    return (
      <div className="">
        <Navbar />
        <div className="row">
          <div className="col-9">
            {/*this.state.edit ? (
              <input
                value={this.state.fileObject.name}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === "Escape") {
                    this.setState({edit:false})
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }}
              />
            ) : (
              <div
                onDoubleClick={() => {
                  this.setState({ edit: true });
                }}
              >
                {this.state.fileObject.name}
              </div>
            )*/}
            {this.printEditors()}
          </div>
          <Selection pass_id={this.pass_id} />
        </div>
      </div>
    );
  }
}
