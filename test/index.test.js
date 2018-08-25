const jsonQl = require('../index');

const nosqlDB = new jsonQl.module();

describe('Test jsonQl class', () => {

    describe('Test create Database', () => {
        it('should return success status when db is created', () => {
            nosqlDB.createDB((data) => {
                expect(data.created).toEqual(true)
            })
        })
    });

    describe('Test create table', () => {
        it('should return success status when table is created', () => {
            nosqlDB.createTable('users', ['name string', 'email string', 'age number'], function (data) {
                expect(data.created).toEqual(true)
            })
        });
        it('should return error status when create table without proper parameter', () => {
            nosqlDB.createTable('', ['name string', 'email string', 'age number'], function (data) {
                expect(data.error).toEqual('Parameters invalid')
            })
        })
    });

    describe('Test insert row in a table', () => {
        it('should return success status when row is inserted', () => {
            nosqlDB.insertInto('users', ['name', 'email', 'age'], ['arul', 'arulgetsolute@gmail.com', 28], function (data) {
                expect(data.inserted).toEqual(true)
            })
        });
        it('should return error status when row is inserted with mismatch column and value', () => {
            nosqlDB.insertInto('users', ['name', 'email', 'age'], ['arulgetsolute@gmail.com', 28], function (data) {
                expect(data.error).toEqual('columns and values are mis matching')
            })
        });

        it('should return error status when row is inserted with invalid column name', () => {
            nosqlDB.insertInto('users', ['name', 'email', 'ages'], ['arul', 'arulgetsolute@gmail.com', 28], function (data) {
                expect(data.error).toEqual('Columns name error')
            })
        });
        it('should return error status when row is inserted with invalid value type', () => {
            nosqlDB.insertInto('users', ['name', 'email', 'age'], [true, 'arulgetsolute@gmail.com', 28], function (data) {
                expect(data.error).toEqual('Invalid value Type')
            })
        });
        it('should return error status when row is inserted with invalid column order', () => {
            nosqlDB.insertInto('users', ['name', 'age', 'email'], [true, 'arulgetsolute@gmail.com', 28], function (data) {
                expect(data.error).toEqual('Error:Column order mismatched')
            })
        })
    })
    describe('Test select operation on table', () => {
        it('should return rows with specific columns of the table when select called with specific columns', () => {
            nosqlDB.selectItem('users', ['age', 'emails'], (data) => {
                expect(data).toEqual({"data": [{"ldmcj": {"age": 28}}, {"m0reti": {"age": 28}}]})
            });
        })
        it('should return rows with all columns of the table when select called with *', () => {
            nosqlDB.selectItem('users', '*', (data) => {
                expect(data).toEqual({
                        "data": {
                            "ldmcj": {"name": "arul", "email": "arulgetsolute@gmail.com", "age": 28},
                            "m0reti": {"name": "arul", "email": "arulgetsolute@gmail.com", "age": 28}
                        }
                    }
                )
            });
        })
    })
});