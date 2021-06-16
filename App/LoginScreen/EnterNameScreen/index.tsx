import React from 'react'
import { View, TextInput, Text, Button, StyleSheet, SafeAreaView, Animated } from 'react-native'
import { Constants, Colors, PrimaryButton, SpeakupTextInput } from '../../Graphics';

export default function EnterNameScreen(props: { onNameSet: (firstName: string, lastName: string) => void }) {
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('');

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
        props.onNameSet(firstName, lastName);
    }

    const nextEnabled = (firstName.length > 0 && lastName.length > 0);

    return (
            <SafeAreaView style={styles.flexContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.titleTextContainer}>
                        <Text style={{
                            fontFamily: Constants.fontFamily, fontSize: Constants.majorTitleFontSize,
                            color: Colors.headingTextColor
                        }}>What is your name?</Text>
                    </View>
                    <Animated.View style={{...styles.nameFieldsContainer, opacity: fadeInAnimation}}>
                        <View style={styles.firstNameContainer}>
                            <SpeakupTextInput placeholderText={'Your First Name'} onChangeText={(text) => { setFirstName(text) }} autoFocus={true}
                                onSubmitEditing={() => {
                                    if (nextEnabled) nextPressed();
                                }} />
                        </View>
                        <View>
                            <SpeakupTextInput placeholderText={'Your Last Name'} onChangeText={(text) => { setLastName(text) }}
                                onSubmitEditing={() => {
                                    if (nextEnabled) nextPressed();
                                }} />
                        </View>
                    </Animated.View>
                    <View style={styles.buttonContainer}>
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
        flexDirection: 'row-reverse',
        paddingBottom: Constants.paddingBottom,
        paddingHorizontal: Constants.paddingHorizontal,
    }
})