import {PixelRatio} from "react-native";
import {colors} from "./Colors";
import {responsiveFontSize} from "../utils/common";

export const theme = {
  primary: colors.primary,
  backgroundPrimary: colors.white,
  transparent: colors.transparent,
  textSubtitle: colors.darkConcrete,
  listItem: colors.muddyGray,
  divider: colors.lightGray,
  sizes: {
    size15: responsiveFontSize(15 / PixelRatio.getFontScale()),
    size16: responsiveFontSize(16 / PixelRatio.getFontScale()),
    size20: responsiveFontSize(20 / PixelRatio.getFontScale()),
    size24: responsiveFontSize(24 / PixelRatio.getFontScale()),
  },
};
