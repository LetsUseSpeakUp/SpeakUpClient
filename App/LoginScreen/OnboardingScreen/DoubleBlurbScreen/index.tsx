import React, {useRef} from 'react'
import {SafeAreaView, View, StyleSheet, Text, Image, Animated, Button} from 'react-native';
import {Constants} from '../../../Graphics/index'

export default function DoubleBlurbScreen(props: {topBlurbText: string, bottomBlurbText: string, onNextPressed: ()=>void, onBackPressed?: ()=>void}){
    const blurbTextAnimation = useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
          blurbTextAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }).start();
      }, [blurbTextAnimation])
      

    return(
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.topBlurbContainer}>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.blurbFontSize, fontWeight: 'bold', marginTop: 20}}>{props.topBlurbText}</Text>
            </View>
            <View style={{borderBottomWidth: 2, width: '60%'}}/>
            <Animated.View style={{display: 'flex', flex: 1, width: '100%', 
                paddingHorizontal: Constants.paddingHorizontal, opacity: blurbTextAnimation}}>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.blurbFontSize, fontWeight: 'bold', marginTop: 20}}>{props.bottomBlurbText}</Text>
            </Animated.View>
            <View style={(props.onBackPressed == null) ? styles.oneButtonContainer: styles.twoButtonContainer}>
                {(props.onBackPressed != null) && <Button title='Back' onPress={props.onBackPressed}/>}
                <Button title='Next' onPress={props.onNextPressed}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display: 'flex',
        flex: 1,        
        alignItems: 'center',        
        justifyContent: 'center'
    },    
    topBlurbContainer: {
        display: 'flex',
        flex: 1.5,    
        width: '100%',
        paddingHorizontal: Constants.paddingHorizontal,
        justifyContent: 'flex-end',
        paddingBottom: Constants.paddingVertical
    },
    twoButtonContainer: {
       display: 'flex',
       flexDirection: 'row',
       alignItems: 'flex-start',
       justifyContent: 'space-between',
       paddingHorizontal: Constants.paddingHorizontal,
       width: '100%'
    },
    oneButtonContainer: {
        display: 'flex',       
       alignItems: 'flex-end',
       paddingHorizontal: Constants.paddingHorizontal,
       width: '100%',       
    }
})