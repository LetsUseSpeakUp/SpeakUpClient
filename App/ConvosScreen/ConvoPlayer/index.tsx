import React, { useEffect } from 'react';
import {useState} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Button} from "react-native";
import { Slider } from 'react-native-elements'


export default function ConvoPlayer() {
    //TODO
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 20 }}>
            <ProgressSlider/>
            <Button title="Play" onPress={()=>{}} />
        </SafeAreaView>
        
    )
}

function ProgressSlider() {
    const [progress, setProgress] = useState(0)
    const [slidingCompleteVal, setSlidingCompleteVal] = useState(0);

    const onSlidingComplete = (value: number)=>{        
        setSlidingCompleteVal(value);
    }    

    return (
        <View >
            <Slider
                value={progress}
                onValueChange={(value) => setProgress(value)}
                onSlidingComplete={(value)=>{onSlidingComplete(value)}}
            />
            <Text>Value: {progress}</Text>
            <Text>Sliding Complete: {slidingCompleteVal}</Text>
        </View>
    )
}

