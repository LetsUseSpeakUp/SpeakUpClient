import React, {useState} from 'react'
import { View, StyleSheet, Button, Text, TextInput} from 'react-native';

export default function LoginScreen(props: any){    
    const [tempPhoneNumber, setTempPhoneNumber] = useState('')

    return(
        <View style={styles.container}>                        
            <Text>Please enter your phone number</Text>
            <TextInput placeholder="My Phone Number" onChangeText={text=>setTempPhoneNumber(text)} 
            autoFocus={true} style={{borderWidth: 1, height: 50, width: 200}} maxLength={15}></TextInput>            
            <Button title={"Confirm"} onPress={()=>{props.onSetPhoneNumber(tempPhoneNumber)}}></Button>               
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})