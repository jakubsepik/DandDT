import React, { useState, useEffect } from "react";
import CreatableSelect, { useCreatable } from "react-select/creatable";
import { MdGroups } from "react-icons/md";
import Character from "./character";
import toast from "react-hot-toast";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const target = process.env.REACT_APP_HOST_BACKEND;

function LeftPanel() {
  const [selected_group, setSelected_group] = useState(null);
  const [options, setOptions] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    axios.get(target + "getGroups").then((res) => {
      if (res.data.groups === undefined) return;
      setOptions(
        res.data.groups.map((item) => {
          return { value: item._id, label: item.name };
        })
      );
    });
  }, []);

  function getCharacters(selected) {
    axios
      .post(target + "getCharacters", { group_id: selected.value })
      .then((res) => {
        setCharacters(res.data);
      });
  }

  function printCharacters() {
    if (characters)
      return characters.map((item) => {
        return <Character {...item} key={item._id} />;
      });
  }

  function addCharacter(character = null) {
    axios
      .post(target + "addCharacter", {
        group_id: selected_group.value,
        _id: character?._id,
        character: character,
      })
      .then((res) => {
        if (character === null) {
          toast.success("Character added");
          setCharacters([...(characters ? characters : []), res.data]);
        }
      });
  }

  return (
    <div className="bg-red=500 w-[20%] border-r-2 border-border p-1 dark:text-white mb-3">
      <div className="h-[8%] flex items-center justify-between mb-2 border-quaternary border-b-[1px]">
        <span className="pr-2 dark:text-quaternary text-lg cursor-pointer hover:brightness-150">
          <MdGroups />
        </span>
        <CreatableSelect
          options={options}
          menuPlacement="bottom"
          placeholder="Select group"
          defaultValue={null}
          value={selected_group}
          onCreateOption={(inputValue) => {
            axios
              .post(target + "addGroup", { name: inputValue })
              .then((res) => {
                setSelected_group({
                  value: res.data._id,
                  label: res.data.name,
                });
                setOptions([
                  ...options,
                  { value: res.data._id, label: res.data.name },
                ]);
              });
          }}
          onChange={(value) => {
            setSelected_group(value);
            getCharacters(value);
          }}
          //isValidNewOption={()=>{return false}}
          closeMenuOnSelect
          noOptionsMessage={() => {
            return "^Write new group^";
          }}
          classNames={{
            container: (state) => "w-full text-sm",
            control: (state) =>
              "shadow-none bg-transparent dark:text-white border-quaternary border-0",
            menuList: (state) => "dark:bg-tertiary dark:text-white",
            option: (state) =>
              "bg-transparent dark:bg-tertiary dark:text-white",
            input: (state) => "dark:text-white",
            valueContainer: (state) => "bg-transparent",
            placeholder: (state) => "text-#878d97",
            indicatorSeparator: (state) => "bg-quaternary",
            dropdownIndicator: (state) => "text-quaternary",
            singleValue: (state) => "dark:text-white",
          }}
        />
      </div>
      <div className="h-[92%]">
        {selected_group !== null ? (
          <div className="h-full flex flex-col items-center text-sm overflow-y-auto mb-6 no-scrollbar">
            {printCharacters()}
            <button
              className="bg-orange-500 w-[90%] rounded-md mt-3 py-1"
              onClick={() => addCharacter()}
            >
              Add new character
            </button>
            <button className="bg-green-500 w-[90%] rounded-md mt-2 py-1">
              Start session
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center">
            <MdGroups fontSize={"5.5em"} />
            <div className="text-center">Select or create new group</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftPanel;
