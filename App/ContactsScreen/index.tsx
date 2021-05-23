import * as React from 'react';

import {useContactData} from './Logic/useContacts'
import {Text, View, FlatList, StyleSheet, Button} from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
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
    },
    itemText: {
      fontSize: 16,
    },
    message: {
        paddingHorizontal: 8,
        paddingVertical: 100,        
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
  });

export default function ContactsScreen(){
    const contactsData = useContactData(); 
    
    console.log('Contacts.js::Got contacts. Contacts length:', contactsData.length);    

    if(contactsData.length == 0)
        return EmptyContactsScreen();
    else return(
        <View style = {styles.container}>
            <ContactsFlatList contactsData={contactsData}></ContactsFlatList>                    
        </View>
    )
}

function EmptyContactsScreen(){
    return(
        <View style = {styles.message}>
            <Text>Please allow SpeakUps to access contacts in your phone settings</Text>
        </View>        
    )
}

function ContactsFlatList({contactsData} : any){
    let flatListData = []
    if(contactsData.length > 0)
        flatListData = contactsData.map((c: any)=>{return {key: c.recordID, value: c}})    

    return(
        <FlatList 
            data={flatListData}
            renderItem ={({item})=> <SingleContactItem contact={item.value}/>}
        />
    )
}

function SingleContactItem({contact} : any){
    return(
        <View style={styles.item}>
            <Text style={styles.itemText}>
                {`${contact.givenName} ${contact.familyName}`}
            </Text>
        </View>
    )
}

export {ContactsScreen}