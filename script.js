const express=require('express');
const mongoose=require('mongoose');
const app=express();
app.use(express.static(__dirname + '/public'));
const shorturl=require('./models/shorturl');
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');


mongoose.connect('mongodb://admin-siddharth:qwerty_siddharth@cluster0-shard-00-00.avmv2.mongodb.net:27017,cluster0-shard-00-01.avmv2.mongodb.net:27017,cluster0-shard-00-02.avmv2.mongodb.net:27017/urlShortener?ssl=true&replicaSet=atlas-ou6j37-shard-0&authSource=admin&retryWrites=true&w=majority',{
    useNewUrlParser:true , useUnifiedTopology:true
})

app.get('/',async function(req,res){
   const shorturls=await shorturl.find();
   res.render('index',{shorturl:shorturls});
});

app.post('/shorturl',async function(req,res){
    await shorturl.create({full:req.body.fullurl});
    res.redirect('/');
});

app.get('/:shorturl',async function(req,res){
    const shortUrl=await shorturl.findOne({short:req.params.shorturl});
    if(shortUrl==null){
        return res.send.sendStatus(404);
    }
    shortUrl.clicks++;
    shortUrl.save()

    res.redirect(shortUrl.full);
});

app.listen(process.env.PORT||3000);
