const mkdirp = require('mkdirp');
const createFile = require('create-file');
const jsonfile = require('jsonfile');

class jsonQl {

    static generateKey() {
        return Math.random().toString(36).substring(7);
    }

    // Creates DB folder to store table JSONs
    createDB(callback) {
        mkdirp(`DB`, function (err) {
            if (err) {
                callback(err)
            }
            else {
                callback({created: true})
            }
        })
    }

    // Creates new table json
    createTable(tableName, columns, callback) {
        mkdirp(`DB/${tableName}`, function (err) {
            if (err) callback(err);
            else {
                let content = {items: {}, columnsInfo: {}};
                columns.forEach(column => {
                    content.columnsInfo[column.split(' ')[0]] = column.split(' ')[1]
                })
                createFile(`DB/${tableName}/index.json`, JSON.stringify(content), function () {
                    callback({created: true})
                })
            }
        })
    }

    // Insert data into table
    insertInto(tableName, columns, values, callback) {
        let error = null;
        columns.length === values.length ?
            jsonfile.readFile(`DB/${tableName}/index.json`, (err, obj) => {
                if (err) {
                    callback({error:err})
                } else {
                    if (columns.map(column => {
                        return obj.columnsInfo.hasOwnProperty(column)
                    }).includes(false)) {
                        callback({error:'Columns name error'})
                    } else {
                        if (JSON.stringify(Object.keys(obj.columnsInfo)) === JSON.stringify(columns)) {
                            if (values.map((value, i) => {
                                return typeof(value) === Object.values(obj.columnsInfo)[i]
                            }).includes(false)) {
                                callback({error: 'invalid value Type'})
                            } else {
                                jsonfile.readFile(`DB/${tableName}/index.json`, (err, obj) => {
                                    let newTableData = {...obj}
                                    const uniqueKey = this.constructor.generateKey()
                                    newTableData.items[uniqueKey] = {};
                                    columns.forEach((column, index) => {
                                        newTableData.items[uniqueKey][column] = values[index]
                                    })
                                    jsonfile.writeFile(`DB/${tableName}/index.json`, newTableData, {}, () => {
                                        callback({error:null, inserted: true})
                                    })
                                })
                            }
                        } else {
                           callback({error:'Error:Column order mismatched'})
                        }
                    }
                }
            }) :
            callback({error:'columns and values are mis matching'})

    }

}


exports.module = jsonQl;

const someApp = new jsonQl();
someApp.createTable('users', ['name string', 'email string', 'age number'], function (data) {
    someApp.insertInto('users', ['name', 'email', 'age'], ['arul', 'arulgetsolute@gmail.com', 28], function (data) {
        console.log(data)
    })
})