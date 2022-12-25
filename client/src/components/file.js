import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import {AiFillDelete} from "react-icons/ai"
var deleteConfirm = null;

const File = (props) => {
  return (
    <Draggable draggableId={props._id} index={props.index}>
    {(provided) => (
    <li
      className="w-full text-white p-2 cursor-pointer hover:backdrop-brightness-50 flex items-center h-10"
      onClick={()=>{props.renderFile(props._id)}}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <span>{props.file.name}</span>
      <span className="ml-4 tags overflow-hidden">{props.tags}</span>
      <span
        className="ml-auto hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          var date = new Date();
          if (
            deleteConfirm &&
            date.getTime() - deleteConfirm.getTime() < 4000
          ) {
            props.deleteFile(props._id);
            deleteConfirm = null;
          } else {
            toast("Click again for removal of file");
            deleteConfirm = date;
          }
        }}
      ><AiFillDelete/>
      </span>
    </li>
    )}
    </Draggable>
  );
};

export default File;
