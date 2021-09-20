const express = require('express')
const app = express()
const port = 8080
var jwt = require('jsonwebtoken');

const cors = require('cors');
const { createAccount, signInWithUsernameAndPassword } = require('./my-modules/auth');  
const { createCondidate, ListCondidates, finById, closeMeet } = require('./my-modules/condidate');

app.use(cors());



app.use(function(req,res,next){
  console.log(new Date().getTime());


  if (req.url === "/signin") {
    next();
  }else if( req.url === "/signup" ){
    next();

  }else{
        // verify the access token !!
        if (req.headers.authorization != null) {
          const token  = req.headers.authorization;
    
          try {
            let decod = jwt.verify(token,'abcd');
            console.log(decod);
    
            
            next();
          } catch (error) {
            res.send("session expired")
          }
    
    
        }else{
          res.send("oups access denied no token present")
        }
  }


  
})




// ROUTE GET
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/signin',(req,res)=>{
  signInWithUsernameAndPassword(req,res)
})


app.post('/signup',(req,res)=>{
  createAccount(req,res);
})


app.get('/api/user/connected', (req, res) => {
  const token  = req.headers.authorization;
    
  try {
    let decod = jwt.verify(token,'abcd');
    console.log(decod);
      let user = decod.user;

      delete user.password;

      res.send(user)
  } catch (error) {
    res.send("session expired")
  }
})




/******************** vehicules  APIs ********************* */

app.post('/api/condidate/add',(req,res)=>{
  createCondidate(req,res);
})


app.get('/api/condidate/list',(req,res)=>{
  ListCondidates(req,res);
})


app.get('/api/condidate/details',(req,res)=>{
  finById(req,res);
})


app.post('/api/condidate/closeMeet',(req,res)=>{
  closeMeet(req,res);
})


 





app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`)
})