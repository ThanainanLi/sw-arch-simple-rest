require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const { MongoClient } = require("mongodb");
const uri = process.env.DB_URI;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//POST Order
app.post("/orders/create", async (req, res) => {
  const order = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client
    .db("mydb")
    .collection("orders")
    .insertOne({
      id: parseInt(order.id),
      name: order.name,
      origin: order.origin,
      destination: order.destination,
      price: order.price,
    });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "Order with ID = " + order.id + " is created",
    order: order,
  });
});

//GET All order
app.get("/orders", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const orders = await client
    .db("mydb")
    .collection("orders")
    .find({})
    .toArray();
  await client.close();
  res.status(200).send(orders);
});

//GET order by id
app.get("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const order = await client
    .db("mydb")
    .collection("orders")
    .findOne({ id: id });
  await client.close();
  res.status(200).send({
    status: "ok",
    order: order,
  });
});

//Update order
app.put("/orders/update", async (req, res) => {
  const order = req.body;
  const id = parseInt(order.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client
    .db("mydb")
    .collection("orders")
    .updateOne(
      { id: id },
      {
        $set: {
          id: parseInt(order.id),
          name: order.name,
          origin: order.origin,
          destination: order.destination,
          price: order.price,
        },
      }
    );
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "order with ID = " + id + " is updated",
    order: order,
  });
});

//Delete order
app.delete("/orders/delete", async (req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("orders").deleteOne({ id: id });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "Order with ID = " + id + " is deleted",
  });
});
