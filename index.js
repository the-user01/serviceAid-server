const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: [
            "http://localhost:5173"
        ]
    })
);
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.8yiviav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // all collection

        const usersCollection = client.db("serviceAid").collection("users");


        // Users related api

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
          })

        app.post("/users", async (req, res) => {
            const user = req.body;
            // insert email if user doesn't exist
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
              return res.send({ message: 'user already exist' });
            }
      
            const result = await usersCollection.insertOne(user);
            res.send(result)
          })
      
          app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
          })

       
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
       
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Study Platform is running");
})
app.listen(port, () => {
    console.log(`Server running in port: ${port}`);
})