import PropTypes from "prop-types";
import React, {PureComponent} from "react";
import {Keyboard} from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "./DropdownItem.styles";
import {theme} from "../../constants/Theme";

export default class DropdownItem extends PureComponent {
  static defaultProps = {
    color: theme.transparent,
    disabledColor: theme.transparent,
    rippleContainerBorderRadius: 0,
    shadeBorderRadius: 0,
  };

  static propTypes = {
    color: PropTypes.string,
    disabledColor: PropTypes.string,
    rippleContainerBorderRadius: PropTypes.number,
    shadeBorderRadius: PropTypes.number,
    index: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const {onPress, index} = this.props;

    if (typeof onPress === "function") {
      onPress(index);
      Keyboard.dismiss();
    }
  }

  render() {
    const {children, style, ...props} = this.props;

    return (
      <TouchableOpacity
        {...props}
        style={[styles.container, style]}
        onPress={this.onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
