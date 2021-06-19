import * as Contacts from 'react-native-contacts';
import React, {useState, useEffect} from 'react'
import {isAppleTestAccount} from '../../../AuthLogic'

/**
 * 
 * @returns Contact data from iOS/Android
 * This will probably have errors on Web ?
 */
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
            setContactData(convertToSectionListData(fetchedContacts));
            setIsLoading(false);
            //TODO: send to server to filter out the contacts who aren't on Speakup
        }).catch(()=>{        
            console.log("ContactsLogic::Phone didn't allow contacts") 
            //TODO: Set contactData to an error state and handle that on caller. Just using length == 0 is fine for now though
        })
    }

    async function fetchAppleTestAccountData(){ //TODO
        const firstContact: Contacts.Contact = {
            recordID: '6b2237ee0df85980',
            backTitle: '',
            company: '',
            emailAddresses: [],
            familyName: '00001',
            givenName: 'Apple',
            middleName: '',
            jobTitle: '',
            phoneNumbers: [{
              label: 'mobile',
              number: '+100001',
            }],
            hasThumbnail: false,
            thumbnailPath: '',
            postalAddresses: [],
            prefix: '',
            suffix: '',
            department: '',
            birthday: {'year': 1988, 'month': 0, 'day': 1 },
            imAddresses: [], 
            displayName: 'Apple 00001',
            note: ''
        }

        const secondContact: Contacts.Contact = {
            recordID: '6b2237ee0df85981',
            backTitle: '',
            company: '',
            emailAddresses: [],
            familyName: '00002',
            givenName: 'Apple',
            middleName: '',
            jobTitle: '',
            phoneNumbers: [{
              label: 'mobile',
              number: '+100002',
            }],
            hasThumbnail: false,
            thumbnailPath: '',
            postalAddresses: [],
            prefix: '',
            suffix: '',
            department: '',
            birthday: {'year': 1988, 'month': 0, 'day': 1 },
            imAddresses: [], 
            displayName: 'Apple 00001',
            note: ''
          }          
          setContactData(convertToSectionListData([firstContact, secondContact]));
          setIsLoading(false);
    }

    return {isLoading: isLoading, contactData: contactData};
}

function convertToSectionListData(contactData: Contacts.Contact[]): any{
    let sectionListData: Array<{title: string, data: Contacts.Contact[]}>= [];

    const getSortingCharacter = (contact: Contacts.Contact)=>{
        if(contact.familyName.length === 0){
            return contact.givenName[0].toUpperCase();
        }
        else{
            return contact.familyName[0].toUpperCase();
        }
    }    

    const addContactToSectionListData = (contact: Contacts.Contact)=>{
        const sortingCharacter = getSortingCharacter(contact);
        const indexToInsert: number = sectionListData.findIndex((singleData)=>singleData.title === sortingCharacter)
        if(indexToInsert === -1){
            sectionListData.push({title: sortingCharacter, data: [contact]});
        }
        else{
            sectionListData[indexToInsert].data.push(contact);
        }
    }    

    contactData.forEach((contact: Contacts.Contact)=>{
        if(contact.phoneNumbers[0] == null) return;
        if(contact.familyName.length === 0 && contact.givenName.length === 0) return;
        
        contact.phoneNumbers[0].number = convertPhoneNumberToSpeakupFormat(contact.phoneNumbers[0].number);
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