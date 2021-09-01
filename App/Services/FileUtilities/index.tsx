import FileSystem from 'react-native-fs'

export const getFilePathOfConvo = (convoId: string): string =>{
    const filePath = FileSystem.DocumentDirectoryPath + '/' + convoId + '.aac';
    return filePath;
}