import {Dimensions, Platform} from "react-native";
const {height, width} = Dimensions.get("window");

export const isIos = Platform.OS === "ios";
export const isX = (() => {
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || (height === 896 || width === 896))
  );
})();

export const sleep = (ms, rejecting) =>
  new Promise((resolve, reject) => {
    if (!rejecting) {
      return setTimeout(resolve, ms);
    }

    return setTimeout(reject, ms);
  });

export const responsiveFontSize = (size, factor = 0.857142857, w = 360) => {
  return width <= w ? size * factor : size;
};
