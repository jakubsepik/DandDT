import React, { Component } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Editor from "../components/editor";
import Selection from "../components/selection";
//import DraftEditor from "../components/draftEditor"
import toast from "react-hot-toast";
import dotenv from "dotenv";


dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorsArray:[],
      selectionFilesArray:[],
    };
    this.linkToFiles=[]
    this.focus_id=null;
    this.setFocus=this.setFocus.bind(this);
    this.pass_id = this.pass_id.bind(this);
    this.printEditors = this.printEditors.bind(this);
    this.closeEditor = this.closeEditor.bind(this);

    this.getFiles = this.getFiles.bind(this);
  }
  componentDidMount() {
    this.getFiles();
  }
  getFiles(){
    axios.get(target + "getFiles").then((response) => {
      this.setState({selectionFilesArray:response.data})
    })
  }
  setFocus(id){
    this.focus_id=id;
  }
  closeEditor(id){
    var filtred = this.state.editorsArray.filter((el)=>{
      return el._id!==id;
    })
    this.getFiles();
    this.setState({editorsArray:filtred})
  
  }
  pass_id(to_id,from_id=undefined) {
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
  }
  printEditors(){
    return this.state.editorsArray.map(item=>{
      var selectionLinks=this.state.selectionFilesArray.map(({tags, ...keepAttrs}) => keepAttrs)
      return( 
       <Editor setFocus={this.setFocus} editorsCount={this.state.editorsArray.length} key={item._id} fileObject={item} selectionLinks={selectionLinks} closeEditor={this.closeEditor} pass_id={this.pass_id} getFiles={this.getFiles}/>
      ) 
    })
  }
  
  render() {
    console.log(this.focus_id)
    return (
      <div className="">
        <Navbar />
        <div className="row">
          <section className="col-9">
            {this.printEditors()}
          
          </section>
            <Selection pass_id={this.pass_id} getFiles={this.getFiles}  selectionFilesArray={this.state.selectionFilesArray}/>
        </div>
      </div>
    );
  }
}
