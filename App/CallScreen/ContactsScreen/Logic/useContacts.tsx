import * as Contacts from 'react-native-contacts';
import React, {useState, useEffect} from 'react'
import {isAppleTestAccount} from '../../../AuthLogic'
import {getContactsOnSpeakup} from '../../../Services/ServerInterface'

export type SimplifiedContact = {
    phoneNumber: string,
    firstName: string,
    lastName: string
}

export function useContactData(){
    const [isLoading, setIsLoading] = useState(true);
    const [contactData, setContactData] = useState([]);

    React.useEffect(()=>{
        isAppleTestAccount().then((isTestAccount)=>{
            if(isTestAccount){
                fetchAppleTestAccountData();
            }
            else{
                fetchContactData();
            }
        })        
    }, [])    

    function fetchContactData(){
        setIsLoading(true);
        return Contacts.getAll().then(fetchedContacts=>{
            fetchedContacts = fetchedContacts.filter(contact => contact.phoneNumbers.length > 0);
            fetchedContacts.sort((a, b) => {
                const name1 = a.familyName || a.givenName;
                const name2 = b.familyName || b.givenName;
                return name1.toUpperCase().localeCompare(name2.toUpperCase());
            })
            console.log("ContactsLogic.js::received contacts data. Now updating");            
            return fetchedContacts.map((contact)=>{
                const simplifiedContact: SimplifiedContact = {
                    phoneNumber: contact.phoneNumbers[0].number,
                    firstName: contact.givenName,
                    lastName: contact.familyName
                };
                return simplifiedContact;
            });
            
        }).then((userPhoneContacts: SimplifiedContact[])=>{
            return getContactsOnSpeakup(userPhoneContacts);
        }).then((finalizedContacts: SimplifiedContact[])=>{
            setContactData(convertToSectionListData(finalizedContacts));
            setIsLoading(false);
        }).catch(()=>{        
            console.log("ContactsLogic::Phone didn't allow contacts") 
            //TODO: Set contactData to an error state and handle that on caller. Just using length == 0 is fine for now though
        })
    }

    async function fetchAppleTestAccountData(){
        const firstContact: SimplifiedContact = {            
            lastName: '00001',
            firstName: 'Apple',
            phoneNumber: '+100001'            
        }

        const secondContact: SimplifiedContact = {            
            lastName: '00002',
            firstName: 'Apple',
            phoneNumber: '+100002',            
          }          

          setContactData(convertToSectionListData([firstContact, secondContact]));
          setIsLoading(false);
    }

    return {isLoading: isLoading, contactData: contactData};
}

function convertToSectionListData(contactData: SimplifiedContact[]): any{
    let sectionListData: Array<{title: string, data: SimplifiedContact[]}>= [];

    const getSortingCharacter = (contact: SimplifiedContact)=>{
        if(contact.lastName.length === 0){
            return contact.firstName[0].toUpperCase();
        }
        else{
            return contact.lastName[0].toUpperCase();
        }
    }    

    const addContactToSectionListData = (contact: SimplifiedContact)=>{
        const sortingCharacter = getSortingCharacter(contact);
        const indexToInsert: number = sectionListData.findIndex((singleData)=>singleData.title === sortingCharacter)
        if(indexToInsert === -1){
            sectionListData.push({title: sortingCharacter, data: [contact]});
        }
        else{
            sectionListData[indexToInsert].data.push(contact);
        }
    }    

    contactData.forEach((contact: SimplifiedContact)=>{
        if(contact.phoneNumber == null) return;
        if(contact.lastName.length === 0 && contact.firstName.length === 0) return;
        
        contact.phoneNumber = convertPhoneNumberToSpeakupFormat(contact.phoneNumber);
        addContactToSectionListData(contact);
    })

    sectionListData = sectionListData.sort((a, b)=>{
        return a.title.localeCompare(b.title);
    })
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