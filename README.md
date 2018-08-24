# simple-jsonsql

**How to install**

    npm i simple-jsonsql

**How to Use**

    const nosqlJson = require('simple-jsonsql)
    const nosql = new nosqlJson() 
    
**_create DataBase_**

    nosql.createDB(() => {
    console.log('Created Database');
    })


**_create Table_**

    nosql.createTable('user',(res) => {
        res.created ? console.log('created table') : 
        console.error(res.error)
    })

**_insert row to table_**

     nosql.insertInto('users', ['name', 'email', 'age'],  
        ['arul', 'arulgetsolute@gmail.com', 28], function (data) {
         res.inserted ? console.log('created table') : 
         console.error(res.error)
     })


