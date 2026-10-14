const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const userModel = require('./models/user');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');

app.set('view engine', "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.render("index")
});

app.post('/create', (req, res)=>{
    let {username, email,ege, password} = req.body;
  
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, async (err, hash)=>{
            let craetedUser = await userModel.create({
        username,
        email,
        ege,
        password: hash,
        })
        let token = jwt.sign({ email: craetedUser.email}, "sssss");
        res.cookie("token", token);
         res.send(craetedUser);
    })
    })
   
});
app.get('/login', (req,res)=>{
    res.render('login')
});
app.post('/login', async (req, res)=>{
    let user = await userModel.findOne({email: req.body.email});
    if(!user) return res.send("User Not Found");
    bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
            let token = jwt.sign({email: user.email}, "sssss");
            res.cookie("token", token);
             res.send("Login Success");
        }
        else res.send("Login Failed");
    })
})
app.get('/logout', (req, res)=>{
    res.cookie('token', "");
    res.redirect('/');
})

app.listen(5000);
