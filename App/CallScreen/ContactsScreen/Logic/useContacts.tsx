import * as Contacts from 'react-native-contacts';
import React, {useState, useEffect} from 'react'

/**
 * 
 * @returns Contact data from iOS/Android
 * This will probably have errors on Web ?
 */
export function useContactData(isAppleTestAccount: boolean){
    const [isLoading, setIsLoading] = useState(true);
    const [contactData, setContactData] = useState([]);

    React.useEffect(()=>{
        if(isAppleTestAccount){
            fetchAppleTestAccountData();
        }
        else{
            fetchContactData();
        }        
    }, [])    

    function fetchContactData(){
        setIsLoading(true);
        Contacts.getAll().then(fetchedContacts=>{
            fetchedContacts = fetchedContacts.filter(contact => contact.phoneNumbers.length > 0);
            fetchedContacts.sort((a, b) => {
                const name1 = a.familyName || a.givenName;
                const name2 = b.familyName || b.givenName;
                return name1.toUpperCase().localeCompare(name2.toUpperCase());
            })
            console.log("ContactsLogic.js::received contacts data. Now updating");            
            setContactData(convertToSectionListData(fetchedContacts));
            setIsLoading(false);
            //TODO: send to server to filter out the contacts who aren't on Speakup
        }).catch(()=>{        
            console.log("ContactsLogic::Phone didn't allow contacts") 
            //TODO: Set contactData to an error state and handle that on caller. Just using length == 0 is fine for now though
        })
    }

    async function fetchAppleTestAccountData(){ //TODO
        // const firstContact: Contacts.Contact = {
            // recordID: '00001',

        // }
        await fetchContactData();
        console.log("useContacts::fetchAppleTestAccountData. 3: ", contactData[3]);
        //TODO
    }

    return {isLoading: isLoading, contactData: contactData};
}

function convertToSectionListData(contactData: Contacts.Contact[]): any{
    const sectionListData= [];
    
    for(let currentLetterIndex = 0; currentLetterIndex < 26; currentLetterIndex++){
        const curLetter = String.fromCharCode(currentLetterIndex + 65);
        const curLetterData: any = [];
        contactData.forEach((contact: any)=>{
            if (contact.phoneNumbers[0] == null) return;
            contact.phoneNumbers[0].number = convertPhoneNumberToSpeakupFormat(contact.phoneNumbers[0].number);
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
        if(curLetterData.length > 0)
            sectionListData.push({title: curLetter, data: curLetterData});
    }
    return sectionListData;
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

export const requestContacts = Contacts.requestPermission();