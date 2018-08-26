const mkdirp = require('mkdirp');
const createFile = require('create-file');
const jsonfile = require('jsonfile');

const insertAction = 'insertAction';
const createTableAction = 'createTableAction';
const selectAction = 'selectAction';
const updateAction = 'updateAction';


class jsonQl {

    static generateKey() {
        return Math.random().toString(36).substring(7);
    }

    static isRequired(param, action) {
        throw new Error(` ${param} parameter missing, Unable perform ${action}`);
    };


    /**
     * @description Creates DB folder to store table JSONs
     * @param {Function} callback
     */
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

    /**
     * @description Creates new table json
     * @param {String} tableName - Table name
     * @param {Array} columns - Array of columns along with type
     * @param {Function} callback
     */
    createTable(tableName = this.constructor.isRequired('table name', createTableAction), columns = this.constructor.isRequired('columns', createTableAction), callback) {
        mkdirp(`DB/${tableName}`, function (err) {
            if (tableName && columns) {
                if (err) callback(err);
                else {
                    let content = {items: {}, columnsInfo: {}};
                    columns.forEach(column => {
                        content.columnsInfo[column.split(' ')[0]] = column.split(' ')[1]
                    });
                    createFile(`DB/${tableName}/index.json`, JSON.stringify(content), function () {
                        callback({created: true})
                    })
                }
            } else {
                callback({error: 'Parameters invalid'})
            }
        })
    }

    /**
     * @description Insert data into table
     * @param {String} tableName - Table name
     * @param {Array} columns - Array of columns names
     * @param {Array} values - Array of values
     * @param {Function} callback
     */
    insertInto(tableName = this.constructor.isRequired('table name', insertAction), columns = this.constructor.isRequired('columns', insertAction), values = this.constructor.isRequired('values', insertAction), callback) {
        let error = null;
        columns.length === values.length ?
            jsonfile.readFile(`DB/${tableName}/index.json`, (err, obj) => {
                if (err) {
                    callback({error: err})
                } else {
                    if (columns.map(column => {
                        return obj.columnsInfo.hasOwnProperty(column)
                    }).includes(false)) {
                        callback({error: 'Columns name error'})
                    } else {
                        if (JSON.stringify(Object.keys(obj.columnsInfo)) === JSON.stringify(columns)) {
                            if (values.map((value, i) => {
                                return typeof(value) === Object.values(obj.columnsInfo)[i]
                            }).includes(false)) {
                                callback({error: 'Invalid value Type'})
                            } else {
                                jsonfile.readFile(`DB/${tableName}/index.json`, (err, obj) => {
                                    let newTableData = {...obj};
                                    const uniqueKey = this.constructor.generateKey();
                                    newTableData.items[uniqueKey] = {};
                                    columns.forEach((column, index) => {
                                        newTableData.items[uniqueKey][column] = values[index]
                                    });
                                    jsonfile.writeFile(`DB/${tableName}/index.json`, newTableData, {}, () => {
                                        callback({error: null, inserted: true})
                                    })
                                })
                            }
                        } else {
                            callback({error: 'Error:Column order mismatched'})
                        }
                    }
                }
            }) :
            callback({error: 'columns and values are mis matching'})
    }


    /**
     * @description Read table data
     * @param {String} tableName - Table name
     * @param {Array|string} columns - Array of columns names || * to fetch all columns
     * @param {Function} callback
     */
    selectItem(tableName = this.constructor.isRequired('table name', selectAction), columns = this.constructor.isRequired('columns', selectAction), callback) {
        jsonfile.readFile(`DB/${tableName}/index.json`, (err, obj) => {
            let new_obj = {...obj}
            if (columns === '*') {
                callback({data: obj.items})
            } else {
                let result = {}
                result.data =
                    Object.keys(new_obj.items).map(key => {
                        let selectedRow = {}
                        selectedRow[key] = {}
                        columns.forEach(column => {
                            selectedRow[key][column] = new_obj.items[key][column]
                        })
                        return selectedRow
                    })
                callback(result)
            }
        })
    }
}


module.exports = jsonQl;