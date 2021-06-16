import React from 'react'
import {View, Text, StyleSheet, SafeAreaView} from 'react-native'
import {Constants, Colors, SpeakupTextInput, PrimaryButton, SecondaryButton} from '../../Graphics';

export default function EnterPhoneNumberScreen(props: {onPhoneNumberSet: (phoneNumber: string)=>void, onBackPressed: ()=>void}){
    const [phoneNumber, setPhoneNumber] = React.useState('');   
    const nextEnabled = isPhoneNumberValid(phoneNumber);
    
    const nextPressed = ()=>{
        props.onPhoneNumberSet(phoneNumber);
    }

    return (
        <SafeAreaView style={styles.flexContainer}>
            <View style = {styles.contentContainer}>
                <View style={styles.titleTextContainer}>
                    <Text style={{
                        fontFamily: Constants.fontFamily, fontSize: Constants.majorTitleFontSize,
                        color: Colors.headingTextColor
                    }}>What is your phone number?</Text>                    
                </View>
                <View style={styles.nameFieldsContainer}>
                    <View style={styles.firstNameContainer}>
                        <SpeakupTextInput placeholderText={'Your Phone Number'} onChangeText={(text)=>{setPhoneNumber(text)}} autoFocus={true}                             
                            onSubmitEditing={()=>{
                                if(nextEnabled) nextPressed();
                            }}/>
                    </View>                                          
                </View>
                <View style={styles.buttonContainer}>
                    <SecondaryButton title={'Back'} onPress={props.onBackPressed}/>
                    <PrimaryButton text={'Next'} disabled={!nextEnabled} onPress={nextPressed}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const isPhoneNumberValid = (phoneNumber: string)=>{
    //TODO
    return true;
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        backgroundColor: Colors.backgroundColor,
        flex: 1
    },
    contentContainer: {
        display: 'flex',
        flex: .4,        
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleTextContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: Constants.paddingTop,
    },    
    nameFieldsContainer: {
        width: '60%',
        display: 'flex',
        flex: .5,
        justifyContent: 'space-between', 
    },
    firstNameContainer: {
        paddingBottom: Constants.paddingBottom
    },
    lastNameContainer: {
        paddingVertical: Constants.paddingBottom
    },
    buttonContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: Constants.paddingBottom,
        paddingHorizontal: Constants.paddingHorizontal,
    }
})