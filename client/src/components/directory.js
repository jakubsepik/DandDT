import React, { useEffect, useState } from "react";
import useCollapse from "react-collapsed";
import File from "../components/file";
import { FcCollapse, FcExpand } from "react-icons/fc";
import { GoFileDirectory } from "react-icons/go";
import { AiFillDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import axios from "axios";
import { Draggable, Droppable } from "react-beautiful-dnd";

var deleteConfirm = null;

function Collapse({ isActive }) {
  const [isExpanded, setExpanded] = React.useState(isActive);
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded,
  });

  React.useEffect(() => {
    setExpanded(isActive);
  }, [isActive, setExpanded]);

  return (
    <>
      <button
        {...getToggleProps({
          style: { display: "block" },
          onClick: () => setExpanded((x) => !x),
        })}
      >
        {isActive ? "Collapse" : "Expand"}
      </button>
      <div {...getCollapseProps({ style: { backgroundColor: "lightblue" } })}>
        <h2 style={{ margin: 0, padding: 10 }}>
          Start editing to see some magic happen!
        </h2>
      </div>
    </>
  );
}

function Directory(props) {
  const [isExpanded, setExpanded] = useState(false);
  const { getToggleProps, getCollapseProps } = useCollapse({
    isExpanded,
  });
  const [selectionFilesArray, setSelectionFilesArray] = useState(
    props.selectionFilesArray
  );
  const [selectionTree, setSelectionTree] = useState(props.selectionTree);

  const printFiles = () => {
    if (selectionTree.files.length === 0) {
      return <li className="text-gray-600">Empty</li>;
    }
    return selectionTree.files.map((element, index) => {
      if (element.constructor === Object) {
        return null;
        return (
          <Directory
            key={element._id}
            selectionFilesArray={props.selectionFilesArray}
            selectionTree={element}
            filter={props.filter}
            renderFile={props.renderFile}
            deleteFile={props.deleteFile}
            deleteDirectory={props.deleteDirectory}
          />
        );
      } else {
        let item = props.selectionFilesArray.find((x) => x._id === element);
        let normalize_filter = props.filter
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
            renderFile={props.renderFile}
            deleteFile={props.deleteFile}
            _id={item._id}
            index={index}
          />
        );
      }
    });
  };
  return (
    <Draggable draggableId={selectionTree._id} index={props.index}>
      {(providedDraggable) => (
        <li
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
        >
          <div
            className="flex items-center h-10 p-2"
            {...getToggleProps({
              style: { color: "white" },
              onClick: () => setExpanded((x) => !x),
            })}
          >
            <span className="pr-2">
              <GoFileDirectory />
            </span>
            {selectionTree.name}
            <span className="ml-auto text-white">
              {isExpanded ? <FcCollapse /> : <FcExpand />}
            </span>
            <span
              className="pl-3 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                var date = new Date();
                if (
                  deleteConfirm &&
                  date.getTime() - deleteConfirm.getTime() < 4000
                ) {
                  props.deleteDirectory(selectionTree._id);
                  deleteConfirm = null;
                } else {
                  toast("Click again to delete directory");
                  deleteConfirm = date;
                }
              }}
            >
              <AiFillDelete />
            </span>
          </div>
          <Droppable droppableId={selectionTree._id} type="directory">
            {(provided) => (
              <ul
                {...getCollapseProps()}
                className="pl-5"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {printFiles()}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </li>
      )}
    </Draggable>
  );
}

export default Directory;
