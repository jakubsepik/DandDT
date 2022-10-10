import { IoMdClose } from "react-icons/io";
function tab(props) {
  return (
    <div
      className="group relative text-white pl-4 pr-5 flex items-center border-r-[1px] border-border hover:backdrop-brightness-150"
      onClick={() => props.openEditor(0, props.item._id)}
    >
      {props.item.name}
      <span
        className="absolute right-[1px] hidden group-hover:inline hover:bg-slate-800 rounded"
        onClick={(e) => {
          e.stopPropagation();
          props.closeEditor(props.item._id);
        }}
      >
        <IoMdClose />
      </span>
    </div>
  );
}
export default tab;
