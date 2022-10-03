import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { useUserContext } from "../..";
import { createTag, createTagGroup, deleteTag, deleteTagGroup, fetchTagGroups } from "../../http/tagApi";
import { ITag, ITags } from "../../types/types";

interface CreateTagProps {
  show: boolean;
  onHide: (e: boolean) => void;
}

const CreateTag: FC<CreateTagProps> = observer(({ show, onHide }) => {
  const { device } = useUserContext();

  const [dropMenu, setDropMenu] = useState<boolean>(false);
  const [newGroup, setNewGroup] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");

  useEffect(() => {
    fetchTagGroups().then((data) => device?.setTags(data));
  }, []);

  const handlerDropMenu = (tag: ITags) => {
    setDropMenu(!dropMenu);
    device?.setSelectedTag(tag);
  };

  const removeGroup = async (id: number) => {
    await deleteTagGroup(id).then((data) => device?.setTags(data));
    device?.setSelectedTag({ id: 0, name: "Виберіть групу тегів" });
  };
  const addNewGroup = async (name: string) => {
    if (name) {
      await createTagGroup(name).then((data) => device?.setTags(data));
      device?.setSelectedTag({ id: 0, name: "Виберіть групу тегів" });
      setDropMenu(true);
      setNewGroup("");
    }
  };

  const addNewTag = async (name: string, id: number | undefined) => {
    if (name && id) {
      await createTag(name, id).then((data) => {
        device?.setTags(data);
        device?.setSelectedTag(data.filter((e: ITags) => e.id == id)[0]);
      });
      setNewTag("");
    }
  };
  const removeTag = async (id: number, tagsId: number) => {
    if (id) {
      await deleteTag(id).then((data) => {
        device?.setTags(data);
        device?.setSelectedTag(data.filter((e: ITags) => e.id == tagsId)[0]);
      });
    }
  };

  return (
    <>
      {show && (
        <div className="modal">
          <div className="modal-wrapper">
            <div className="modal-content">
              <div className="modal-title">Додати нову групу тегів</div>
              <hr />
              <ul className="modal-form">
                <li className="modal-form__item dropdown">
                  <button className="button dropdown-button" type="button" onClick={() => setDropMenu(!dropMenu)}>
                    {device?.selectedTag.name}
                  </button>
                  {dropMenu && !!device?.tags.length && (
                    <ul className="dropdown-menu">
                      {device?.tags.map((tag) => (
                        <li
                          key={tag.id}
                          onClick={() => {
                            handlerDropMenu(tag);
                          }}
                        >
                          {tag.name}{" "}
                          <button className="button button--error" onClick={() => removeGroup(tag.id)}>
                            Х
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li className="modal-items__item ">
                  <input
                    type="text"
                    placeholder="Веведіть назву нової групи"
                    className="input input-maxw"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                  />
                  <button className="button button--success m-l-15" onClick={() => addNewGroup(newGroup)}>
                    Додати
                  </button>
                </li>
                <hr />
                <li className="modal-form__item">
                  <label>Перелік тегів групи:</label>
                  {device?.selectedTag.tag?.map((e) => (
                    <div key={e.id} className="tag m-t-10">
                      {e.value}
                      <button className="button button--error m-l-15" onClick={() => removeTag(e.id, e.tagId)}>
                        Х
                      </button>
                    </div>
                  ))}
                </li>
                <li className="modal-items__item ">
                  <input
                    type="text"
                    placeholder="Веведіть назву нової групи"
                    className="input input-maxw"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <button
                    className="button button--success m-l-15"
                    onClick={() => addNewTag(newTag, device?.selectedTag.id)}
                  >
                    Додати
                  </button>
                </li>
              </ul>
              <hr />
              <div className="modal-controls">
                <button className="button button--error" onClick={() => onHide(false)}>
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default CreateTag;
