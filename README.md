# react-native-dropdown-autocomplete

[![npm (scoped)](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/react-native-dropdown-autocomplete)

Based on https://bit.ly/2AFjUsj, the most significant advantage of this package among all others is that you can have multiple autocomplete's on your page after following instructions below. Works on Android and IOS.

## Usage
##### Install the package
```
npm i react-native-dropdown-autocomplete
```

##### Wrap the page you want to have autocomplete on with ```withKeyboardAwareScrollView```:

```javascript
import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import shortid from "shortid";
import {Autocomplete, withKeyboardAwareScrollView} from "react-native-dropdown-autocomplete";

class HomeScreen extends Component {
  handleSelectItem(item, index) {
    const {onDropdownClose} = this.props;
    onDropdownClose();
    console.log(item);
  }

  render() {
    const autocompletes = [...Array(10).keys()];

    const {scrollToInput, onDropdownClose, onDropdownShow} = this.props;

    return (
      <View style={styles.autocompletesContainer}>
        {autocompletes.map(() => (
          <Autocomplete
            key={shortid.generate()}
            style={styles.input}
            scrollToInput={ev => scrollToInput(ev)}
            handleSelectItem={(item, id) => this.handleSelectItem(item, id)}
            onDropdownClose={() => onDropdownClose()}
            onDropdownShow={() => onDropdownShow()}
            renderIcon={() => (
              <Ionicons name="ios-paper-plane" size={20} color="black" />
            )}
            fetchDataUrl="https://5b927fd14c818e001456e967.mockapi.io/branches"
            minimumCharactersCount={2}
            highlightText
            valueExtractor={item => item.name}
            rightContent
            rightTextExtractor={item => item.properties}
          />
        ))}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  autocompletesContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: "100%",
  },
  input: {maxHeight: 40},
  inputContainer: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.dividerColor,
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: "5%",
    width: "100%",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: theme.bgPrimary,
  },
  plus: {
    position: "absolute",
    left: 15,
    top: 10,
  },
});

export default withKeyboardAwareScrollView(HomeScreen);
```

### Authors:
 **[Maksym Plotnikov](https://github.com/maksym-plotnikov)**
 
 **[Maksym Kordiyak](https://github.com/maxkordiyak)**