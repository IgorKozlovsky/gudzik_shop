import { useState } from "react";
import CreateDevice from "../components/modals/CreateDevice";
import CreateTag from "../components/modals/CreateTag";

const AdminPanel = () => {
  const [modalDevice, setModalDevice] = useState<boolean>(false);
  const [modalTag, setModalTag] = useState<boolean>(false);
  return (
    <>
      <ul className="admin-items">
        <li className="admin-items__item" onClick={() => setModalDevice(true)}>
          Додати новий товар до крамниці
        </li>
        <li className="admin-items__item" onClick={() => setModalTag(true)}>
          Додати нову групу тегів
        </li>
      </ul>
      <CreateDevice show={modalDevice} onHide={() => setModalDevice(false)} />
      <CreateTag show={modalTag} onHide={() => setModalTag(false)} />
    </>
  );
};

export default AdminPanel;
