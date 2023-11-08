import React, { useState } from "react";

import File from "../components/file";
import { FcCollapse, FcExpand } from "react-icons/fc";
import { GoFileDirectory } from "react-icons/go";
import { AiFillDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { Draggable, Droppable } from "react-beautiful-dnd";

var deleteConfirm = null;

function Directory(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [selectionTree] = useState(props.selectionTree);
  const normalize_filter = props.filter
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
  const printFiles = () => {
    return selectionTree.files.map((element, index) => {
      if (element.constructor === Object) {
        return null;
        /*return (
          <Directory
            key={element._id}
            selectionFilesArray={props.selectionFilesArray}
            selectionTree={element}
            filter={props.filter}
            renderFile={props.renderFile}
            deleteFile={props.deleteFile}
            deleteDirectory={props.deleteDirectory}
          />
        );*/
      } else {
        let item = props.selectionFilesArray.find((x) => x._id === element);
        if (!item) {
          return null;
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
              ) {
                return true;
              }
              return false;
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
  var files = printFiles();
  if (
    props.filter &&
    !files.some((x) => x != null) &&
    !selectionTree.name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim()
      .includes(normalize_filter)
  )
    return <></>;
  else
    return (
      <Draggable draggableId={selectionTree._id} index={props.index}>
        {(providedDraggable)=>(
          <li 
          ref={providedDraggable.innerRef}
            {...providedDraggable.draggableProps}
            {...providedDraggable.dragHandleProps}
          >
            <div
              className="flex items-center h-10 p-2 text-black dark:text-white"
              onClick={()=>setExpanded(!isExpanded)}
            >
              <span className="pr-2">
                <GoFileDirectory />
              </span>
              {selectionTree.name}
              <span className="ml-auto text-black dark:text-white">
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
                  className={"pl-5 " +(!isExpanded?"hidden":"")}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {files.some((x) => x != null) ? (
                    files
                  ) : (
                    <li className="text-gray-600">Empty</li>
                  )}
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
