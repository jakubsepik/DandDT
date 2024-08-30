import React, { useState, useEffect } from "react";
import { FaHeart, FaRunning, FaUserEdit } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import toast from "react-hot-toast";

var deleteConfirm = null;
const statuses_template = {
  concentration: 0,
  blinded: 0,
  charmed: 0,
  deafened: 0,
  exhaustion: 0,
  frightened: 0,
  grappled: 0,
  incapacitated: 0,
  invisible: 0,
  paralyzed: 0,
  petrified: 0,
  poisoned: 0,
  prone: 0,
  restrained: 0,
  stunned: 0,
  unconscious: 0,
};

function Character(props) {
  props = {
    ...props,
    name: "Test",
    playerName: "Test",
    level: 1,
    characterClass: "Fighter",
    characterSubclass: "Champion",
    characterRace: "Human",
    HP: 123,
    currentHP: 100,
    AC: 10,
    Speed: 30,
    statuses: ["blinded", "poisoned"],
    items: [],
    notes: "",
  };
  const {
    name,
    playerName,
    level,
    characterClass,
    characterSubclass,
    characterRace,
    HP,
    currentHP,
    AC,
    Speed,
    statuses,
    notes,
  } = props;

  const [expand, setExpand] = useState(false);
  const [updatedStatuses, setStatuses] = useState({ ...statuses_template });

  useEffect(() => {
    statuses.forEach((status) => {
      updatedStatuses[status] = 1;
    });
  }, []);

  return (
    <div className="border-b-[1px] border-gray-500 flex flex-col w-[89%]">
      <div
        onClick={() => setExpand(!expand)}
        className="py-3 hover:backdrop-brightness-75 flex flex-row justify-between"
      >
        <div>{name}</div>

        <div className="relative h-full w-1/3 dark:bg-white/15 bg-black/15">
          <div
            style={{ width: `${(currentHP / HP) * 100}%` }}
            className={"h-full bg-red-600"}
          />
          <div className="absolute left-1/2 top-0 translate-x-[-50%]">
            {currentHP}/{HP}
          </div>
        </div>

        <div className="flex flex-row space-x-1 text-[120%]">
          <span className="hover:text-blue-400 hover:cursor-pointer">
            <FaUserEdit />
          </span>
          <span
          className="hover:text-red-600 hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              var date = new Date();
              if (
                deleteConfirm &&
                date.getTime() - deleteConfirm.getTime() < 4000
              ) {
                props.deleteCharacter(props._id);
                deleteConfirm = null;
              } else {
                toast("Click again to remove file");
                deleteConfirm = date;
              }
            }}
          >
            <AiFillDelete />
          </span>
        </div>
      </div>

      <div
        className={!expand ? "hidden" : "flex flex-col mb-2 items-center ml-3"}
      >
        <div className="flex flex-row justify-between w-full">
          <div className="text-center">
            {characterRace} {characterClass} {characterSubclass}
          </div>
          lv. {level}
        </div>

        <div className="flex flex-row justify-center space-x-12 [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div]:relative mt-4 w-full">
          <div>
            <span className="absolute text-[42px] text-red-400 -z-1">
              <FaHeart />
            </span>
            <span className="relative font-bold">{HP}</span>
          </div>

          <div>
            <span className="absolute text-[42px] text-blue-400 -z-1">
              <FaShield />
            </span>
            <span className="relative font-bold">{AC}</span>
          </div>

          <div>
            <span className="absolute text-[42px] text-green-400 -z-1">
              <FaRunning />
            </span>
            <span className="relative font-bold">{Speed}</span>
          </div>
        </div>

        <div className="flex flex-wrap mt-4">
          {Object.keys(updatedStatuses).map((x) => {
            if (updatedStatuses[x] === 1) {
              return (
                <span className="m-1 p-1 bg-green-600 rounded-lg">{x}</span>
              );
            } else {
              return (
                <span className="m-1 p-1 bg-secondary/40 rounded-lg">{x}</span>
              );
            }
          })}
        </div>

        <div>{notes}</div>
      </div>
    </div>
  );
}

export default Character;
