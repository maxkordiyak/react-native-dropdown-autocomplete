import {Text} from "react-native";
import React, {Fragment} from "react";

export const capitalizeFirstLetter = string => {
  return string && string.charAt(0).toUpperCase() + string.slice(1);
};

export const highlightString = (string, valueToHighlight, highlightColor) => {
  const startIndex = string
    .toLowerCase()
    .indexOf(valueToHighlight.toLowerCase());

  if (startIndex > -1) {
    return [
      <Text key="substring_0">{string.substring(0, startIndex)}</Text>,
      <Text key="substring_1" style={{color: highlightColor}}>
        {string.substring(startIndex, startIndex + valueToHighlight.length)}
      </Text>,
      <Fragment key="substring_2">
        {string.substring(startIndex + valueToHighlight.length)}
      </Fragment>,
    ];
  }

  return string;
};
