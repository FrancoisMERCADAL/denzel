const Express = require("express");
const BodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require('mongodb').MongoClient;

const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

const uri = "mongodb+srv://Client1:azerty@workshopdenzel-hxl5q.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const DATABASE_NAME = "WorkshopDenzel";

app.listen(9292, () => {
  MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("Filmographie");
    console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});
