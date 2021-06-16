import * as Contacts from 'react-native-contacts';
import React, {useState, useEffect} from 'react'

/**
 * 
 * @returns Contact data from iOS/Android
 * This will probably have errors on Web ?
 */
export function useContactData(){
    const [contactData, setContactData] = useState([]);

    React.useEffect(()=>{
        fetchContactData();
    }, [])    

    function fetchContactData(){
        Contacts.getAll().then(fetchedContacts=>{
            fetchedContacts = fetchedContacts.filter(contact => contact.phoneNumbers.length > 0);
            fetchedContacts.sort((a, b) => {
                const name1 = a.familyName || a.givenName;
                const name2 = b.familyName || b.givenName;
                return name1.localeCompare(name2);
            })
            console.log("ContactsLogic.js::received contacts data. Now updating");            
            setContactData(convertToSectionListData(fetchedContacts));
        }).catch(()=>{        
            console.log("ContactsLogic::Phone didn't allow contacts") 
            //TODO: Set contactData to an error state and handle that on caller. Just using length == 0 is fine for now though
        })
    }

    return contactData;
}

function convertToSectionListData(contactData: any): any{
    const sectionListData= [];
    for(let currentLetterIndex = 0; currentLetterIndex < 26; currentLetterIndex++){
        const curLetter = String.fromCharCode(currentLetterIndex + 65);
        const curLetterData: any = [];
        contactData.forEach((contact: any)=>{
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
    return sectionListData;
}

export const requestContacts = Contacts.requestPermission();