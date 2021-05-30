import React from 'react';
import {ConvoMetadata} from '../ConvosManager'

const dummyNavToNewRouteFunc = (newRoute: string)=>{}

/**
 * Parent component who is the state holder should set all this.
 * You'll run into problems if children call the context before the
 * parent has set it, thought that shouldn't happen if you set the 
 * values in JSX
 */
const ConvosContext = React.createContext({
    allConvosMetadata: [] as ConvoMetadata[],
    setAllConvosMetadata: ([]: ConvoMetadata[])=>{},
    navToNewRoute: dummyNavToNewRouteFunc,
    addSingleConvoMetadata: (singleMetadata: ConvoMetadata)=>{}
})

export default ConvosContext;