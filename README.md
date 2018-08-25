# simple-jsonsql

**How to install**

    npm i simple-jsonsql

**How to Use**

    const nosqlJson = require('simple-jsonsql)
    const nosql = new nosqlJson() 
    
**_Create DataBase_**

    nosql.createDB(() => {
    console.log('Created Database');
    })


**_Create Table_**

    nosql.createTable('user',(res) => {
        res.created ? console.log('created table') : 
        console.error(res.error)
    })

**_Insert row to table_**

     nosql.insertInto('users', ['name', 'email', 'age'],  
        ['arul', 'arulgetsolute@gmail.com', 28], function (data) {
         res.inserted ? console.log('created table') : 
         console.error(res.error)
     })
     
**_Read table_**

      Get all column data
      -------------------
      
             nosql.selectItem('users', '*', (data) => {
                  console.log(JSON.stringify(data))
               });
            
            
      Get all specific column data
      -----------------------------
                  
           nosql.selectItem('users', ['age', 'emails'], (data) => {
               console.log(JSON.stringify(data))
           });

