const express=require("express")
const app=express()

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
    const sPeaker=client.db("Blog").collection("speaker")
    
    app.post("/news", async (req, res) => {
      const doc=req.body
       const result =await blogs.insertOne(doc);
      console.log(result);
       res.send(result);
     });
    
     app.get("/news",async(req,res)=>{
      const query={}
        const result=blogs.find(query)
        const post=await result.toArray()
        res.send(post)
        
     })

     app.get('/news/:id',async(req,res)=>{
      const id=(req.params.id);
      const query={_id:ObjectId(id)}
      const result=await blogs.findOne(query)
      res.send(result)
  })
     app.delete('/news/:id',async(req,res)=>{
      const id=(req.params.id);
      const query={_id:ObjectId(id)}
      const result=await blogs.deleteOne(query)
      res.send(result)
  })
  //speaker add
  app.post("/speakers", async (req, res) => {
    const doc=req.body
     const result =await sPeaker.insertOne(doc);
    console.log(result);
     res.send(result);
   });
  
   app.get("/speakers",async(req,res)=>{
      const query={}
      const results= sPeaker.find(query)
      const speaker=await results.toArray()
      res.send(speaker)
      
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
