import React, { useState, useRef } from "react";
import { FaRotate } from "react-icons/fa6";
import styles from "./index.module.scss";
import { DropdownSelectorProps } from "Components";

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  dataList,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: string) => {
    setSelected(item);
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div onClick={handleToggleDropdown} className={styles.icon}>
        <FaRotate />
      </div>
      {isOpen && (
        <div className={styles.dropdownList} ref={dropdownRef}>
          {dataList.map((item, index) => (
            <div
              key={index}
              className={styles.dropdownItem}
              onClick={() => handleSelect(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelector;
