import * as React from 'react';

import EmptyContactScreen from './EmptyContactScreen'
import {useContactData, requestContacts} from './Logic/useContacts'
import {Text, View, FlatList, StyleSheet, Button} from 'react-native';

export default function ContactsScreen(){
    let contactsData = useContactData(); 
    
    const onRetryPressed = ()=>{
        requestContacts.then((response)=>{
            console.log("ContactsScreen::requestContacts: ", response);
            if(response === 'authorized')
                contactsData = useContactData();
        })
    }
      

    if(contactsData.length == 0){
        return <EmptyContactScreen onRetryPressed={onRetryPressed}/>
    }
    else return(
        <View style = {styles.container}>
            <ContactsFlatList contactsData={contactsData}></ContactsFlatList>                    
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

export {ContactsScreen}