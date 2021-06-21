var http = require('http');
var express = require('express');
var fs=require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
const e = require('express');

var user;
var stuuser;
var app=express();
var con = mysql.createConnection({
    host: "remotemysql.com",
    user: "qkrDiWFddw",
    password: "sihGVooIPe",
    database: "qkrDiWFddw"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    });


app.get('/',function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    var readstream=fs.createReadStream('./index.html','utf8');
    readstream.pipe(res);
});
app.get('/teacher',function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    var readstream=fs.createReadStream('./teacher.html','utf8');
    readstream.pipe(res);
});
app.get('/student',function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    var readstream=fs.createReadStream('./student.html','utf8');
    readstream.pipe(res);
});
app.post('/studentlog', urlencodedParser, function (req, res){
    flag=0
    uname = req.body.uname;
    stuuser = req.body.uname;
    psw=req.body.psw;
    var sql =" select password from UserDetails where srn='"+uname+"'";
    con.query(sql, function (err,res,fields) {
        if (err) throw err;
        if(psw===res[0].password)
        {
            flag=1;
            //console.log("set flag");
        }
        //console.log(flag);
    })
    setTimeout(()=>{
        if(flag==1)
    {
        res.writeHead(200,{'Content-Type':'text/html'});
        var readstream=fs.createReadStream('./studentportal.html','utf8');
        readstream.pipe(res);
        //console.log(flag);
    }
    else{
        res.writeHead(200,{'Content-Type':'text/html'});
        var readstream=fs.createReadStream('./unsuccesss.html','utf8');
        readstream.pipe(res);
        //console.log(flag);
    }
    },1000);
});
app.post('/teacherlog', urlencodedParser, function (req, res){
    flag=0
    uname = req.body.uname;
    user = req.body.uname;
    user = req.body.uname;
    fs.writeFileSync('teachuser.txt',user);
    psw=req.body.psw;
    var sql =" select password from UserDetails where srn='"+uname+"'";
    con.query(sql, function (err,res,fields) {
        if (err) throw err;
        if(psw===res[0].password)
        {
            flag=1;
            //console.log("set flag");
        }
        //console.log(flag);
    })
    setTimeout(()=>{
        if(flag==1)
    {
        res.writeHead(200,{'Content-Type':'text/html'});
        var readstream=fs.createReadStream('./teacherportal.html','utf8');
        readstream.pipe(res);
        //console.log(flag);
    }
    else{
        res.writeHead(200,{'Content-Type':'text/html'});
        var readstream=fs.createReadStream('./unsuccesss.html','utf8');
        readstream.pipe(res);
        //console.log(flag);
    }
    },2000);
});
app.post('/getdet', urlencodedParser, function (req, res){
    flag=0
    key = req.body.key;
    email = req.body.email;
    resp="";
    var sql =" select name from attendence where keycode='"+key+"'";
    con.query(sql, function (err,res,fields) {

        if (err) throw err;
        else
        {
            fs.writeFileSync('tempdatastore.txt',"");
            for(i=0;i<res.length;i++)
            {
                fs.appendFile("tempdatastore.txt", res[i].name+",", (err) => {
                    if (err) throw e;
                });
            }
            // var respo = fs.readFileSync("tempdatastore.txt", "utf8")
            // //console.log(respo);

            setTimeout(() => {
                var respo = fs.readFileSync("tempdatastore.txt", "utf8")
                // //console.log(respo);
                var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'techie4knowledge@gmail.com',
                  pass: 'technology@4'
                }
              });
              var datetime = new Date();
              var mailOptions = {
                from: 'techie4knowledge@gmail.com',
                to: email,
                subject: 'Attendence for '+key,
                text: respo+","+datetime
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  //console.log(error);
                } else {
                  //console.log('Email sent: ' + info.response);
                }
              });
            }, 2000);
            
        }
    })
    res.send("<h4>Attendees Email Sent</h4>");
});
app.post('/sregistration', urlencodedParser, function (req, res){
    stuname = req.body.stuname;
    stuuser=stuname;
    // fs.writeFileSync('stuuser.txt',stuuser);
    university= req.body.university;
    srn= req.body.srn;
    psw=req.body.psw;
    res.writeHead(200,{'Content-Type':'text/html'});
    var readstream=fs.createReadStream('./index.html','utf8');
    readstream.pipe(res);
    //console.log(stuname,university,srn,psw);
    var sql =" insert into UserDetails (name,university,srn,password) values('"+stuname+"',"+"'"+university+"','"+srn+"','"+psw+"')";
        //console.log(sql);
        con.query(sql, function (err,res,fields) {
            if (err) throw err;
            //console.log("Inserted");
        });

});
app.post('/tregistration', urlencodedParser, function (req, res){
    tecname = req.body.tecname;
    university= req.body.university;
    srn= req.body.srn;
    psw=req.body.psw;
    var sql =" insert into UserDetails (name,university,srn,password) values('"+tecname+"',"+"'"+university+"','"+srn+"','"+psw+"')";
        //console.log(sql);
        con.query(sql, function (err,res,fields) {
            if (err) throw err;
            //console.log("Inserted");
        });
    
    res.writeHead(200,{'Content-Type':'text/html'});
    var readstream=fs.createReadStream('./index.html','utf8');
    readstream.pipe(res);
});
app.post('/genkey', urlencodedParser, function (req, res){
    var a=randomstring.generate(5);
    var sql =" insert into keygen (name,keycode,active) values('"+user+"',"+"'"+a+"',1)";
    //console.log(sql);
    con.query(sql, function (err,res,fields) {
        if (err) throw err;
        //console.log("Inserted");
    });
    var rr = "<style>h1{text-align:center;}</style><h1 center> Key Generated : "+a+".</h1>";
    setTimeout(()=>{
                fs.writeFileSync('OP.html',rr);
                res.writeHead(200,{'Content-Type':'text/html'});
                var readstream=fs.createReadStream('./OP.html','utf8');
                readstream.pipe(res);
                },1000);
});
app.post('/getattend', urlencodedParser, function (req, res){
    var code = req.body.key;
    var sql =" select active from keygen where keycode='"+code+"'";
    var rr;
    con.query(sql, function (err,res,fields) {
        if (err) throw err;
        if(res[0].active==1)
        {
            // res1 = fs.readFileSync('stuuser.txt','utf8')
            sql =" insert into attendence (name,keycode) values('"+stuuser+"',"+"'"+code+"')";
            //console.log(sql);
            con.query(sql, function (err,res,fields) {
                if (err) throw err;
            });
            rr = "<style>h1{text-align:center;}</style><h1 center> Attendence Marked</h1>";
            
        }
    });
    setTimeout(()=>{
        fs.writeFileSync('OP.html',rr);
        res.writeHead(200,{'Content-Type':'text/html'});
        var readstream=fs.createReadStream('./OP.html','utf8');
        readstream.pipe(res);
        },1000);
});
const port=process.env.PORT || 3000
app.listen(port);
