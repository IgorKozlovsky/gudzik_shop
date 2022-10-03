import React, { ChangeEvent, ChangeEventHandler, FC, useState } from "react";
import { useUserContext } from "..";
import { ITags } from "../types/types";
import Tag from "./Tag";

interface PropertiesProps {
  // group: ITags | undefined;
  // groupIndex: number;
  checkedState: boolean[][];
  checkBoxHandler: (position: number, groupIndex: number) => void;
  onClick: () => void;
}

const Properties: FC<PropertiesProps> = ({ checkBoxHandler, checkedState, onClick }) => {
  const { device } = useUserContext();

  return (
    <aside className="aside">
      {device?.tags.map((e: ITags, groupIndex) => {
        if (e.tag?.length) {
          return (
            <div className="aside__item" key={e.id}>
              <legend>{e.name}:</legend>
              {e.tag?.map(({ value, id }, index) => (
                <Tag
                  key={`${groupIndex}${id}`}
                  value={value}
                  id={id}
                  index={index}
                  groupIndex={groupIndex}
                  checked={checkedState[groupIndex][index]}
                  checkBoxHandler={checkBoxHandler}
                />
              ))}
            </div>
          );
        }
      })}
      <button className="button" onClick={onClick}>
        Підтвердити
      </button>
    </aside>
  );
};

export default Properties;
