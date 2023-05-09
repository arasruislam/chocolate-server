const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.w00ka8a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("chocolatesDB");
    const chocolateCollection = database.collection("chocolates");

    app.get("/chocolates", async (req, res) => {
      const result = await chocolateCollection.find().toArray();
      res.send(result);
    });

    app.get("/chocolates/:id", async (req, res) => {
      const result = await chocolateCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.post("/chocolates", async (req, res) => {
      const newChocolate = req.body;
      const result = await chocolateCollection.insertOne(newChocolate);
      res.send(result);
    });

    app.put("/chocolates/:id", async (req, res) => {
      const updateChocolate = req.body;
      const query = { _id: new ObjectId(req.params.id) };
      const options = { upsert: true };
      const setNewChocolateInfo = {
        $set: {
          name: updateChocolate.name,
          country: updateChocolate.country,
          category: updateChocolate.category,
          photo: updateChocolate.photo,
        },
      };
      const result = await chocolateCollection.updateOne(
        query,
        setNewChocolateInfo,
        options
      );
      res.send(result);
    });

    app.delete("/chocolates/:id", async (req, res) => {
      const result = await chocolateCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Chocolate Server");
});

app.listen(port, () => {
  console.log(`The Chocolate server running on port: ${port}`);
});
