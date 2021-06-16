import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Animated, ScrollView, Image } from 'react-native'
import { Constants, Colors, SpeakupTextInput, PrimaryButton } from '../../Graphics';

export default function DialPadScreen(props: { onCallPlaced: (receiverNumber: string) => void }) {
    const [receiverNumber, setReceiverNumber] = React.useState('');
    const callEnabled = isPhoneNumberValid(receiverNumber);
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
        // props.onCallPlaced('+1' + receiverNumber);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundColor}}>
            <ScrollView scrollEnabled={false} style={{ ...styles.flexContainer}} keyboardShouldPersistTaps='handled'>
                <View style={styles.contentContainer}>
                    <View style={styles.titleTextContainer}>
                        <Text style={{
                            fontFamily: Constants.fontFamily, fontSize: Constants.majorTitleFontSize,
                            color: Colors.headingTextColor
                        }}>Place a Call</Text>
                    </View>
                    <Animated.View style={{ ...styles.phoneNumberContainer, opacity: fadeInAnimation }}>
                        <SpeakupTextInput placeholderText={'Phone Number'} onChangeText={(text) => { setReceiverNumber(text) }} autoFocus={true}
                            keyboardType='number-pad' onSubmitEditing={() => {
                                if (callEnabled) nextPressed();
                            }} />
                    </Animated.View>
                    <View style={styles.buttonContainer}>
                        <PrimaryButton text={'Call'} disabled={!callEnabled} onPress={nextPressed} />
                    </View>
                </View>
                <View style={{...styles.imageHolder}}>
                    <Image source={require('../../Graphics/streamline-icon-logged-in@1000x1000.png')}
                        resizeMode='contain' style={{ height: '70%', marginTop: '20%' }} />
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const isPhoneNumberValid = (phoneNumber: string) => {
    if (phoneNumber.length !== 10) return false;
    for (let i = 0; i < phoneNumber.length; i++) {
        const parsedFloat = parseFloat(phoneNumber[i]);
        if (isNaN(parsedFloat)) return false;
        if (!isFinite(parsedFloat)) return false;
        if (parsedFloat < 0) return false;
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
        flex: 1,
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
        paddingTop: Constants.paddingTop,
        width: '50%'
    },
    buttonContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: Constants.paddingTop,
        paddingBottom: Constants.paddingBottom,
        paddingHorizontal: Constants.paddingHorizontal,
        zIndex: 100
    },
    imageHolder: {
        display: 'flex',    
        height: '200%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})