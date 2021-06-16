import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, Animated} from 'react-native'
import { Constants, Colors, SpeakupTextInput, PrimaryButton, SecondaryButton } from '../../Graphics';

export default function EnterVerificationCodeScreen(props: { onVerificationCodeSet: (verificationCode: string) => void, onBackPressed: () => void }) {
    const [verificationCode, setVerificationCode] = React.useState('');
    const nextEnabled = verificationCode.length > 0;
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
        props.onVerificationCodeSet(verificationCode);
    }

    return (
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.titleTextContainer}>
                    <Text style={{
                        fontFamily: Constants.fontFamily, fontSize: Constants.majorTitleFontSize,
                        color: Colors.headingTextColor
                    }}>We just texted you a verification code. Please enter it below.</Text>
                </View>
                <Animated.View style={{...styles.verificationCodeContainer, opacity: fadeInAnimation}}>
                    <SpeakupTextInput placeholderText={'Verification Code'} onChangeText={(text) => { setVerificationCode(text) }} autoFocus={true}
                        keyboardType='number-pad' onSubmitEditing={() => {
                            if (nextEnabled) nextPressed();
                        }} />
                </Animated.View>
                <View style={styles.buttonContainer}>
                    <SecondaryButton title={'Back'} onPress={props.onBackPressed} />
                    <PrimaryButton text={'Next'} disabled={!nextEnabled} onPress={nextPressed} />
                </View>
            </View>
        </SafeAreaView>
    );
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
        paddingHorizontal: Constants.paddingHorizontal
    },
    verificationCodeContainer: {
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