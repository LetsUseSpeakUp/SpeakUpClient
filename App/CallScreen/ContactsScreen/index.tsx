import * as React from 'react';

import EmptyContactScreen from './EmptyContactScreen'
import { useContactData, requestContacts } from './Logic/useContacts'
import { Text, View, SectionList, StyleSheet, TouchableHighlight, SafeAreaView, ActivityIndicator } from 'react-native';
import { Colors, Constants } from '../../Graphics'

export default function ContactsScreen(props: { onCallPlaced: (receiverNumber: string, receiverFirstName: string, receiverLastName: string) => void}) {
    let contactsDataResponse = useContactData();
    let contactData = contactsDataResponse.contactData;

    const onRetryPressed = () => {
        requestContacts.then((response) => {
            console.log("ContactsScreen::requestContacts: ", response);
            if (response === 'authorized')
                contactsDataResponse = useContactData();
        })
    }

    const onContactPressed= (contactNumber: string, contactFirstName: string, contactLastName: string)=>{
        props.onCallPlaced(contactNumber, contactFirstName, contactLastName);
    }

    if(contactsDataResponse.isLoading){
        return <LoadingScreen/>
    }
    else if (contactData.length == 0) {
        return <EmptyContactScreen onRetryPressed={onRetryPressed} />
    }
    else return (
        <SafeAreaView style={styles.flexContainer}>
            <SectionList
                sections={contactData}
                keyExtractor={(item, index) => index + item}
                renderSectionHeader={({ section }: any) => {
                    return <ContactSectionHeader title={section.title} />
                }}
                renderItem={({ item }) => <SingleContactItem contact={item} onPress={onContactPressed}/>}
            />
        </SafeAreaView>
    )
}

function LoadingScreen(){
    return (
        <View style={styles.loadingScreen}>
            <ActivityIndicator/>
        </View>
    )
}

function SingleContactItem({ contact, onPress }: { contact: any, onPress: (contactNumber: string, contactFirstName: string, contactLastName: string)=>void }) {
    return (
        <TouchableHighlight style={styles.singleContactContainer} underlayColor={Colors.lightTint} onPress={()=>{
            onPress(contact.phoneNumber, contact.firstName, contact.lastName);
            }}>
            <View style={styles.contactNameContainer}>
                <Text style={styles.contactText}>{contact.firstName} </Text>
                <Text style={{...styles.contactText, fontWeight: 'bold'}}>{contact.lastName}</Text>
            </View>            
        </TouchableHighlight>
    )
}

function ContactSectionHeader({ title }: { title: string }) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display:'flex',
        backgroundColor: Colors.backgroundColor,
        flex: 1    
    },
    loadingScreen: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        display: 'flex',
        justifyContent: 'center'
    },
    singleContactContainer: {        
        borderBottomColor: Colors.mediumTint,
        borderBottomWidth: 1,
        paddingVertical: Constants.listViewPaddingVertical,
        marginHorizontal: Constants.paddingHorizontal,
        paddingHorizontal: Constants.paddingHorizontal/2
    },
    contactNameContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    contactText: {
        fontFamily: Constants.listViewFontFamily,
        fontSize: Constants.contactsListFontSize,
        color: Colors.headingTextColor,        
    },
    sectionHeader: {
        paddingHorizontal: Constants.paddingHorizontal,
        backgroundColor: Colors.lightTint,
        paddingVertical: 2,
        marginVertical: -1
    },
    sectionText: {
        fontFamily: Constants.listViewFontFamily,
        fontSize: Constants.detailsFontSize,
        fontWeight: 'bold'
    }
});



export { ContactsScreen }