const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbqmn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const agentsCollection = client.db("shera64").collection("agents");
  const quriesCollection = client.db("shera64").collection("quries");
  console.log("DB Conneted");

  app.post("/signUpUser", (req, res) => {
    const agent = req.body;
    console.log(agent);
    agentsCollection.insertOne(agent).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/agent", (req, res) => {
    const email = req.query.email;
    console.log(email);
    agentsCollection.find({ email: email }).toArray((err, agents) => {
      console.log(agents[0]);
      res.send(agents[0]);
    });
  });

  app.post("/quries", (req, res) => {
    const query = req.body;
    console.log(query);
    quriesCollection.insertOne(query).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/queryList", (req, res) => {
    const link = req.query.link;
    console.log(link);
    quriesCollection.find({ fbid: link }).toArray((err, query) => {
      console.log(query);
      res.send(query);
    });
  });

  app.get("/updateQuery/:id", (req, res) => {
    quriesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, updateQuery) => {
        console.log(updateQuery);
        res.send(updateQuery);
      });
  });

  app.patch("/finalUpdate/:id", (req, res) => {
    quriesCollection.updateOne(
      { _id: ObjectId(req.params.id) },
      {
        $set: { customerName: req.body.customerName,address: req.body.address,phone: req.body.phone,district: req.body.district,channel: req.body.channel,fbid: req.body.fbid,productQuery: req.body.productQuery,purposeQuery: req.body.purposeQuery,remarks: req.body.remarks},
      }
    )
    .then((result) => {
      res.send(result.modifiedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
