// src/utils/utils.js

const fs = require('fs');

function checkFileExists (path) {
    try{
        fs.accessSync(path, fs.constants.F_OK | fs.constants.W_OK);
        //console.log('File Exist')
        return true;
    }catch(err){
        //console.log('File do Not Exist')
        return false;
    }
};

function clearDatabase(path){
    if(checkFileExists(path)){
        fs.writeFileSync(path, JSON.stringify([]));
        //console.log('Database cleard.');
    }
}

function loadData(path){
    try{
        const dataFile = fs.readFileSync(path, 'utf-8');
        const data = JSON.parse(dataFile);
        return data;
    } catch (error){
        console.log(`Error on Loading Data: ${error}`);
        
    }
};

function deleteDatabase(path){
    try{
        fs.unlinkSync(path);
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    checkFileExists: checkFileExists,
    loadData: loadData,
    clearDatabase: clearDatabase,
    deleteDatabase: deleteDatabase
};

