import React, {Component, Fragment} from "react";
import {findNodeHandle, ActivityIndicator, TextInput, View} from "react-native";
import {string, bool, number, func} from "prop-types";
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
      filteredItems: [],
    };
    this.mounted = false;
    this.timer = null;
    this.dropdown = React.createRef();
    this.container = React.createRef();
    this.setItem = this.setItem.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.promisifySetState = this.promisifySetState.bind(this);
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

  promisifySetState(state) {
    return (
      this.mounted &&
      new Promise(resolve => this.setState(state, () => resolve()))
    );
  }

  async triggerChange() {
    const {inputValue} = this.state;
    const {fetchDataUrl, valueExtractor} = this.props;
    if (fetchDataUrl) {
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
    } else {
      const filteredItems = this.state.items.filter(item => {
        return (
          valueExtractor(item)
            .toLowerCase()
            .search(inputValue.toLowerCase()) !== -1
        );
      });

      if (filteredItems.length && this.mounted) {
        await this.promisifySetState({
          filteredItems,
          loading: false,
        });
      } else {
        await this.promisifySetState({
          filteredItems: [NO_DATA],
          loading: false,
        });
      }

      if (this.dropdown) {
        this.dropdown.onPress(this.container);
      }
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
    if (this.props.data) {
      this.setState({items: this.props.data});
    }
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
    const {inputValue, items, loading, filteredItems} = this.state;
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
      data,
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
            data={data ? filteredItems : items}
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
  autoCorrect: false,
  minimumCharactersCount: 2,
  highlightText: true,
};

Autocomplete.propTypes = {
  placeholder: string,
  spinnerSize: string,
  listHeader: string,
  placeholderColor: string,
  fetchDataUrl: string,
  minimumCharactersCount: number,
  highlightText: bool,
  rightContent: bool,
  autoCorrect: bool,

  valueExtractor: func,
  renderIcon: func,
  scrollToInput: func.isRequired,
  handleSelectItem: func.isRequired,
  onDropdownClose: func.isRequired,
  onDropdownShow: func.isRequired,
  rightTextExtractor: func,
};

export default Autocomplete;
