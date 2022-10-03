import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState, FC } from "react";
import { useUserContext } from "..";

const options = [
  {
    label: "Від дешевих до дорогих",
    value: "DESC",
  },
  {
    label: "Від дорогих до дешевих",
    value: "ASC",
  },
];
interface ShopHeaderProps {
  onClick: () => void;
}

const ShopHeader: FC<ShopHeaderProps> = observer(({ onClick }) => {
  const { device } = useUserContext();
  const [select, setSelect] = useState<string>("DESC");
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelect(e.target.value);
    device?.setOrder(select);
  };
  return (
    <header className="">
      <label>Знайдено {device?.count} товарів</label>
      <button className="button button--inform" onClick={onClick}>
        Фільтр
      </button>
      <select value={select} onChange={(e) => handleChange(e)}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </header>
  );
});

export default ShopHeader;
