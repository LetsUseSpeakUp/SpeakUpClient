import * as Contacts from 'react-native-contacts';
import React, { useState, useEffect } from 'react'
import { isAppleTestAccount } from '../../../AuthLogic'
import { getContactsOnSpeakup } from '../../../Services/ServerInterface'

export type SimplifiedContact = {
    phoneNumber: string,
    firstName: string,
    lastName: string
}

export async function fetchContactData(){
    const isTestAccount = await isAppleTestAccount();
    if(isTestAccount){
        return fetchAppleTestAccountData();
    }
    else{
        return fetchRealContactData();
    }
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

    return [firstContact, secondContact];
}

async function fetchRealContactData() {
    let fetchedContacts = await Contacts.getAll();
    fetchedContacts = fetchedContacts.filter(contact => contact.phoneNumbers.length > 0);
    fetchedContacts.sort((a, b) => {
        const name1 = a.familyName || a.givenName;
        const name2 = b.familyName || b.givenName;
        return name1.toUpperCase().localeCompare(name2.toUpperCase());
    })
    const simplifiedContacts = fetchedContacts.map((contact) => {
        const simplifiedContact: SimplifiedContact = {
            phoneNumber: convertPhoneNumberToSpeakupFormat(contact.phoneNumbers[0].number),
            firstName: contact.givenName,
            lastName: contact.familyName
        };
        return simplifiedContact;
    });
    const filteredContacts = await getContactsOnSpeakup(simplifiedContacts);
    return convertToSectionListData(filteredContacts);
}

function convertToSectionListData(contactData: SimplifiedContact[]): any {
    let sectionListData: Array<{ title: string, data: SimplifiedContact[] }> = [];

    const getSortingCharacter = (contact: SimplifiedContact) => {
        if (contact.lastName.length === 0) {
            return contact.firstName[0].toUpperCase();
        }
        else {
            return contact.lastName[0].toUpperCase();
        }
    }

    const addContactToSectionListData = (contact: SimplifiedContact) => {
        const sortingCharacter = getSortingCharacter(contact);
        const indexToInsert: number = sectionListData.findIndex((singleData) => singleData.title === sortingCharacter)
        if (indexToInsert === -1) {
            sectionListData.push({ title: sortingCharacter, data: [contact] });
        }
        else {
            sectionListData[indexToInsert].data.push(contact);
        }
    }

    contactData.forEach((contact: SimplifiedContact) => {
        if (contact.phoneNumber == null) return;
        if (contact.lastName.length === 0 && contact.firstName.length === 0) return;

        contact.phoneNumber = convertPhoneNumberToSpeakupFormat(contact.phoneNumber);
        addContactToSectionListData(contact);
    })

    sectionListData = sectionListData.sort((a, b) => {
        return a.title.localeCompare(b.title);
    })
    return sectionListData;
}

const convertPhoneNumberToSpeakupFormat = (rawPhoneNumber: string): string => {
    if (rawPhoneNumber.length < 2) return '';
    if (rawPhoneNumber.substring(0, 2) !== '+1') {
        rawPhoneNumber = '1' + rawPhoneNumber;
    }
    let convertedNumber = '';
    for (let i = 0; i < rawPhoneNumber.length; i++) {
        if (rawPhoneNumber[i].match(/^\d+/)) convertedNumber += (rawPhoneNumber[i]);
    }

    convertedNumber = '+' + convertedNumber;
    return convertedNumber;
}

export const requestContacts = Contacts.requestPermission();