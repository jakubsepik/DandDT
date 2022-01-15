import React, { Component } from "react";
import axios from "axios";
import dotenv from "dotenv";
import Select from "react-select";
const tags_options = [
  { value: "item", label: "item" },
  { value: "NPC", label: "NPC" },
  { value: "place", label: "place" },
  { value: "organization", label: "organization" },
  { value: "event", label: "event" },
];

dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.fileObject._id,
      name: this.props.fileObject.name,
      author: this.props.fileObject.author,
      body: this.props.fileObject.body,
      tags: this.props.fileObject.tags,
      links: this.props.fileObject.links,
      changed: false,
      selectionRerenderChanged: false,
      edit: false,
    };

    this.printTags = this.printTags.bind(this);
    this.printLinks = this.printLinks.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeLinks = this.onChangeLinks.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);

    this.closeEditor = this.props.closeEditor.bind(this);
    this.pass_id = this.props.pass_id.bind(this);
  }

  componentWillUnmount() {
    console.log("editore unmounted");
    window.addEventListener("beforeunload", (ev) => {
      this.safeFile();
    });
    this.safeFile();
  }

  safeFile() {
    console.log(
      "safe file: " +
        this.state.changed +
        " " +
        this.state.selectionRerenderChanged
    );
    if (this.state.changed)
      axios
        .post(target + "updateFile", {
          _id: this.state._id,
          name: this.state.name,
          author: this.state.author,
          body: this.state.body,
          tags: this.state.tags,
          links: this.state.links,
        })
        .then((res) => {
          if (this.state.selectionRerenderChanged) {
            this.props.getFiles();
            this.setState({ changed: false, selectionRerenderChanged: false });
          } else this.setState({ changed: false });
        });
  }

  onChange(e) {
    if (e.target.id === "name")
      this.setState({
        [e.target.id]: e.target.value,
        changed: true,
        selectionRerenderChanged: true,
      });
    else
      this.setState({
        [e.target.id]: e.target.value,
        changed: true,
      });
  }
  onChangeTags(e) {
    var tmp = [];
    e.forEach((e) => {
      tmp.push(e.value);
    });
    this.setState({ tags: tmp, changed: true, selectionRerenderChanged: true });
  }
  onChangeLinks(e) {
    var tmp = [];
    e.forEach((e) => {
      tmp.push(e.value);
    });
    this.setState({
      links: tmp,
      changed: true,
      selectionRerenderChanged: true,
    });
  }
  printTags(edit) {
    var value = [];
    if (!edit) {
      this.state.tags.forEach((tag) => {
        value.push(
          <span className={tag} key={tag}>
            {tag}
          </span>
        );
      });
      return value.map((x) => x);
    }
    this.state.tags.forEach((element) => {
      value.push({ value: element, label: element });
    });
    return (
      <Select
        placeholder="Set tags"
        defaultValue={value}
        isMulti
        name="colors"
        options={tags_options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={this.onChangeTags}
      />
    );
  }
  printLinks(edit) {
    var value = [];
    if (!edit) {
      this.state.links.forEach((element) => {
        value.push(
          <button
            className="button-3"
            key={element}
            onClick={() => {
              this.safeFile();
              this.pass_id(element, this.state._id);
            }}
          >
            {this.props.selectionLinks.find((e) => e._id === element).name}
          </button>
        );
      });
      return value.map((x) => x);
    }
    this.state.links.forEach((element) => {
      value.push({
        value: element,
        label: this.props.selectionLinks.find((e) => e._id === element).name,
      });
    });
    var links = [];
    this.props.selectionLinks.forEach((element) => {
      links.push({ value: element._id, label: element.name });
    });
    console.log(value);
    return (
      <Select
        menuPlacement="top"
        placeholder="Set links"
        defaultValue={value}
        isMulti
        name="colors"
        options={links}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={this.onChangeLinks}
      />
    );
  }

  render() {
    return this.state.edit ? (
      <div
        className={"editor editor-" + this.props.editorsCount}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            this.setState({ edit: false });
            this.safeFile();
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onDoubleClick={() => {
          this.setState({ edit: false });
          this.safeFile();
        }}
      >
        <div className="top-wrapper">
          <i
            className="fa fa-close"
            onClick={() => this.closeEditor(this.state._id)}
          ></i>
          <input value={this.state.name} onChange={this.onChange} id="name" />
          <div>{this.printTags(true)}</div>
        </div>
        <textarea
          onBlur={() => {
            this.safeFile();
          }}
          spellCheck="false"
          id="body"
          value={this.state.body}
          onChange={this.onChange}
        />
        <div>{this.printLinks(true)}</div>
      </div>
    ) : (
      <div
        className={"editor editor-" + this.props.editorsCount}
        onDoubleClick={() => {
          this.setState({ edit: true });
        }}
      >
        <div className="top-wrapper">
          <i
            className="fa fa-close"
            onClick={() => this.closeEditor(this.state._id)}
          ></i>
          <div className="name">{this.state.name}</div>
          <div className="tags">{this.printTags(false)}</div>
        </div>
        <textarea
          onBlur={() => {
            this.safeFile();
          }}
          spellCheck="false"
          style={{ height: "60%" }}
          id="body"
          value={this.state.body}
          onChange={this.onChange}
        />
        <div>{this.printLinks(false)}</div>
      </div>
    );
  }
}

export default Edit;
