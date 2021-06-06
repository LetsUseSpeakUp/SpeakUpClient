import React from 'react'
import {View, TextInput, Text, Button, StyleSheet} from 'react-native'
import PhoneInput from 'react-native-phone-input';

export default function EnterPhoneNumberScreen({route, navigation}: any){
    const [tempPhoneNumber, setTempPhoneNumber] = React.useState('')
    const phoneInputRef: any = React.useRef();

    const confirmPressed = ()=>{
        route.params.setPhoneNumber(tempPhoneNumber);
        navigation.navigate('Verification Code');
    }

    const onValueChanged = (newValue: string)=>{
        if(newValue[1] !== '1'){
            newValue = '1' + newValue.slice(-1*(newValue.length - 2));
        }        
        phoneInputRef.current.setValue(newValue);
        setTempPhoneNumber(newValue);
    }

    return (
        <View style={styles.container}>
            <Text>Please enter your phone number</Text>            
            <PhoneInput onChangePhoneNumber={(phoneNumber)=>{onValueChanged(phoneNumber)}} ref={phoneInputRef} onPressFlag={()=>{}}
                style={{ borderWidth: 1, height: 50, width: 200 }} initialValue={'1'} textContentType="telephoneNumber"/>
            <Button title={"Confirm"} onPress={() => {confirmPressed()}} disabled={phoneInputRef.current == null? true: !phoneInputRef.current.isValidNumber()}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})