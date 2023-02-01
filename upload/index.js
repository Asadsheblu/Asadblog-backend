const express=require("express")
const app=express()
const path = require('path');
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
const multer = require("multer");
const upload = multer({ dest: '/upload' })
const mongoose = require("mongoose")
require('dotenv').config()
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express')
app.use(cors())
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig))
app.use(express.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization")
    next()
})
const port = 5000;
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello Web course backend sever")
})


var uri = "mongodb://blog:vvG3YEp20dKZq2BE@cluster0-shard-00-00.7auxx.mongodb.net:27017,cluster0-shard-00-01.7auxx.mongodb.net:27017,cluster0-shard-00-02.7auxx.mongodb.net:27017/?ssl=true&replicaSet=atlas-quc4tl-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
        
    const blogs=client.db("Blog").collection("news")
    
    app.post("/news", async (req, res) => {
      const doc=req.body
       const result =await blogs.insertOne(doc);
      console.log(result);
       res.send(result);
     });
     app.post('/api/image',upload.single('image'), (req,res)=>{
      console.log(req.file);
      if(!req.file){
        res.send({code:500,msg:"err"})
      }
      else{
        res.send({code:200,msg:"upload success"})
      }
     })
     app.get("news",async(req,res)=>{
      const query={}
        const result=blogs.find(query)
        const user=await result.toArray()
        res.send(user)
        
     })

   

  } 
  finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.listen(port,()=>{
  console.log(`Running server ${port}`);

})
