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

app.get("/movies/populate", async (request, response) => {
    const films = await imdb(DENZEL_IMDB_ID);
    //console.log(films);
    collection.insertMany(films, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
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
    });
});

app.get("/movies/search", (request, response) => {
    var limit;
    var metascore;
    if(typeof request.query.limit === undefined){
      limit = 5;
    }
    else {
      limit = parseInt(request.query.limit);
      if(isNaN(limit)){
        limit = 5;
      }
    }

    if(typeof request.query.metascore === undefined){
      metascore = 0;
    }
    else {
      metascore = parseInt(request.query.metascore);
      if(isNaN(metascore)){
        metascore = 0;
      }
    }

    //console.log(limit);
    //console.log(metascore);

    collection.find({"metascore" : {"$gt" : metascore}}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        var retour = [];
        for(var i = 0; i < limit; i++){
          retour.push(result[i]);
          //console.log(result[i]);
        }
        response.send(retour);
    });
});

app.get("/movies/:id", (request, response) => {
    collection.find({"id": request.params.id}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.post('/movies/:id', (req, res) =>{
    var id = req.params.id;
    var date = req.query.date;
    var review = req.query.review;
    collection.update({id: id}, {$set: {"date": date, 'review' : review}}, (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        else {
            res.send(result);
        }
    });
});
