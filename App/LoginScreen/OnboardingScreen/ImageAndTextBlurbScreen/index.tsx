import React, { useRef } from 'react'
import { SafeAreaView, View, StyleSheet, Text, Image, Animated, Button } from 'react-native';
import { Constants } from '../../../Graphics/index'

export default function ImageAndTextBlurbScreen(props: { imageSource: any, blurbText: string, dontFadeOut?: boolean, onNextPressed: () => void, onBackPressed?: () => void }) {
    const blurbFadeInAnimation = useRef(new Animated.Value(0)).current
    const fadeoutAnimation = useRef(new Animated.Value(1)).current;
    React.useEffect(() => {
        Animated.timing(
            blurbFadeInAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }, [blurbFadeInAnimation])

    const fadeoutThenCallback = (callback: () => void) => {
        if(props.dontFadeOut){
            callback();
            return;
        }

        const fadeoutTime = 500;
        Animated.timing(
            fadeoutAnimation, {
            toValue: 0,
            duration: fadeoutTime,
            useNativeDriver: true
        }
        ).start();
        setTimeout(() => {
            callback();
        }, fadeoutTime)
    }


    return (
        <SafeAreaView style= {styles.flexContainer}>
            <Animated.View style={{ ...styles.flexContainer, opacity: fadeoutAnimation }}>
                <Animated.View style={{ ...styles.imageHolder, opacity: blurbFadeInAnimation }}>
                    <Image source={props.imageSource}
                        resizeMode='contain' style={{ height: '70%', marginTop: '20%' }} />
                </Animated.View>
                <View style={{ borderBottomWidth: 2, width: '60%' }} />
                <Animated.View style={{
                    display: 'flex', flex: 1, width: '100%',
                    paddingHorizontal: Constants.paddingHorizontal, opacity: blurbFadeInAnimation
                }}>
                    <Text style={{ fontFamily: Constants.fontFamily, fontSize: Constants.blurbFontSize, fontWeight: 'bold', marginTop: 20 }}>{props.blurbText}</Text>
                </Animated.View>
                <View style={(props.onBackPressed == null) ? styles.oneButtonContainer : styles.twoButtonContainer}>
                    {(props.onBackPressed != null) && <Button title='Back' onPress={() => { if (props.onBackPressed) fadeoutThenCallback(props.onBackPressed) }} />}
                    <Button title='Next' onPress={() => { fadeoutThenCallback(props.onNextPressed) }} />
                </View>
            </Animated.View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    imageHolder: {
        display: 'flex',
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textHolder: {
        display: 'flex',
        flex: 1,
        width: '100%',
        paddingHorizontal: Constants.paddingHorizontal
    },
    twoButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: Constants.paddingHorizontal,
        width: '100%',
    },
    oneButtonContainer: {
        display: 'flex',
        alignItems: 'flex-end',
        paddingHorizontal: Constants.paddingHorizontal,
        width: '100%'
    }
})