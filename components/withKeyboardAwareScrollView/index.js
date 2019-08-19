import React, {Component} from "react";
import {Animated, Easing, Keyboard, StyleSheet} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {isIos, isX} from "../../utils/common";
import {theme} from "../../constants/Theme";

const withKeyboardAwareScrollView = WrappedComponent => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.scroll = React.createRef();
      this.keyboardHeight = new Animated.Value(0);
      this.scrollToInput = this.scrollToInput.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
      this.keyboardDidShow = this.keyboardDidShow.bind(this);
      this.keyboardDidHide = this.keyboardDidHide.bind(this);
    }

    scrollToInput(node) {
      setTimeout(() => {
        this.scroll.props.scrollToFocusedInput(node);
      }, 300);
    }

    keyboardDidShow(event) {
      if (!isIos) {
        if (event && event.endCoordinates && event.endCoordinates.height) {
          const keyboardHeight = event.endCoordinates.height;
          Animated.timing(this.keyboardHeight, {
            toValue: keyboardHeight,
            duration: 200,
            easing: Easing.linear,
          }).start();
        }
      }
    }

    keyboardDidHide() {
      if (!isIos) {
        Animated.timing(this.keyboardHeight, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
        }).start();
      }
    }

    handleScroll() {
      if (!isIos) {
        if (this.keyboardHeight.__getValue() > 0) {
          Keyboard.dismiss();
          this.keyboardDidHide();
        }
      }
    }

    componentDidMount() {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this.keyboardDidShow,
      );
    }

    componentWillUnmount() {
      this.keyboardDidShowListener.remove();
    }

    render() {
      return (
        <KeyboardAwareScrollView
          innerRef={ref => {
            this.scroll = ref;
          }}
          style={styles.container}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          onMomentumScrollEnd={event => this.handleScroll(event)}
          scrollEventThrottle={16}
          enableResetScrollToCoords={false}
        >
          <Animated.View
            style={[styles.container, {paddingBottom: this.keyboardHeight}]}
          >
            <WrappedComponent
              {...this.props}
              scrollToInput={this.scrollToInput}
              onDropdownClose={this.keyboardDidHide}
              onDropdownShow={this.keyboardDidShow}
            />
          </Animated.View>
        </KeyboardAwareScrollView>
      );
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
    paddingBottom: isX ? 30 : 0,
  },
});

export default withKeyboardAwareScrollView;
