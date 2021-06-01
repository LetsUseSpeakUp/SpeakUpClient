import React from 'react';
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
    return (
        <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 20 }}>
            <Slider
                value={progress}
                onValueChange={(value) => setProgress(value)}
            />
            <Text>Value: {progress}</Text>
        </View>
    )
}

