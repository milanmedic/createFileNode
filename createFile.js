'use strict'

const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync
const [,,input] = process.argv

function createFile(input){
    input = input.split('/') // split by / to find out in how many folders our file has to be nested
    if(input.length > 1){
         // check that everything before the last is a folder, path.extname() will give a '' if a folder
        for(let i = 0; i < input.length - 1; i++){
            if(path.extname(input[i]) != ''){
                throw new Error('The specified filepath is incorrect. Check if the path before the filename contains file extensions.')
            }
        }
        // everything before the last is a folder
        // Create folders
        let folderPath = input.slice(0, input.length-1).join('/')
        fs.mkdirSync(folderPath, { recursive: true }, (err) => {
            if (err) throw err;
        });
        // create the file in path
        //     2. Go to 1a
        let fileName = input[input.length-1]
        createActualFile(folderPath, fileName)

    } else {
        createActualFile('', input[0])
    }
}

function createActualFile(folderPath, fileName){
    //does file exist?
    fs.access(`${folderPath}/${fileName}`, fs.constants.F_OK, (err) => {
        if(err) {
            execSync(`cd ${folderPath} && touch ${fileName}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            //does file contain a .py || .js extension, if so open it in VSCode
            if(path.extname(fileName) == '.py' || path.extname(fileName) == '.js'){
                execSync(`code ${folderPath}/${fileName}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });  
            }
        } else {
            console.error('The file you\'re trying to create already exists.')
            return
        }
    })
}

createFile(input)