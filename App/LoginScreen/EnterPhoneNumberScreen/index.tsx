import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Animated, ActivityIndicator} from 'react-native'
import { Constants, Colors, SpeakupTextInput, PrimaryButton, SecondaryButton } from '../../Graphics';

export default function EnterPhoneNumberScreen(props: { onPhoneNumberSet: (phoneNumber: string) => void, onBackPressed: () => void }) {
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [loading, setIsLoading] = React.useState(false);
    const nextEnabled = isPhoneNumberValid(phoneNumber);
    const fadeInAnimation = React.useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
            fadeInAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, [fadeInAnimation])

    const nextPressed = () => {
        setIsLoading(true);
        props.onPhoneNumberSet('+1' + phoneNumber);        
    }

    return (
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.titleTextContainer}>
                    <Text style={{
                        fontFamily: Constants.fontFamily, fontSize: Constants.majorTitleFontSize,
                        color: Colors.headingTextColor
                    }}>What is your phone number?</Text>
                </View>
                <Animated.View style={{...styles.phoneNumberContainer, opacity: fadeInAnimation}}>
                    <SpeakupTextInput placeholderText={'Your Phone Number'} onChangeText={(text) => { setPhoneNumber(text) }} autoFocus={true}
                        keyboardType='number-pad' onSubmitEditing={() => {
                            if (nextEnabled) nextPressed();
                        }} />
                </Animated.View>
                <View style={styles.buttonContainer}>
                    <SecondaryButton title={'Back'} onPress={props.onBackPressed} />
                    <PrimaryButton text={'Next'} disabled={!nextEnabled} onPress={nextPressed} />
                </View>
                <View>
                    <ActivityIndicator animating= {loading}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const isPhoneNumberValid = (phoneNumber: string) => {
    if(phoneNumber.length !== 10) return false;
    for(let i = 0; i < phoneNumber.length; i++){
        if(!phoneNumber[i].match(/^\d+/)) return false;             
    }
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
    phoneNumberContainer: {
        width: '50%'
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