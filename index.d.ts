// Type definitions for react-native-dropdown-autocomplete 1.0

import * as React from 'react';
import { ViewStyle, TextStyle, StyleProp, KeyboardTypeOptions } from 'react-native';

type AutocompleteProps = {
    autoCorrect?: boolean,
    keyboardType?: KeyboardTypeOptions;
    highlightText?: boolean,
    highLightColor?: string,
    rightContent?: boolean,
    resetOnSelect?: boolean,
    minimumCharactersCount?: number,
    waitInterval?: number,
    placeholder?: string,
    placeholderColor?: string,
    spinnerSize?: string,
    spinnerColor?: string,
    listHeader?: string,
    fetchDataUrl?: string,
    noDataText?: string;
    initialValue?: string;
    inputContainerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    spinnerStyle?: StyleProp<ViewStyle>;
    noDataTextStyle?: StyleProp<TextStyle>;
    separatorStyle?: StyleProp<ViewStyle>;
    listFooterStyle?: StyleProp<ViewStyle>;
    listHeaderStyle?: StyleProp<ViewStyle>;
    rightContentStyle?: StyleProp<ViewStyle>;
    rightContentItemStyle?: StyleProp<TextStyle>;
    listHeaderTextStyle?: StyleProp<TextStyle>;
    overlayStyle?: StyleProp<TextStyle>;
    pickerStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    scrollStyle?: StyleProp<ViewStyle>;

    scrollToInput?: (ev: any) => void,
    handleSelectItem: (item: any, index: number) => void,
    onDropdownShow?: () => void,
    onDropdownClose?: () => void,
    onChangeText?: (search: string) => void,
    renderIcon?: () => void,
    valueExtractor?: (item: any) => void,
    rightTextExtractor?: (item: any) => void,
    fetchData?: (search: string) => Promise<any[]>,
}

export class Autocomplete extends React.Component<AutocompleteProps, any> {

}

export function withKeyboardAwareScrollView<P>(
    component: React.ComponentType<P>
): React.ComponentType<P>;
