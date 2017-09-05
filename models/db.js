"use strict";

const mysql = require('mysql');

const pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'blog'
});



exports.query = function (sql,P,C) {
    let params = [];
    let callback;
    if(arguments.length == 2 && typeof arguments[1] == 'function'){
        callback = P;
    }else if(arguments.length == 3 && Array.isArray(arguments[1]) && typeof arguments[2] == 'function'){
        callback = C;
    }else{
        throw new Error('对不起，参数个数不匹配或者参数不正确');
    }
    pool.getConnection(function(err, connection) {
        // Use the connection 
        connection.query(sql, params,function () {
            // And done with the connection. 
            connection.release();
            callback.apply(null,arguments);

            // Don't use the connection here, it has been returned to the pool. 
        });
    });
};