import React, {useRef} from 'react'
import {SafeAreaView, View, StyleSheet, Text, Image, Animated, Button} from 'react-native';
import {Constants} from '../../../Graphics/index'

export default function ImageAndTextBlurbScreen(props: {imageSource: any, blurbText: string, onNextPressed: ()=>void, onBackPressed?: ()=>void}){
    const blurbTextAnimation = useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
          blurbTextAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }).start();
      }, [blurbTextAnimation])
      

    return(
        <SafeAreaView style={styles.flexContainer}>
            <View style={styles.imageHolder}>
                <Image source={props.imageSource}
                    resizeMode='contain' style={{height: '70%', marginTop: '20%'}}/>
            </View>
            <View style={{borderBottomWidth: 2, width: '60%'}}/>
            <Animated.View style={{display: 'flex', flex: 1, width: '100%', 
                paddingHorizontal: Constants.paddingHorizontal, opacity: blurbTextAnimation}}>
                <Text style={{fontFamily: Constants.fontFamily, fontSize: Constants.blurbFontSize, fontWeight: 'bold', marginTop: 20}}>{props.blurbText}</Text>
            </Animated.View>
            <View style={styles.buttonContainer}>
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
    buttonContainer: {
       display: 'flex',
       flexDirection: 'row',
       alignItems: 'flex-start',
       justifyContent: 'space-between',
       paddingHorizontal: Constants.paddingHorizontal,
       width: '100%'
    }
})