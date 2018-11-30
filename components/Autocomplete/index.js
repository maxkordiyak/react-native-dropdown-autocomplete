import React, {Component, Fragment} from "react";
import {findNodeHandle, ActivityIndicator, TextInput, View} from "react-native";
import {string, bool} from "prop-types";
import Dropdown from "../Dropdown";
import {capitalizeFirstLetter} from "../../utils/string";
import {styles} from "./Autocomplete.styles";
import {get} from "../../utils/api";
import {WAIT_INTERVAL, NO_DATA} from "../../constants/Autocomplete";
import {theme} from "../../constants/Theme";
import locales from "../../constants/Locales";

class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      loading: false,
    };
    this.mounted = false;
    this.timer = null;
    this.dropdown = React.createRef();
    this.container = React.createRef();
    this.setItem = this.setItem.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleInputChange(text) {
    const {minimumCharactersCount} = this.props;
    clearTimeout(this.timer);
    this.setState({inputValue: text});
    if (text.length > minimumCharactersCount) {
      this.setState(
        {
          loading: true,
        },
        () => {
          if (this.mounted) {
            this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
          }
        },
      );
    } else {
      this.setState({loading: false});
    }
  }

  async triggerChange() {
    const {inputValue} = this.state;
    const {fetchDataUrl} = this.props;
    try {
      const response = await get(fetchDataUrl, {search: inputValue});
      if (response.length && this.mounted) {
        this.setState({items: response, loading: false});
      } else {
        this.setState({items: [NO_DATA], loading: false});
      }
      if (this.dropdown) {
        this.dropdown.onPress(this.container);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  setItem(value) {
    const {index, handleSelectItem, valueExtractor} = this.props;
    const capitalizedValue = capitalizeFirstLetter(valueExtractor(value));
    this.setState({inputValue: capitalizedValue});

    handleSelectItem(value, index);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.mounted = false;
  }

  handleBlur() {
    clearTimeout(this.timer);
    this.setState({loading: false});
  }

  render() {
    const {inputValue, items, loading} = this.state;
    const {
      placeholder,
      scrollToInput,
      renderIcon,
      inputContainerStyle,
      inputStyle,
      spinnerStyle,
      spinnerSize,
      listHeader,
      autoCorrect,
      spinnerColor,
      placeholderColor,
      ...dropdownProps
    } = this.props;

    return (
      <Fragment>
        <View style={[styles.inputContainerStyle, inputContainerStyle]}>
          {renderIcon()}
          <TextInput
            ref={ref => {
              this.container = ref;
            }}
            onBlur={event => this.handleBlur(event)}
            autoCapitalize="sentences"
            style={[styles.input, inputStyle]}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor || theme.textSecondary}
            value={inputValue}
            autoCorrect={autoCorrect}
            onChangeText={text => this.handleInputChange(text)}
            onFocus={event => {
              scrollToInput(findNodeHandle(event.target));
            }}
          />
          {loading && (
            <ActivityIndicator
              style={[styles.spinner, spinnerStyle]}
              size={spinnerSize}
              color={spinnerColor || theme.primary}
            />
          )}
        </View>
        {items && items.length > 0 && (
          <Dropdown
            ref={ref => {
              this.dropdown = ref;
            }}
            dropdownPosition={0}
            data={items}
            listHeader={listHeader}
            inputValue={inputValue}
            onChangeValue={this.setItem}
            {...dropdownProps}
          />
        )}
      </Fragment>
    );
  }
}

Autocomplete.defaultProps = {
  placeholder: locales.components.Autocomplete.placeholder,
  spinnerSize: "small",
  listHeader: locales.components.Autocomplete.listHeader,
  autoCorrect: false,
};

Autocomplete.propTypes = {
  placeholder: string,
  spinnerSize: string,
  listHeader: string,
  autoCorrect: bool,
};

export default Autocomplete;
