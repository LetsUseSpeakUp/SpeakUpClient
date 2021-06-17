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
        console.log("Contacts::Contact pressed: ", contactNumber) //TODO
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
        <TouchableHighlight style={styles.singleContactContainer} underlayColor={Colors.lightTint} onPress={()=>{onPress(contact.phoneNumbers[0])}}>
            <Text style={styles.contactText}>
                {`${contact.givenName} ${contact.familyName}`}
            </Text>
        </TouchableHighlight>
    )
}

function ContactSectionHeader({ title }: { title: string }) {
    return (
        <View>
            <Text>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    flexContainer: {
        display:'flex',
        backgroundColor: Colors.backgroundColor
    },
    singleContactContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomColor: Colors.mediumTint,
        borderBottomWidth: 1,
        paddingVertical: Constants.paddingTop/2,
        marginHorizontal: Constants.paddingHorizontal,
        paddingHorizontal: Constants.paddingHorizontal/2
    },
    contactText: {
        fontFamily: Constants.fontFamily,
        fontSize: Constants.buttonFontSize,
        color: Colors.headingTextColor        
    },
    item: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 20,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}
});



export { ContactsScreen }