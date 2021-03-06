import React from 'react';
import {ConvoMetadata, ConvoStatus} from '../ServerInterface'

const dummyNavToNewRouteFunc = (newRoute: string)=>{}

/**
 * Parent component who is the state holder should set all this.
 * You'll run into problems if children call the context before the
 * parent has set it, though that shouldn't happen if you set the 
 * values in JSX
 * 
 * You shouldn't change any of these once they're set in the beginning.
 * Just call setAllConvosMetata to update it. If you do something else,
 * you'll have components that don't re-render when they should.
 */
const ConvosContext = React.createContext({
    allConvosMetadata: [] as ConvoMetadata[],
    addSingleConvoMetadata: (singleMetadata: ConvoMetadata)=>{},
    updateSingleConvoMetadataWithFetched: (singleMetadata: ConvoMetadata)=>{},
    myPhoneNumber: '',
    convoToNavTo: '',
    approveOrDenySingleConvo: (approveOrDeny: boolean, convoId: string)=>{},
    clearConvoToNavTo: ()=>{}
})

export default ConvosContext;