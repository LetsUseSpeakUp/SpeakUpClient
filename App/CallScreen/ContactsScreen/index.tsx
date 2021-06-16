import * as React from 'react';

import EmptyContactScreen from './EmptyContactScreen'
import {useContactData, requestContacts} from './Logic/useContacts'
import {Text, View, SectionList, StyleSheet, TouchableOpacity} from 'react-native';

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

function ContactsFlatList({contactsData} : {contactsData: Array<any>}){
    const sectionListData = [];
    for(let currentLetterIndex = 0; currentLetterIndex < 26; currentLetterIndex++){
        const curLetter = String.fromCharCode(currentLetterIndex + 65);
        const curLetterData: any = [];
        contactsData.forEach((contact: any)=>{
            const lastName: string = contact.familyName;
            if(lastName.length === 0){
                const firstName = contact.givenName;
                if(firstName.length > 0 && firstName[0].toUpperCase() === curLetter){
                    curLetterData.push(contact);
                }
            }
            else{
                if(lastName[0].toUpperCase() === curLetter){
                    curLetterData.push(contact);
                }
            }
            
        })
        sectionListData.push({title: curLetter, data: curLetterData});
    }


    return(
        <SectionList 
            sections={sectionListData}
            keyExtractor={(item, index)=> index+ item}
            renderSectionHeader={({section})=>{
                return <Text>{section.title}</Text>
            }}
            renderItem ={({item})=> <SingleContactItem contact={item}/>}
        />
    )
}

function SingleContactItem({contact}: {contact: any}){
    return(
        <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>                
                {`${contact.givenName} ${contact.familyName}`}
            </Text>
        </TouchableOpacity>
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