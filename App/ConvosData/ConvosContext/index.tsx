import React from 'react';
import {ConvoMetadata} from '../ConvosManager'

const dummyNavToNewRouteFunc = (newRoute: string)=>{}

/**
 * Parent component who is the state holder should set all this.
 * You'll run into problems if children call the context before the
 * parent has set it, thought that shouldn't happen if you set the 
 * values in JSX
 * 
 * You shouldn't change any of these once they're set in the beginning.
 * Just call setAllConvosMetata to update it. If you do something else,
 * you'll have components that don't re-render when they should.
 */
const ConvosContext = React.createContext({
    allConvosMetadata: [] as ConvoMetadata[],
    addSingleConvoMetadata: (singleMetadata: ConvoMetadata)=>{},
    requestFetchSingleConvoStatus: (convoId: string)=>{},
    convoToNavTo: '',
    approveSingleConvo: (myPhoneNumber: string, convoId: string)=>{}
})

export default ConvosContext;