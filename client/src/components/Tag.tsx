import { FC, useEffect, useState } from "react";

interface TagProps {
  value: string;
  id: number;
  index: number;
  groupIndex: number;
  checked: boolean;
  checkBoxHandler: (index: number, groupIndex: number) => void;
}

const Tag: FC<TagProps> = ({ value, id, index, checked, groupIndex, checkBoxHandler }) => {
  const [check, setCheck] = useState(checked);
  return (
    <div className="box">
      <label htmlFor={`custom-checkbox-${groupIndex}${id}`}>{value} </label>
      <input
        type={"checkbox"}
        aria-labelledby={`Checkbox ${value}`}
        id={`custom-checkbox-${groupIndex}${id}`}
        name={value}
        value={value}
        checked={check}
        onClick={() => setCheck(!check)}
        onChange={() => checkBoxHandler(index, groupIndex)}
      />
    </div>
  );
};

export default Tag;
