import React from 'react'
import { KeyboardTypeOptions } from 'react-native'
import { TouchableOpacity, View, Text, TextInput, StyleSheet, Button} from 'react-native'

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
    tabBackgroundColor: '#e5e5ea',
    mediumTint: '#dfdfec',
    lightTint: '#f2f2f7'
}

export const Constants = {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    blurbFontSize: 32,
    contactsListFontSize: 17,
    buttonFontSize: 16,
    detailsFontSize: 14,
    fontFamily: 'Roboto-bold',
    listViewFontFamily: 'Roboto',
    listViewPaddingVertical: 10,
    majorTitleFontSize: 22,
    minorTitleFontSize: 18,
    chevronFontSize: 24,
    propertyFontSize: 16,
    propertySpacing: 2
}

export const PrimaryButtonView = (props: { text: string, opacity?: number}) => {
    const opacity = props.opacity ?? 1;
    return (
        <View style={{ borderRadius: 30, backgroundColor: Colors.primaryButtonBackgroundColor, paddingVertical: 10, paddingHorizontal: 30, opacity: opacity}}>
            <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.buttonFontSize, color: Colors.primaryButtonTextColor }}>{props.text}</Text>
        </View>
    )
}

export const PrimaryButton = (props: { text: string, onPress: () => void, disabled?: boolean}) => {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
            <PrimaryButtonView text={props.text} opacity={props.disabled ? .5 : 1}/>
        </TouchableOpacity>
    )
}

export const SecondaryButton = (props: {title: string, onPress: ()=> void, disabled?: boolean})=>{
    const opacity = props.disabled ? .5: 1;
    return(
        <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
            <View style={{ borderRadius: 30, paddingVertical: 10, paddingHorizontal: 30, opacity: opacity}}>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.buttonFontSize, color: Colors.secondaryButtonColor}}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export const SpeakupTextInput = (props: {placeholderText: string, onChangeText: (newText: string)=>void, autoFocus?: boolean, 
    keyboardType?: KeyboardTypeOptions, defaultValue?: string, onSubmitEditing?: ()=>void})=>{
    const [isFocused, setIsFocused] = React.useState(false);
    


    const styles = StyleSheet.create({
        focused: {
            borderBottomWidth: 3,
            height: 40,
            borderColor: Colors.primaryButtonBackgroundColor,
            color: Colors.primaryButtonBackgroundColor,
            fontFamily: Constants.fontFamily,
            fontSize: Constants.minorTitleFontSize,
            textAlign: 'center'
        },
        unfocused: {
            borderBottomWidth: 2,
            height: 40,
            color: Colors.emphasizedTextColor,
            borderColor: Colors.unemphasizedTextColor,            
            fontFamily: Constants.fontFamily,
            fontSize: Constants.minorTitleFontSize,
            textAlign: 'center'            
        }
    })
    return(
        <TextInput onChangeText={props.onChangeText} placeholder={props.placeholderText} autoFocus={props.autoFocus}
        style={isFocused? styles.focused: styles.unfocused} onFocus={()=>{setIsFocused(true)}} onBlur={()=>{setIsFocused(false)}}
        onSubmitEditing={props.onSubmitEditing} placeholderTextColor={Colors.unemphasizedTextColor} defaultValue={props.defaultValue}
        keyboardType={props.keyboardType}/>
    )
}