# react-native-dropdown-autocomplete

[![npm (scoped)](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/react-native-dropdown-autocomplete)

Based on https://bit.ly/2AFjUsj, the most significant advantage of this package among all others is that you can have multiple autocomplete's on your page after following instructions below. Works on Android and IOS.
<p align="center">
<img src="https://media.giphy.com/media/AS6Ts8m31qVFNpVHUZ/giphy.gif" alt="Autocomplete demo">
<img src="https://media.giphy.com/media/3qs6aVPvVVCBkty3v5/giphy.gif" alt="Autocomplete demo with pre-filled inputs">
</p>

## Usage
##### Install the package
```
npm i react-native-dropdown-autocomplete
```

##### Wrap the page you want to have autocomplete on with ```withKeyboardAwareScrollView```:

```javascript
import React from "react";
import {StyleSheet, View, SafeAreaView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
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

    const apiUrl = "https://5b927fd14c818e001456e967.mockapi.io/branches";

    const {scrollToInput, onDropdownClose, onDropdownShow} = this.props;

    return (
      <View style={styles.autocompletesContainer}>
        <SafeAreaView>
          {autocompletes.map(() => (
            <Autocomplete
              key={shortid.generate()}
              style={styles.input}
              scrollToInput={ev => scrollToInput(ev)}
              handleSelectItem={(item, id) => this.handleSelectItem(item, id)}
              onDropdownClose={() => onDropdownClose()}
              onDropdownShow={() => onDropdownShow()}
              renderIcon={() => (
                <Ionicons name="ios-add-circle-outline" size={20} color="#c7c6c1" style={styles.plus} />
              )}
              fetchDataUrl={apiUrl}
              minimumCharactersCount={2}
              highlightText
              valueExtractor={item => item.name}
              rightContent
              rightTextExtractor={item => item.properties}
            />
          ))}
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  autocompletesContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: "100%",
    paddingHorizontal: 8,
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
    borderColor: "#c7c6c1",
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: "5%",
    width: "100%",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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