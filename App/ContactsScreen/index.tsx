import React from 'react'
import { View, Text } from 'react-native'
import useContacts from './Logic/useContacts'

export default function ContactsScreen() {
  const contacts = useContacts();
  console.log("ContactsScreen.tsx -- contacts size: ", contacts.length);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Convos!</Text>
    </View>
  );
}