import React, { useEffect } from 'react';
import {useState} from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { Slider } from 'react-native-elements'


export default function ConvoPlayer() {
    //TODO
    return (
        <ProgressSlider/>
    )
}

function ProgressSlider() {
    const [progress, setProgress] = useState(0)
    const [slidingCompleteVal, setSlidingCompleteVal] = useState(0);

    const onSlidingComplete = (value: number)=>{
        console.log("ConvoPlayer. onSlidingComplete. Progress val: ", value);
        setSlidingCompleteVal(value);
    }

    useEffect(()=>{
        console.log("ConvoPlayer. progress changed. Progress: ", progress);
    }, [progress])

    return (
        <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 20 }}>
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

