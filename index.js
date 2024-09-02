const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Added ObjectId import

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.db_user)

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.hehzvom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const database = client.db("CanteenDatabase");
    const userCollection = database.collection("CouponData");

    // Fetch all coupons
    app.get('/coupon', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Add a new coupon
    app.post('/coupon', async (req, res) => {
      try {
        const user = req.body;
        console.log('new user', user);

        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

    // Get a coupon by ID
    app.get('/coupon/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Delete a coupon by ID
    app.delete('/coupon/:id', async(req, res) =>{

      const id = req.params.id;
      console.log('delete ID:', id); 

      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    });
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Canteen system server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
