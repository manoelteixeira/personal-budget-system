const {assert, expect} = require('chai');
const request = require('supertest');

const Database = require('../src/database/database');
const dbPath = "./src/database/database.json";
const app = require('../app.js');
const { response } = require('express');

const {
    checkFileExists,
    loadData,   
    deleteDatabase
} = require('../src/utils/utils');


after(function(){
    // console.log(dbTest.envelopes);
    deleteDatabase(dbPath);
});

describe('System Test', function(){
    const dbTest = new Database(dbPath);
    
    describe('Database', () => {
            
        it('It create an empty database', () => {
            assert(checkFileExists(dbPath), 'database not found');
            assert.equal(dbTest.envelopes.length, 0, 'Database is not empty');
        });
    
        it('It add envelope', () =>{
            const label = 'Gas';
            const value = 200;
            const envelope = dbTest.addEnvelope(label, value);
            assert.equal(envelope.label, label, 'Returned label does not match.');
            assert.equal(envelope.value, value, 'Returned value does not match.');
            const actualData = loadData(dbPath);
            assert.equal(actualData.length, dbTest.envelopes.length, 'Number of stored envelopes does not match');
            assert.equal(actualData[0].id, envelope.id, 'Stores Id does not match with returned Id');
            assert.equal(actualData[0].label, envelope.label, 'Stores Label does not match with returned Label');
            assert.equal(actualData[0].value, envelope.value, 'Stores Value does not match with returned Value');
        });
    
        it('It retrieve envelope by id', () => {
            const label = 'Rent';
            const value = 2000;
            const envelope = dbTest.addEnvelope(label, value);
            const actualEnvelope = dbTest.getEnvelope(envelope.id);
            assert.equal(actualEnvelope.id, envelope.id, 'Retrived Id does not match.');
            assert.equal(actualEnvelope.label, envelope.label, 'Retrived Label does not match.');
            assert.equal(actualEnvelope.value, envelope.value, 'Retrived Value does not match.');
        });
    
        it('It returns null when trying to retrieve an invalid envelope', () =>{
            const id = 1000;
            
            expect(dbTest.getEnvelope(id)).to.be.null;
        });
    
        it('It retrieve all envelopes', () => {
            const envelopes = dbTest.getEnvelope();
            const actualEnvelopes = loadData(dbPath);
            expect(envelopes).to.have.same.deep.members(actualEnvelopes); // compare objects on the array
        });
    
        it('It throws an error when trying to update an invalid envelope', () => {
            const id = 1000;
            const value = 200;
            expect(() => {dbTest.updateEnvelope(id, value)}).to.throw('Invalid envelope.');
        });
    
        it('It update envelope value', () => {
            const label = 'Utilities';
            const value = 200;
            const envelope = dbTest.addEnvelope(label, value);
            const newValue = 2000;
            const updatedEnvelope = dbTest.updateEnvelope(envelope.id, newValue);
            const actualEnvelope = dbTest.getEnvelope(envelope.id);
            assert.equal(actualEnvelope.id, envelope.id, 'Envelope Id does not match');
            assert.equal(actualEnvelope.label, envelope.label, 'Envelope Label dos not match');
            assert.equal(actualEnvelope.value, newValue, 'Envelope Value was not changed');
            assert.deepEqual(actualEnvelope, updatedEnvelope, 'Updated envelope does not match with returned envelope');
        });
    
        it('It delete an envelope by label', () =>{
            const label = 'Food';
            const value = 250;
            const envelope = dbTest.addEnvelope(label, value);
            const lenght = dbTest.envelopes.length;
            const removedEnvelope = dbTest.removeEnvelope(envelope.id);
            const currentLength = dbTest.envelopes.length;
            expect(removedEnvelope).to.be.deep.equal(envelope);
            expect(currentLength).to.be.lessThan(lenght);
            expect(dbTest.getEnvelope(label)).to.be.null;
        });
        
        it('It return null when trying to remove an invalid envelope', () =>{
            const label = 'Food';
            expect(dbTest.removeEnvelope(label)).to.be.null;
        });
        
    });
    
    
    describe('Budget System API', () =>{
        
        describe('POST', () => {
            it('It sends an HTTP error 400 when a request without data is received', function(done) {
                request(app)
                    .post('/envelopes')
                    .send('')
                    .expect(400, done);
            });
    
            it('It sends an HTTP error 400 when value is not a number', function(done){
                const data = {
                    "label": "Vacation",
                    "value": "500"
                };
                request(app)
                    .post('/envelopes')
                    .send(data)
                    .expect(400, done);
            });
    
            it('It Saves the envelope to the database', function(done) {
                const data = {
                    "label": "Vacation",
                    "value": 5000
                };
                request(app)
                    .post('/envelopes')
                    .send(data)
                    .expect(201)
                    .then(response => {
                        assert.equal(response.body.label, data.label);
                        assert.equal(response.body.value, data.value);
                        done();
                        
                    })
                    .catch(err => done(err));
            });
    
            it('It Update envelope', function(done) {
                const envelope = loadData(dbPath)[0];
                const data = {
                    "value": 2000
                };
                
                request(app)
                    .post(`/envelopes/update/${envelope.id}`)
                    .send(data)
                    .expect(200)
                    .then(response => {
                        assert.equal(response.body.id, envelope.id);
                        assert.equal(response.body.label, envelope.label);
                        assert.equal(response.body.value, data.value);
                        done();
                    })
                    .catch(err => done(err));
            });
    
            it('It send HTTP error 404 when trying to update an invalid envelope', function(done) {
                const id = 50000;
                const data = {
                    "value": 400
                };
                request(app)
                    .post(`/envelopes/${id}`)
                    .send(data)
                    .expect(404, done);
            });
    
            it('It transfer funds between envelopes', function(done) {
                const data1 = {
                    "label": "Savings",
                    "value": 500
                };

                const data2 = {
                    "label": "Party",
                    "value": 500
                };
                
                request(app)
                    .post('/envelopes')
                    .send(data1)
                    .expect(201)
                    .then(response => {
                        const fromEnvelope = response.body;
                        request(app)
                        .post('/envelopes')
                        .send(data2)
                        .expect(201)
                        .then(response => {
                            const toEnvelope = response.body;
                            const value = 100;
                            request(app)
                                .post(`/envelopes/transfer/${fromEnvelope.id}/${toEnvelope.id}`)
                                .send({"value": value})
                                .expect(200)
                                .then(response => {
                                    const fromResponse = response.body.from;
                                    const toResponse = response.body.to;
                                    const fromValue = fromResponse.value - value;
                                    const toValue = toResponse.value + value;
                                    assert(fromValue, fromEnvelope.value);
                                    assert(toValue, toEnvelope.value);
                                    done();
                                });
                            });
                        });
                
            });

            it('It sendes HTTP error 403 when trying to transfer funds between envelopes whitout the nescessary funds', function(done) {
                const data1 = {
                    "label": "Savings 1",
                    "value": 500
                };

                const data2 = {
                    "label": "Party 1",
                    "value": 500
                };
                
                request(app)
                    .post('/envelopes')
                    .send(data1)
                    .expect(201)
                    .then(response => {
                        const fromEnvelope = response.body;
                        request(app)
                        .post('/envelopes')
                        .send(data2)
                        .expect(201)
                        .then(response => {
                            const toEnvelope = response.body;
                            const value = 600;
                            request(app)
                                .post(`/envelopes/transfer/${fromEnvelope.id}/${toEnvelope.id}`)
                                .send({"value": value})
                                .expect(403, done); 
                            });
                        });
                
            });
            
    
        });
    
        describe('GET', () => {
            it('It retrive a specific envelope', function(done) {
                const envelope = loadData(dbPath)[0];
                request(app)
                    .get(`/envelopes/${envelope.id}`)
                    .expect(200)
                    .then(response => {
                        assert.deepEqual(response.body, envelope);
                        done();
                    })
                    .catch(err => done(err));
            });

            it('It return HTTP error 404 when trying to retrive an invalid specific envelope', function(done) {
                const id = 50000;
                request(app)
                    .get(`/envelopes/${id}`)
                    .expect(404, done);
            });

            it('It retrive all saved envelopes', () =>{
                request(app)
                    .get('/envelopes')
                    .expect(200)
                    .then(response => {
                        assert.deepEqual(response.body, dbTest.envelopes);
                        done();
                    })
                    .catch(err => done(err));
            });
        });
    
        
        describe('DELETE', () => {
            it("It return HTTP ERROR 404 when trying to delete an invalid envelope", function(done) {
                const id = 50000;
                request(app)
                    .delete(`/envelopes/${id}`)
                    .expect(404, done)
            });

            it('It delete the envelope from the database and return the deleted envelope', function(done) {
                const envelope = loadData(dbPath)[0];
                request(app)
                    .delete(`/envelopes/${envelope.id}`)
                    .expect(200)
                    .then(response => {
                        assert.deepEqual(response.body, envelope);
                        request(app)
                            .get('/envelopes')
                            .expect(200)
                            .then(response => {
                                assert.deepEqual(response.body, dbTest.envelopes);
                                done();
                            });
                        done();
                    });
            });
        });
    
        
    }); 
});

