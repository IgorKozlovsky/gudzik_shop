import classNames from "classnames";
import { toJS } from "mobx";
import { useEffect, useState, useRef } from "react";
import { useUserContext } from "..";
import DeviceList from "../components/DeviceList";
import Pagination from "../components/Pagination";
import Properties from "../components/Properties";
import ShopHeader from "../components/ShopHeader";
import Tag from "../components/Tag";
import { fetchTagGroups } from "../http/tagApi";
import { ITags } from "../types/types";

const Shop = () => {
  const { device } = useUserContext();
  useEffect(() => {
    fetchTagGroups().then((data) => device?.setTags(data));
    setCheckedState(device?.tags.map((e) => new Array(e?.tag?.length || 0).fill(false)) || []);
  }, []);

  const [hide, setHide] = useState<boolean>(false);

  const [checkedState, setCheckedState] = useState<boolean[][]>(
    device?.tags.map((e) => new Array(e?.tag?.length || 0).fill(false)) || []
  );

  const checkBoxHandler = (position: number, groupIndex: number) => {
    let newArr = checkedState;
    newArr[groupIndex] = checkedState[groupIndex].map((item, index) => (index === position ? !item : item));
    setCheckedState(newArr);
  };
  const confirmHandler = () => {
    let filtered: string[] = [];
    for (let i = 0; i < checkedState.length; i++) {
      if (device?.tags[i].tag?.length) {
        for (let y = 0; y < checkedState[i].length; y++) {
          if (checkedState[i][y]) {
            //@ts-ignore
            filtered.push(device?.tags[i].tag[y].value);
          }
        }
      }
    }
    device?.setFilteredDevices(
      device?.devices.filter((e) =>
        filtered.every((tag) => {
          return e.tags.includes(tag);
        })
      )
    );
  };

  return (
    <main className="main">
      <ShopHeader onClick={() => setHide(!hide)} />
      <Properties checkedState={checkedState} checkBoxHandler={checkBoxHandler} onClick={confirmHandler} />
      <DeviceList />
      <Pagination />
      <nav
        className={classNames("aside-humburger-list", {
          "aside-humburger-hide": hide,
        })}
      >
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
        <button className="button" onClick={confirmHandler}>
          Підтвердити
        </button>
        <button className="button button--inform" onClick={() => setHide(!hide)}>
          Закрити
        </button>
      </nav>
    </main>
  );
};

export default Shop;
