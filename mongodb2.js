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

app.get("/movies", (request, response) => {
    collection.find({"metascore" : {"$gt" : 70}}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        var nombre = Math.floor(Math.random() * Math.floor(result.length));
        console.log(result[nombre]);
        response.send(result[nombre]);
        var title = result[nombre].title;
        var metascore = result[nombre].metascore;
        var synopsis = result[nombre].synopsis;
        return{
          title,
          metascore,
          synopsis
        };
    });
});
