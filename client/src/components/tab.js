function tab(props) {
  return (
    <div className="tab" onClick={() => props.openEditor(0,props.item._id)}>
      {props.item.name}
      <i
        className="fa fa-close"
        onClick={(e) =>{
            e.stopPropagation();
            props.closeEditor(props.item._id)
        } }
      ></i>
    </div>
  );
}
export default tab;
