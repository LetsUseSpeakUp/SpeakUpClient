import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

export const Colors = {
    backgroundColor: '#fff',
    blurbTextColor: '#000',
    headingTextColor: '#000',
    dividerLineColor: '#000',
    emphasizedTextColor: '#89ABE3',
    unemphasizedTextColor: '#8E8E93',
    primaryButtonBackgroundColor: '#D67E81',
    primaryButtonTextColor: '#fff',
    secondaryButtonColor: '#555555',
}

export const Constants = {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    blurbFontSize: 32,
    buttonFontSize: 14,
    fontFamily: 'Futura',
    majorTitleFontSize: 22,
    minorTitleFontSize: 18
}

export const PrimaryButtonView = (props: { text: string }) => {
    return (
        <View style={{ borderRadius: 30, backgroundColor: Colors.primaryButtonBackgroundColor, paddingVertical: 10, paddingHorizontal: 30 }}>
            <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.buttonFontSize, color: Colors.primaryButtonTextColor }}>{props.text}</Text>
        </View>
    )
}

export const PrimaryButton = (props: { text: string, onPress?: () => void }) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <PrimaryButtonView text={props.text} />
        </TouchableOpacity>
    )
}



//TODO: Create customTextField class
//TODO: Create dividerline class