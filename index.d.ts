// Type definitions for react-native-dropdown-autocomplete 1.0

import * as React from 'react';

type AutocompleteProps = {
    autoCorrect?: boolean,
    highlightText?: boolean,
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
    inputContainerStyle?: any;
    inputStyle?: any;
    spinnerStyle?: any;
    noDataTextStyle?: any;
    separatorStyle?: any;
    listFooterStyle?: any;
    listHeaderStyle?: any;
    rightContentStyle?: any;
    rightContentItemStyle?: any;
    listHeaderTextStyle?: any;
    overlayStyle?: any;
    pickerStyle?: any;
    containerStyle?: any;

    scrollToInput: (ev: any) => void,
    handleSelectItem: (item: any, index: number) => void,
    onDropdownShow: () => void,
    onDropdownClose: () => void,
    renderIcon?: () => void,
    valueExtractor?: (item: any) => void,
    rightTextExtractor?: (item: any) => void,
    fetchData?: (search: string) => Promise<any>,
}

export class Autocomplete extends React.Component<AutocompleteProps, any> {

}

export function withKeyboardAwareScrollView<P>(
    component: React.ComponentType<P>
): React.ComponentType<P>;
