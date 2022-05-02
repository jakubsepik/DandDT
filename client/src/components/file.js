import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

var deleteConfirm = null;

const File = (props) => {
  return (
    <Draggable draggableId={props._id} index={props.index}>
    {(provided) => (
    <li
      className="list-group-item w-100"
      onClick={props.renderFile}
      data-id={props.file._id}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <span>{props.file.name}</span>
      <span className="tags">{props.tags}</span>
      <i
        className="fa fa-close close-icon"
        onClick={(e) => {
          var date = new Date();
          if (
            deleteConfirm &&
            date.getTime() - deleteConfirm.getTime() < 4000
          ) {
            props.deleteFile(e);
            deleteConfirm = null;
          } else {
            toast("Click again for removal of file");
            deleteConfirm = date;
          }
        }}
      />
    </li>
    )}
    </Draggable>
  );
};

export default File;
