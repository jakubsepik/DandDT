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
    this.openEditor = this.props.openEditor.bind(this);
  }

  componentWillUnmount() {
    window.addEventListener("beforeunload", (ev) => {
      this.safeFile();
    });
    this.safeFile();
    console.log("unmounting");
  }

  safeFile() {
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
  printTags() {
    var value = [];
    if (!this.state.edit) {
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
  printLinks() {
    var value = [];
    if (!this.state.edit) {
      this.state.links.forEach((element) => {
        var a = this.props.selectionLinks.find((e) => e._id === element) || {
          name: "deleted",
        };
        value.push(
          <button
            className="text-white bg-quaternary mx-2 rounded-xl py-1 px-3 hover:brightness-110"
            key={element}
            onClick={() => {
              this.safeFile();
              this.openEditor(0, element, this.state._id);
            }}
          >
            {
              //this.props.selectionLinks.find((e) => e._id === element).name
              a.name
            }
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
    return (
      <span
        className="h-full w-full inline-block px-4"
        onKeyDown={(event) => {
          if (event.key === "Escape" && this.state.edit) {
            this.setState({ edit: false });
            this.safeFile();
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onDoubleClick={() => {
          if (this.state.edit) {
            this.setState({ edit: false });
            this.safeFile();
          } else this.setState({ edit: true });
        }}
        onClick={() => {
          this.props.setFocus(this.props.fileObject._id);
        }}
      >
        <div className="flex h-[12%] items-center">
          <div className="text-white font-['Georgia'] font-semibold text-lg px-4">
            {this.state.edit ? (
              <input
                className="bg-transparent border-b-[1px] border-b-quaternary outline-none text-white"
                value={this.state.name}
                onChange={this.onChange}
                id="name"
              />
            ) : (
              this.state.name
            )}
          </div>
          <div className={!this.state.edit ? "tags ml-auto" : "ml-auto"}>
            {this.printTags()}
          </div>
        </div>
        <textarea
          onBlur={() => {
            this.safeFile();
          }}
          spellCheck="false"
          id="body"
          value={this.state.body}
          onChange={this.onChange}
          className="text-black dark:text-white h-2/3 w-full block bg-transparent backdrop-brightness-125 resize-none rounded p-1"
        />
        <div className="mt-6">{this.printLinks()}</div>
      </span>
    );
  }
}

export default Edit;
