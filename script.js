const express=require('express');
const mongoose=require('mongoose');
const app=express();
app.use(express.static(__dirname + '/public'));
const shorturl=require('./models/shorturl');
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');


mongoose.connect('mongodb://localhost/urlShortener',{
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
