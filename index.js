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
        const serviceCollection = client.db("serviceAid").collection("services");
        const messageCollection = client.db("serviceAid").collection("messages");
        const bookingCollection = client.db("serviceAid").collection("bookings");


        // get Admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let admin = false;
            if (user) {
                admin = user?.role === 'Admin'
            }
            res.send({ admin })
        })


        // get Customer
        app.get('/users/customer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let customer = false;
            if (user) {
                customer = user?.role === 'Customer'
            }
            res.send({ customer })
        })


        // get Provider
        app.get('/users/provider/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let provider = false;
            if (user) {
                provider = user?.role === 'Service Provider'
            }
            res.send({ provider })
        })






        // Users related api

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

          // get Provider
          app.get('/users/serviceProvider/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            res.send(user)
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

        app.patch('/users/approved/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const updateStatus = {
                $set: {
                    status: "Approved"
                }
            }

            const result = await usersCollection.updateOne(query, updateStatus)

            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })




        // Services related api

        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find().toArray();
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await serviceCollection.findOne(query)
            res.send(result);
        })

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const result = await serviceCollection.deleteOne(query)
            res.send(result);
        })



        // User Message Related Api

        app.get('/messages', async (req, res) => {
            const result = await messageCollection.find().toArray();
            res.send(result)
        })

        app.post("/messages", async (req, res) => {
            const message = req.body;
            const result = await messageCollection.insertOne(message);
            res.send(result)
        })

        app.delete('/messages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await messageCollection.deleteOne(query);
            res.send(result);
        })




        // Bookings related api

        app.get('/bookings', async (req, res) => {
            const result = await bookingCollection.find().toArray();
            res.send(result)
        })

        app.patch('/bookings/canceled/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const updateStatus = {
                $set: {
                    status: "Canceled"
                }
            }

            const result = await bookingCollection.updateOne(query, updateStatus)

            res.send(result);
        })

        app.patch('/bookings/report/:id', async (req, res) => {
            const id = req.params.id;
            const report = req.body;
            const query = { _id: new ObjectId(id) };

            const updateStatus = {
                $set: {
                    report
                }
            }

            const result = await bookingCollection.updateOne(query, updateStatus)

            res.send(result);
        })


        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            res.send(result);
        })

        app.get('/bookings/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await bookingCollection.find(query).toArray()
            res.send(result);
        })



        app.post("/bookings", async (req, res) => {
            const message = req.body;
            const result = await bookingCollection.insertOne(message);
            res.send(result)
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