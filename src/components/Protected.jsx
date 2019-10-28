import React from "react";
import { difference } from "lodash";

const Protected = ({ current, only, children, access }) => {
  if (access) {
    let granted = false;
    current.forEach(cur => {
      if (access.includes(cur)) {
        granted = true;
      }
    });

    if (granted === true) return <>{children}</>;
  }

  if (current.includes(only)) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default Protected;
