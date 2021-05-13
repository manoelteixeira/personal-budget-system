// ./src/utils/database.js

const fs = require('fs');



function loadDatabase(path){
    try{
        const data = fs.readFileSync(path, 'utf-8');
        const database = JSON.parse (data);
        return database;
    } catch (error){
        try{
            console.log('Database Not Found ... Creating new Database');
            const newDatabase = [];
            fs.writeFileSync(path, JSON.stringify(newDatabase));
            return newDatabase;
        }catch (error){
            console.log(`Error creating Database: ${error}`);
        }
    }
};


class Database {
    constructor(databasePath = './database.json'){
        this.databasePath = databasePath;
        this.envelopes = loadDatabase(this.databasePath);
        this.size = this.envelopes.length;
    }
    
    _saveData(){
        fs.writeFileSync(this.databasePath, JSON.stringify(this.envelopes));
    }

    _getIndex(id){
        return this.envelopes.findIndex(envelope => envelope.id === id);
    }

    _getNewId(){
        let id = Math.floor(Math.random() * 10000 + 1);
        while(this._getIndex(id) >= 0){
            id = Math.floor(Math.random() * 1000 + 1);
        }
        return id;
    }

    getEnvelope(id = null){
        if(id){
            const index = this._getIndex(id);
            if(index >= 0){
                return this.envelopes[index];
            }else{
                return null;
            }
        }else{
            return this.envelopes;
        }
    }

    addEnvelope(label, value = 0){
        if((typeof label === 'string') && (typeof value === 'number')){
            const id = this._getNewId();
            const envelope = {
                "id": id,
                "label": label,
                "value": value
            };
            this.envelopes.push(envelope);
            this._saveData();
            return envelope;
        }else{
            return null;
        }
    }

    updateEnvelope(id, newValue){
        const index = this._getIndex(id);
        if(index < 0){
            throw new Error('Invalid envelope.');
        }
        this.envelopes[index].value = newValue;
        this._saveData();
        return this.envelopes[index]; 
    }
    
    removeEnvelope(id){
        const index = this._getIndex(id);
        if(index != -1){
            const envelope = this.envelopes[index];
            this.envelopes.splice(index,1);
            this._saveData();
            return envelope;
        }else{
            return null;
        }
    }
}

module.exports =  Database;
