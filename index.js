const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config() //dotenv file
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3worizk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1 ,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const MYdatabase = client.db('dokoDB').collection('products') 

    app.get('/products', async(req,res)=>{
        const cursor = MYdatabase.find();
        const result = await cursor.toArray();
        res.send(result)

    })

    app.post('/products', async (req,res)=> {
        const newProduct = req.body;
        console.log(newProduct)
        const result = await MYdatabase.insertOne(newProduct);
        res.send(result) 
      })


      
      app.get('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await MYdatabase.findOne(query);
        res.send(result)
      })

      app.put('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const options = {upsert : true}
        const putProduct = req.body;
        const UpdateProduct = {
          $set:{
            photo:putProduct.photo,
            brandname:putProduct.brandname,
            name:putProduct.name,
            type:putProduct.type,
            price:putProduct.price,
            details:putProduct.details,
            rating:putProduct.rating,
          }
        }

        const result = await MYdatabase.updateOne(query,UpdateProduct,options)
        res.send(result)

      })

      app.delete('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await MYdatabase.deleteOne(query);
        res.send(result)
      })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/' ,(req,res)=>{
    res.send('fashion server is running')
})
app.listen(port, () => {
    console.log('your running port is :" ', port )
})