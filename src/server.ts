import {LevelDB} from './leveldb'
import express = require('express')
import bodyparser = require('body-parser')
import { MetricsHandler, Metric } from './metrics'
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'
import WriteStream from 'level-ws'

import path = require('path');
let ejs = require('ejs');

const app = express()
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')


app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');


const port: string = process.env.PORT || '8080'



app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})


const LevelStore = levelSession(session)

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))


const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})



app.post('/login', (req: any, res: any, next: any) => {
 
  /* For testing delete before submit. Prints all the users
    dbUser.getAll((err: Error | null, result?: User)=>{
    console.log(result);
    res.status(200).send(result);
  })
  */
  
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    console.log('')
    if (err) throw (err)
    //NEED TO FIX Convert Login to AJAX send back error to login ejs
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      dbMet.getAll((err: Error | null, result?: User) => {
        console.log(result);
        req.session.user.metrics = result
        console.log('req.session.user.metrics', req.session.user.metrics);
        res.redirect('/')
      })  
    }
  })
  
})

app.get('/metrics/', (req: any, res: any) => {
  dbMet.getAll((err: Error | null, result: any) => {
    if (err) throw err
    res.status(200).send(result)

  })
})

app.post('/metrics/:id', (req: any, res: any) => {
  console.log(req.body)
  console.log("id: ",req.params.id)
  dbMet.saveOne(req.session.username, req.body, (err: Error | null) => {
    if (err) throw err
    
    res.redirect('/')
  })
})

//Update e-mail and password



app.post('/userEmail/:id', (req: any, res: any) => {
  console.log(req.body.newEmail)
  console.log("id: ",req.params.id)
  console.log("password: ",req.session.user.password)

  let user = new User(req.params.id,req.body.newEmail,req.session.user.password,true);
      dbUser.save(user, function (err: Error | null) {
  
    if (err) throw (err)
    
    res.redirect('/')
  })
})


app.post('/userPassword/:id', (req: any, res: any) => {
  console.log(req.body.newPassword)
  console.log("id: ",req.params.id)
  console.log("password: ",req.session.user.email)

  let user = new User(req.params.id,req.session.user.email,req.body.newPassword,false);
      dbUser.save(user, function (err: Error | null) {
  
    if (err) throw (err)
    
    res.redirect('/')
  })
})



app.post('/signup', (req: any, res: any, next: any) => {
  console.log(req.body.username);
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
    res.status(409).send("user already exists")
    } else {
      let user = new User(req.body.username,req.body.email,req.body.password,false);
      dbUser.save(user, function (err: Error | null) {

  if (err) next(err)

  else res.redirect('/login')
    
        })
      }
    })
})

app.use(authRouter)
const userRouter = express.Router()


    userRouter.post('/', (req: any, res: any, next: any) => {
      console.log(req.body.username);
      dbUser.get(req.body.username, function (err: Error | null, result?: User) {
        if (!err || result !== undefined) {
        res.status(409).send("user already exists")
        } else {
          dbUser.save(req.body, function (err: Error | null) {

  if (err) next(err)

  else res.status(201).send("user persisted")
          })
        }
      })
    })

    userRouter.get('/:username', (req: any, res: any, next: any) => {
      dbUser.get(req.params.username, function (err: Error | null, result?: User) {
        if (err || result === undefined) {
          res.status(404).send("user not found")
        } else res.status(200).json(result)
      })
    })

    app.use('/user', userRouter)

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
      next()
    } else res.redirect('/login')
}
  
app.get('/', authCheck, (req: any, res: any) => {
   res.render('index', {
    username: req.session.user.username,
    email: req.session.user.email,
    password: req.session.user.password,
    metrics: req.session.user.metrics
  })
})

// <% metrics.forEach(function(metrics){ %>