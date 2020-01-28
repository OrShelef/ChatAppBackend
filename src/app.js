
const path = require("path");
const app = require('express')();

const fs=require('fs');
const https = require('https').createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app);
//const io = require('socket.io')(https);
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-daweo.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://orshelef.github.io');

  

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-Type, accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
messages={};
console.log("connected");
client.connect(err=>{});

/*io.on("connection", socket => {
   

    socket.on("disconnected",()=>client.close());
    socket.on('SendMessage', (msg) => 
    {
            const collection = client.db("ChatApp").collection("Messages");         
            collection.insertOne(msg);
           
            io.emit('MessageFromServer_'+msg.otherId,msg);
    });

   
  });*/

  app.route('/api/Users/AddUser/').post((req,res)=>{
    console.log(req.body);
    const requestedId = req.body;    
    const collection = client.db("ChatApp").collection("Users");       
    collection.insertOne(requestedId);
    res.send(requestedId);
  });
  app.route('/api/Users/AddUsers/').post((req,res)=>{
    console.log(req.body);
    const requestedId = req.body;    
    const collection = client.db("ChatApp").collection("Users");       
    collection.insertMany(requestedId);
    res.send(requestedId);
  });
  app.route('/api/SendMessage/').post((req,res)=>{
    console.log(req.body);
    const requestedId = req.body;    
    const collection = client.db("ChatApp").collection("Messages");       
    collection.insertOne(requestedId);
    res.send(requestedId);
  });
  app.route('/api/Users/GetUser/:id').get((req, res) =>
  {
    const requestedId = req.params['id']         
    const collection = client.db("ChatApp").collection("Users");
    const query={id:+requestedId};
    collection.findOne(query,(err,result)=>{
        res.send(result);
    });   
 });
 app.route('/api/Users/GetUsers/:id').get((req, res) =>
 {
   const requestedId = req.params['id']         
   const collection = client.db("ChatApp").collection("Users");
   const query={otherId:+requestedId};
   collection.find({}).toArray((err,result)=>{
       res.send(result);
   });   
});
  app.route('/api/GetMessages/:otherId/:userId').get((req, res) =>
  {
    
    const _otherId = req.params['otherId'];       
    const _userId = req.params['userId'];       
    const collection = client.db("ChatApp").collection("Messages");
    const query=
    {
      $or:[
        {
          userId:+_userId,
          otherId:+_otherId
        },
        {
          userId:+_otherId,
          otherId:+_userId
        }
      ]
     
    };
    
    collection.find(query).toArray((err,result)=>{
        res.send(result);
    });   
 });
 //app.all('*', (req, res) =>  res.status(200).sendFile((path.join(__dirname,'../../dist/TodosApp/index.html'))));
https.listen(8080, () => {
  console.log('Listening...')
})
console.log((path.join(__dirname,'../../dist/TodosApp/index.html')));

 