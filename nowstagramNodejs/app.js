/**
 * Created by pony on 16-10-14.
 */
const express=require('express');
const mysql=require('mysql');


function getConnect() {
    var connection=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'021414',
        database:'test'
    });
// 正式连接数据库
    connection.connect(function (err) {
        if(err){
            console.error('error connecting: '+err.stack);
        }
        console.log('connection as id '+connection.threadId);
    });
    return connection;
}

function getDataFromDB(sql,res,func){
    var connect=getConnect();
    connect.query(sql,function (err, values) {
        if(err) throw err;
        if(values){
            var backData=values;

        }
        func(res,backData);
    });
}

var app=express();
var router=express.Router();

// get a user from by a id
// router.get('/user/:id',function (req,res, next) {
//     var id=req.params.id;
//     var sql='select * from `user` where `id`='+id;
//     var data_back={stat:'ok'};
//     var connection=getConnect();
//     connection.query(sql,function (err, values) {
//         var msg=[];
//         var user={};
//         user.id=values[0].id;
//         user.username=values[0].username;
//         user.head_url=values[0].head_url;
//         msg.push(user);
//         data_back.users=msg;
//         res.send(data_back);
//     });
//     connection.end();
// });

//用嵌套函数完成
router.get('/user/:id',function (req, res) {
    var id=req.params.id;
    var sql='select * from `user` where `id`='+id;
    function response(res,data) {
        var data_back={};
        var msg=[];
        var user={};
        user.id=data[0].id;
        user.username=data[0].username;
        user.head_url=data[0].head_url;
        msg.push(user);
        data_back.users=msg;
        res.send(data_back)

    }
    getDataFromDB(sql,res,response);

});

// get all users
router.get('/users/users',function (req, res, next) {
    var sql='select * from `user`';
    var data_back={stat:'ok'};
    var connection=getConnect();
    connection.query(sql,function (err, values) {
        var users=[];
        for(var i=0;i<values.length;i++){
            var user={};
            user.id=values[i].id;
            user.username=values[i].username;
            user.head_url=values[i].head_url;
            users.push(user);
        }
        data_back.users=users;
        res.send(data_back);
    });
});

app.use('/api',router);

app.get('/',function (req, res) {
    res.send('hello')
});

app.listen(3000,function () {
    console.log('server running at port 3000');
});

