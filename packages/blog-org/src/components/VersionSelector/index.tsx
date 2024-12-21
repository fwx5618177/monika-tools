import React, { useState } from "react";
import { Button } from "antd";

const VersionSelector = ({
  value: propValue = ["Version 1", "Version 2", "Version 3"],
  onChange,
}) => {
  const [value, setValue] = useState(propValue || []);

  const handleVersionClick = (version) => {
    const isSelected = value.includes(version);
    let updatedValue;

    if (isSelected) {
      // Remove version if already selected
      updatedValue = value.filter((v) => v !== version);
    } else {
      // Add version if not selected
      updatedValue = [...value, version];
    }

    setValue(updatedValue);
    onChange(updatedValue);

    simulateApiRequest(updatedValue);
  };

  const simulateApiRequest = (selectedVersions) => {
    console.log("API request with selected versions:", selectedVersions);
  };

  return (
    <div>
      {value.map((version) => (
        <Button
          key={version}
          type={value.includes(version) ? "primary" : "default"}
          onClick={() => handleVersionClick(version)}
          style={{ margin: "4px" }}
        >
          {version}
        </Button>
      ))}
    </div>
  );
};

export default VersionSelector;
