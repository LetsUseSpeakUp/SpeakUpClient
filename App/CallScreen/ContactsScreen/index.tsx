import * as React from 'react';

import EmptyContactScreen from './EmptyContactScreen'
import { useContactData, requestContacts } from './Logic/useContacts'
import { Text, View, SectionList, StyleSheet, TouchableHighlight, SafeAreaView } from 'react-native';
import { Colors, Constants } from '../../Graphics'

export default function ContactsScreen() {
    let contactsData = useContactData();

    const onRetryPressed = () => {
        requestContacts.then((response) => {
            console.log("ContactsScreen::requestContacts: ", response);
            if (response === 'authorized')
                contactsData = useContactData();
        })
    }

    const onContactPressed= (contactNumber: string)=>{
        console.log("Contacts::Contact pressed: ", convertPhoneNumberToSpeakupFormat(contactNumber)) //TODO
    }


    if (contactsData.length == 0) {
        return <EmptyContactScreen onRetryPressed={onRetryPressed} />
    }
    else return (
        <SafeAreaView style={styles.flexContainer}>
            <SectionList
                sections={contactsData}
                keyExtractor={(item, index) => index + item}
                renderSectionHeader={({ section }: any) => {
                    return <ContactSectionHeader title={section.title} />
                }}
                renderItem={({ item }) => <SingleContactItem contact={item} onPress={onContactPressed}/>}
            />
        </SafeAreaView>
    )
}

function SingleContactItem({ contact, onPress }: { contact: any, onPress: (contactNumber: string)=>void }) {
    return (
        <TouchableHighlight style={styles.singleContactContainer} underlayColor={Colors.lightTint} onPress={()=>{onPress(contact.phoneNumbers[0]?.number)}}>
            <View style={styles.contactNameContainer}>
                <Text style={styles.contactText}>{contact.givenName} </Text>
                <Text style={{...styles.contactText, fontWeight: 'bold'}}>{contact.familyName}</Text>
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

const convertPhoneNumberToSpeakupFormat = (rawPhoneNumber: string): string=>{
    if(rawPhoneNumber.length < 2) return '';
    if(rawPhoneNumber.substring(0, 2)!=='+1'){
        rawPhoneNumber = '1' + rawPhoneNumber;
    }
    let convertedNumber = '';
    for(let i = 0; i < rawPhoneNumber.length; i++){
        if(rawPhoneNumber[i].match(/^\d+/)) convertedNumber += (rawPhoneNumber[i]);
    }

    convertedNumber = '+' + convertedNumber;
    return convertedNumber;
}

const styles = StyleSheet.create({
    flexContainer: {
        display:'flex',
        backgroundColor: Colors.backgroundColor
    },
    singleContactContainer: {        
        borderBottomColor: Colors.mediumTint,
        borderBottomWidth: 1,
        paddingVertical: Constants.paddingTop/2,
        marginHorizontal: Constants.paddingHorizontal,
        paddingHorizontal: Constants.paddingHorizontal/2
    },
    contactNameContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    contactText: {
        fontFamily: Constants.listViewFontFamily,
        fontSize: Constants.listItemFontSize,
        color: Colors.headingTextColor,        
    },
    sectionHeader: {
        paddingHorizontal: Constants.paddingHorizontal,
        backgroundColor: Colors.lightTint,
        paddingVertical: 2
    },
    sectionText: {
        fontFamily: Constants.listViewFontFamily,
        fontSize: Constants.detailsFontSize,
        fontWeight: 'bold'
    }
});



export { ContactsScreen }