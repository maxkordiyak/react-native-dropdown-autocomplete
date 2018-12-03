import React, {PureComponent} from "react";
import {
  View,
  Animated,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  Text,
  ViewPropTypes,
} from "react-native";
import PropTypes from "prop-types";
import Ripple from "react-native-material-ripple";
import DropdownItem from "../DropdownItem";
import styles from "./Dropdown.styles";
import {capitalizeFirstLetter, highlightString} from "../../utils/string";
import {NO_DATA} from "../../constants/Autocomplete";
import {theme} from "../../constants/Theme";
import locales from "../../constants/Locales";
export default class Dropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.renderFooter = this.renderFooter.bind(this);

    this.updateRippleRef = this.updateRef.bind(this, "ripple");
    this.updateScrollRef = this.updateRef.bind(this, "scroll");

    this.renderItem = this.renderItem.bind(this);

    this.keyExtractor = this.keyExtractor.bind(this);

    this.blur = () => this.onClose();
    this.focus = this.onPress;

    const {value} = this.props;

    this.mounted = false;
    this.focused = false;

    this.state = {
      opacity: new Animated.Value(0),
      selected: -1,
      modal: false,
      value,
    };

    this.renderHeader = this.renderHeader.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {value} = this.props;
    if (nextProps.value !== value) {
      this.setState({value: nextProps.value});
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPress(container) {
    const {
      data,
      disabled,
      onFocus,
      itemPadding,
      rippleDuration,
      dropdownOffset,
      dropdownMargins: {min: minMargin, max: maxMargin},
      animationDuration,
      onDropdownShow,
      useNativeDriver,
    } = this.props;

    if (disabled) {
      return;
    }
    const itemCount = data.length;
    const timestamp = Date.now();
    if (!itemCount) {
      return;
    }
    this.focused = true;
    if (typeof onFocus === "function") {
      onFocus();
    }
    const dimensions = Dimensions.get("window");
    container.measureInWindow((x, y, containerWidth) => {
      const {opacity} = this.state;
      const delay = Math.max(
        0,
        rippleDuration - animationDuration - (Date.now() - timestamp),
      );
      const selected = this.selectedIndex();

      let leftInset;
      let left = x + dropdownOffset.left - maxMargin;

      if (left > minMargin) {
        leftInset = maxMargin;
      } else {
        left = minMargin;
        leftInset = minMargin;
      }

      let right = x + containerWidth + maxMargin;
      let rightInset;

      if (dimensions.width - right > minMargin) {
        rightInset = maxMargin;
      } else {
        right = dimensions.width - minMargin;
        rightInset = minMargin;
      }

      const top = y + dropdownOffset.top - itemPadding;

      this.setState({
        modal: true,
        width: right - left,
        top,
        left,
        leftInset,
        rightInset,
        selected,
      });

      setTimeout(() => {
        if (this.mounted) {
          this.resetScrollOffset();

          Animated.timing(opacity, {
            duration: animationDuration,
            toValue: 1,
            useNativeDriver,
          }).start(() => {
            if (this.mounted && Platform.OS === "ios") {
              const {flashScrollIndicators} = this.scroll || {};

              if (typeof flashScrollIndicators === "function") {
                flashScrollIndicators.call(this.scroll);
              }
              if (typeof onDropdownShow === "function") {
                onDropdownShow();
              }
            }
          });
        }
      }, delay);
    });
  }

  onClose(val) {
    const {onBlur, onDropdownClose} = this.props;
    const {value} = this.state;
    const finalValue = val || value;

    if (typeof onBlur === "function") {
      onBlur();
    }
    if (typeof onDropdownClose === "function") {
      onDropdownClose();
    }
    if (this.mounted) {
      this.setState({value: finalValue, modal: false});
    }
  }

  onSelect(index) {
    const {data, onChangeValue, animationDuration, rippleDuration} = this.props;

    const value = data[index];

    const delay = Math.max(0, rippleDuration - animationDuration);

    if (typeof onChangeValue === "function") {
      onChangeValue(value);
    }

    setTimeout(() => this.onClose(value), delay);
  }

  onLayout(event) {
    const {onLayout} = this.props;

    if (typeof onLayout === "function") {
      onLayout(event);
    }
  }

  value() {
    const {value} = this.state;

    return value;
  }

  selectedIndex() {
    const {data} = this.props;

    return data.findIndex(item => item != null);
  }

  itemSize() {
    const {fontSize, itemPadding} = this.props;

    return Math.ceil(fontSize * 1.5 + itemPadding * 2);
  }

  visibleItemCount() {
    const {data, itemCount, listHeader} = this.props;
    const properLength = listHeader ? data.length + 1 : data.length;

    return Math.min(properLength, itemCount);
  }

  tailItemCount() {
    return Math.max(this.visibleItemCount() - 2, 0);
  }

  rippleInsets() {
    const {rippleInsets} = this.props;
    const {top = 16, right = 0, bottom = -8, left = 0} = rippleInsets || {};

    return {top, right, bottom, left};
  }

  resetScrollOffset() {
    const {selected} = this.state;
    const {data, dropdownPosition} = this.props;

    let offset = 0;
    const itemCount = data.length;
    const itemSize = this.itemSize();
    const tailItemCount = this.tailItemCount();
    const visibleItemCount = this.visibleItemCount();
    if (itemCount > visibleItemCount) {
      if (dropdownPosition == null) {
        switch (selected) {
          case -1:
            break;
          case 0:
          case 1:
            break;
          default:
            if (selected >= itemCount - tailItemCount) {
              offset = itemSize * (itemCount - visibleItemCount);
            } else {
              offset = itemSize * (selected - 1);
            }
        }
      } else {
        let index = selected - dropdownPosition;

        if (dropdownPosition < 0) {
          index -= visibleItemCount;
        }
        index = Math.max(0, index);
        index = Math.min(index, itemCount - visibleItemCount);
        if (selected >= 0) {
          offset = itemSize * index;
        }
      }
    }

    if (this.scroll) {
      this.scroll.scrollToOffset({offset, animated: false});
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  keyExtractor(item, index) {
    const {valueExtractor} = this.props;

    return `${index}-${valueExtractor(item, index)}`;
  }

  renderRipple() {
    const {
      baseColor,
      rippleColor = baseColor,
      rippleOpacity,
      rippleDuration,
      rippleCentered,
      rippleSequential,
    } = this.props;

    const {bottom, ...insets} = this.rippleInsets();
    const style = {
      ...insets,

      height: this.itemSize() - bottom,
      position: "absolute",
    };

    return (
      <Ripple
        style={style}
        rippleColor={rippleColor}
        rippleDuration={rippleDuration}
        rippleOpacity={rippleOpacity}
        rippleCentered={rippleCentered}
        rippleSequential={rippleSequential}
        ref={this.updateRippleRef}
      />
    );
  }

  renderEmptyItem() {
    const {noDataText, noDataTextStyle} = this.props;

    return (
      <DropdownItem index={0} style={{paddingLeft: 15}}>
        <Text
          style={[styles.listItemText, styles.noData, noDataTextStyle]}
        >
          {noDataText}
        </Text>
      </DropdownItem>
    );
  }

  renderItem({item, index}) {
    const {
      highlightText,
      inputValue,
      rightContent,
      valueExtractor,
      highLightColor,
    } = this.props;
    if (item === NO_DATA) {
      return this.renderEmptyItem();
    }
    let text;
    if (highlightText) {
      text = highlightString(
        String(valueExtractor(item)),
        inputValue,
        highLightColor || theme.primary,
      );
    } else {
      text = capitalizeFirstLetter(String(valueExtractor(item)));
    }

    if (item == null) {
      return null;
    }

    const {
      propsExtractor,
      baseColor,
      rippleOpacity,
      rippleDuration,
      shadeOpacity,
      rightTextExtractor,
      listItemTextStyle,
      rightContentStyle,
      rightContentItemStyle,
    } = this.props;

    const props = !propsExtractor(item, index) && {
      rippleDuration,
      rippleOpacity,
      rippleColor: baseColor,
      shadeColor: baseColor,
      shadeOpacity,
      ...props,
      onPress: this.onSelect,
    };

    props.style = [
      props.style,
      {
        height: this.itemSize(),
        paddingLeft: 15,
      },
      rightContent
        ? {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }
        : {},
    ];

    return (
      <DropdownItem index={index} {...props}>
        <Text
          style={[
            styles.listItemText,
            rightContent ? {maxWidth: 200} : {},
            listItemTextStyle,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
        {rightContent && (
          <View style={[styles.rightContent, rightContentStyle]}>
            <Text key={item.id} style={[styles.rightContentItem, rightContentItemStyle]}>
              {rightTextExtractor(item)}
            </Text>
          </View>
        )}
      </DropdownItem>
    );
  }

  renderSeparator() {
    const {separatorStyle} = this.props;

    return <View style={[styles.separator, separatorStyle]} />;
  }

  renderFooter() {
    const {listFooterStyle} = this.props;

    return (
      <View style={[styles.listItem, styles.listFooter, listFooterStyle]} />
    );
  }

  renderHeader() {
    const {listHeader, listHeaderStyle, listHeaderTextStyle} = this.props;

    return listHeader ? (
      <View style={[styles.listItem, styles.listHeader, listHeaderStyle]}>
        <Text style={[styles.listHeaderText, listHeaderTextStyle]} key={listHeader}>
          {listHeader.toUpperCase()}
        </Text>
      </View>
    ) : null;
  }

  render() {
    const {
      containerStyle,
      overlayStyle: overlayStyleOverrides,
      pickerStyle: pickerStyleOverrides,
      supportedOrientations,
      ...props
    } = this.props;

    const {data, itemPadding} = props;

    const {left, top, width, modal} = this.state;

    const itemCount = data.length;
    const visibleItemCount = this.visibleItemCount();
    const itemSize = this.itemSize();
    const height = 2 * itemPadding + itemSize * visibleItemCount;
    const translateY = -itemPadding;

    const pickerStyle = {
      width,
      height,
      top,
      left,
      transform: [{translateY}],
    };

    const itemData = itemCount ? data : [NO_DATA];

    return (
      <View onLayout={this.onLayout} style={containerStyle}>
        <Modal
          visible={modal}
          transparent
          onRequestClose={this.blur}
          supportedOrientations={supportedOrientations}
        >
          <TouchableOpacity
            onPress={this.blur}
            style={[styles.overlay, overlayStyleOverrides]}
          >
            <View style={[styles.picker, pickerStyle, pickerStyleOverrides]}>
              <FlatList
                keyboardShouldPersistTaps="always"
                ref={this.updateScrollRef}
                data={itemData}
                style={styles.scroll}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                scrollEnabled={visibleItemCount <= itemCount}
                ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={this.renderFooter}
                ListHeaderComponent={this.renderHeader}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

Dropdown.propTypes = {
  noDataText: PropTypes.string,
  hitSlop: PropTypes.object,
  onChangeValue: PropTypes.func,
  inputValue: PropTypes.string,
  listHeader: PropTypes.string,
  disabled: PropTypes.bool,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  ),

  valueExtractor: PropTypes.func,
  labelExtractor: PropTypes.func,
  propsExtractor: PropTypes.func,

  absoluteRTLLayout: PropTypes.bool,

  dropdownOffset: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),

  dropdownMargins: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }),

  dropdownPosition: PropTypes.number,

  rippleColor: PropTypes.string,
  rippleCentered: PropTypes.bool,
  rippleSequential: PropTypes.bool,

  rippleInsets: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),

  rippleOpacity: PropTypes.number,
  shadeOpacity: PropTypes.number,

  rippleDuration: PropTypes.number,
  animationDuration: PropTypes.number,

  fontSize: PropTypes.number,

  textColor: PropTypes.string,
  itemColor: PropTypes.string,
  selectedItemColor: PropTypes.string,
  disabledItemColor: PropTypes.string,
  baseColor: PropTypes.string,

  itemTextStyle: Text.propTypes.style,
  separatorStyle: (ViewPropTypes || View.propTypes).style,
  listFooterStyle: (ViewPropTypes || View.propTypes).style,
  listHeaderStyle: (ViewPropTypes || View.propTypes).style,
  itemCount: PropTypes.number,
  itemPadding: PropTypes.number,

  onLayout: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,

  renderBase: PropTypes.func,
  renderAccessory: PropTypes.func,

  containerStyle: (ViewPropTypes || View.propTypes).style,
  overlayStyle: (ViewPropTypes || View.propTypes).style,
  pickerStyle: (ViewPropTypes || View.propTypes).style,

  supportedOrientations: PropTypes.arrayOf(PropTypes.string),

  useNativeDriver: PropTypes.bool,
};

Dropdown.defaultProps = {
  noDataText: locales.components.Autocomplete.noData,
  hitSlop: {top: 6, right: 4, bottom: 6, left: 4},
  disabled: false,
  data: [],
  valueExtractor: ({value} = {}) => value,
  propsExtractor: () => null,
  dropdownOffset: {
    top: 50,
    left: 20,
  },
  dropdownMargins: {
    min: 8,
    max: 16,
  },
  rippleCentered: false,
  rippleSequential: true,
  rippleInsets: {
    top: 16,
    right: 0,
    bottom: -8,
    left: 0,
  },
  rippleOpacity: 0.54,
  shadeOpacity: 0.12,
  rippleDuration: 400,
  animationDuration: 225,
  fontSize: theme.sizes.size16,
  textColor: "rgba(0, 0, 0, .87)",
  itemColor: "rgba(0, 0, 0, .54)",
  baseColor: "rgba(0, 0, 0, .38)",
  itemCount: 4,
  itemPadding: 8,
  supportedOrientations: [
    "portrait",
    "portrait-upside-down",
    "landscape",
    "landscape-left",
    "landscape-right",
  ],
  useNativeDriver: false,
};
