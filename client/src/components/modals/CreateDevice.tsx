import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState, ChangeEvent } from "react";
import { useUserContext } from "../..";
import { createDevice, fetchTypes } from "../../http/deviceAPI";
import { fetchTagGroups } from "../../http/tagApi";
import { ITags } from "../../types/types";
import Tag from "../Tag";

interface CreateDeviceProps {
  show: boolean;
  onHide: (e: boolean) => void;
}

const CreateDevice: FC<CreateDeviceProps> = observer(({ show, onHide }) => {
  const { device } = useUserContext();
  useEffect(() => {
    fetchTypes().then((data) => device?.setTypes(data));
    fetchTagGroups().then((data) => device?.setTags(data));
    setGroup(device?.tags[0]);
    setCheckedState(device?.tags.map((e) => new Array(e?.tag?.length || 0).fill(false)) || []);
  }, [show]);

  const [dropMenu, setDropMenu] = useState<boolean>(false);

  const [articul, setArticul] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);

  const [group, setGroup] = useState<ITags | undefined>(device?.tags[0]);
  const [groupIndex, setGroupIndex] = useState<number>(0);
  const [checkedState, setCheckedState] = useState<boolean[][]>(
    device?.tags.map((e) => new Array(e?.tag?.length || 0).fill(false)) || []
  );

  const [info, setInfo] = useState<Array<{ title: string; description: string; number: number }>>([]);
  const [variant, setVariant] = useState<Array<{ name: string; number: number }>>([]);
  const [size, setSize] = useState<Array<{ size: string; price: string; amount: number; number: number }>>([]);

  const handlerAdd = (typeOfSetter: string) => {
    switch (typeOfSetter) {
      case "info":
        setInfo([...info, { title: "", description: "", number: Date.now() }]);
        break;
      case "variant":
        setVariant([...variant, { name: "", number: Date.now() }]);
        break;
      default:
        setSize([...size, { size: "", price: "", amount: 0, number: Date.now() }]);
        break;
    }
  };
  const handlerRemove = (typeOfSetter: string, number: number) => {
    switch (typeOfSetter) {
      case "info":
        setInfo(info.filter((i) => i.number !== number));
        break;
      case "variant":
        setVariant(variant.filter((i) => i.number !== number));
        break;
      default:
        setSize(size.filter((i) => i.number !== number));
        break;
    }
  };
  const handlerChange = (typeOfSetter: string, key: string, value: string, number: number) => {
    switch (typeOfSetter) {
      case "info":
        setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
        break;
      case "variant":
        setVariant(variant.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
        break;
      default:
        setSize(size.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
        break;
    }
  };

  const addDevice = () => {
    if (img instanceof File && articul && device?.selectedType.name !== "Виберіть тип товару") {
      let tags = [];
      for (let i = 0; i < checkedState.length; i++) {
        if (device?.tags[i].tag?.length) {
          for (let y = 0; y < checkedState[i].length; y++) {
            if (checkedState[i][y]) {
              //@ts-ignore
              tags.push(device?.tags[i].tag[y].value);
            }
          }
        }
      }

      const formData = new FormData();
      formData.append("img", img);
      formData.append("articul", articul);
      formData.append("typeId", "" + device?.selectedType.id);
      formData.append("infos", JSON.stringify(info));
      formData.append("variants", JSON.stringify(variant));
      formData.append("sizes", JSON.stringify(size));
      formData.append("tags", JSON.stringify(tags));
      createDevice(formData).then((data) => onHide(false));
    } else {
      alert("Ви не заповнили усі поля");
    }
  };
  const checkBoxHandler = (position: number) => {
    let newArr = checkedState;
    newArr[groupIndex] = checkedState[groupIndex].map((item, index) => (index === position ? !item : item));
    setCheckedState(newArr);
  };
  const changeTagGroup = (tags: ITags | undefined, index: number) => {
    setGroup(tags);
    setGroupIndex(index);
  };

  return (
    <>
      {show && (
        <div className="modal">
          <div className="modal-wrapper">
            <div className="modal-content">
              <div className="modal-title">Додати товар</div>
              <hr />
              <ul className="modal-form">
                <li className="modal-form__item dropdown">
                  <button className="button dropdown-button" type="button" onClick={() => setDropMenu(!dropMenu)}>
                    {device?.selectedType.name || "Виберіть тип товару"}
                  </button>
                  {dropMenu && (
                    <ul className="dropdown-menu">
                      {device?.types.map((type) => (
                        <li
                          key={type.id}
                          onClick={() => {
                            setDropMenu(!dropMenu);
                            device?.setSelectedType(type);
                          }}
                        >
                          {type.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li className="modal-form__item">
                  <input
                    type="text"
                    placeholder="Веведіть артикул товару"
                    className="input input-maxw"
                    value={articul}
                    onChange={(e) => setArticul(e.target.value)}
                  />
                </li>
                <li className="modal-form__item">
                  <input
                    type="file"
                    className="file-input"
                    id="inputFile01"
                    onChange={(e) => {
                      if (e.target.files != null) {
                        setImg(e.target.files[0]);
                      }
                    }}
                  />
                </li>
                <hr />

                <li className="modal-form__item dropdown">
                  <label>Виберіть характеристики товару:</label>
                  <select
                    onChange={(e) =>
                      changeTagGroup(
                        device?.tags.find((el) => el.id == +e.target.value[1]),
                        +e.target.value[0]
                      )
                    }
                  >
                    {device?.tags.map((e, index) => (
                      <option key={e.id} value={`${index}${e.id}`}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  <div>
                    {group?.tag?.map(({ value, id }, index) => (
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
                </li>
              </ul>
              <hr />
              <button className="button" onClick={() => handlerAdd("size")}>
                Додати новий розмір
              </button>
              {size.map((i) => (
                <ul className="modal-items" key={i.number}>
                  <li className="modal-items__item">
                    <input
                      className="input"
                      value={i.size}
                      onChange={(e) => handlerChange("size", "size", e.target.value, i.number)}
                      placeholder="Назва розміру"
                    />
                  </li>
                  <li className="modal-items__item">
                    <input
                      className="input"
                      value={i.price}
                      onChange={(e) => handlerChange("size", "price", e.target.value, i.number)}
                      placeholder="Ціна"
                    />
                  </li>
                  <li className="modal-items__item">
                    <input
                      className="input"
                      type="number"
                      value={i.amount}
                      onChange={(e) => handlerChange("size", "amount", e.target.value, i.number)}
                      placeholder="Кількість"
                    />
                  </li>
                  <li>
                    <button className="button button--error" onClick={() => handlerRemove("size", i.number)}>
                      Удалить
                    </button>
                  </li>
                </ul>
              ))}
              <button className="button" onClick={() => handlerAdd("variant")}>
                Додати нову різноманітність товару
              </button>
              {variant.map((i) => (
                <ul className="modal-items" key={i.number}>
                  <li className="modal-items__item">
                    <input
                      className="input"
                      value={i.name}
                      onChange={(e) => handlerChange("variant", "name", e.target.value, i.number)}
                      placeholder="Назва"
                    />
                  </li>
                  <li>
                    <button className="button button--error" onClick={() => handlerRemove("variant", i.number)}>
                      Удалить
                    </button>
                  </li>
                </ul>
              ))}

              <hr />
              <div className="modal-controls">
                <button className="button button--error" onClick={() => onHide(false)}>
                  Закрити
                </button>
                <button
                  className="button button--success"
                  onClick={() => {
                    addDevice();
                  }}
                >
                  Додати
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default CreateDevice;
