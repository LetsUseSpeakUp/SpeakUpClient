import * as Contacts from 'react-native-contacts'
import {useState, useEffect} from 'react'

export default function useContacts(){
    const [contacts, setContacts] = useState([]);

    useEffect(()=>{
        Contacts.getAllWithoutPhotos().then((fetchedContacts)=>{
            setContacts(fetchedContacts);
        }).catch((error)=>{
            console.log("useContacts.tsx -- failed to get contacts: ", error)
        })        
    }, [])

    return contacts;
}