import React, { Component } from "react";



class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id:this.props.fileObject._id,
      name:this.props.fileObject.name,
      author:this.props.fileObject.author,
      body:this.props.fileObject.body,
      tags:this.props.fileObject.tags,
      links:this.props.fileObject.links
    };
    
    this.printTags = this.printTags.bind(this);
    this.onChange = this.onChange.bind(this);

    this.closeEditor=this.props.closeEditor.bind(this);
  }

  componentDidMount() {
    
  }
  
  onChange(e){
    this.setState({
      [e.target.id]:e.target.value
    })
  }
  printTags(){
    
    return this.state.tags.map(item => {
      return(
      <span className={item} key={item}>
        {item}
      </span>
      )
    })
  }

  render() {
    console.log("editor render")
    return (
      <div className="editor">
        <button onClick={()=>this.closeEditor(this.state._id)}>close</button>
        <input id="name" value={this.state.name} onChange={this.onChange}/>
        <div>-by {this.state.author}</div>
        /*react select*/
        <div>{this.printTags()}</div>
        <textarea id="body" value={this.state.body} onChange={this.onChange}/>
        <div>{this.state.links}</div>
      </div>
    );
  }
}

export default Edit;
