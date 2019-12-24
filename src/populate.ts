import {LevelDB} from './leveldb'
import express = require('express')
import bodyparser = require('body-parser')
import { MetricsHandler, Metric } from './metrics'
import { UserHandler, User } from './user'


import path = require('path');
let ejs = require('ejs');

const app = express()
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
const dbUser: UserHandler = new UserHandler('./db/users')


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
  console.log('Please open your browser with http://localhost:8080/')
})


app.get('/', (req: any, res: any) => {
    //User1 as default
    let user = new User("kutlu","kutluTestEmail@gmail.com","root1",false);
      dbUser.save(user, function (err: Error | null) {
        if (err) throw (err)
      })

    var ts = new Date()
    
    dbMet.saveOne("kutlu","1111111111111", "99", (err: Error | null) => {
        if (err) throw err
    })
    dbMet.saveOne("kutlu","2222222222222", "98", (err: Error | null) => {
        if (err) throw err
    })

    //User2 as default
    let user2 = new User("niklas","niklasTestEmail@gmail.com","root2",false);
      dbUser.save(user2, function (err: Error | null) {
        if (err) throw (err)
      })
    dbMet.saveOne("niklas","3333333333333", "999", (err: Error | null) => {
        if (err) throw err
    })

    dbMet.saveOne("niklas","4444444444444", "888", (err: Error | null) => {
        if (err) throw err
    })

    
    res.write("Hello This is to populate 2 user with 2 metrics in each! \n")
    res.end()
    
  })
/*
  app.get('/populateComplete', (req: any, res: any) => {
    res.write("Operation complete please close the server and move on to the actual server \n")
    res.end()
  })
*/