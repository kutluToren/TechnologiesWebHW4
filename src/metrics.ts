
import {LevelDB} from './leveldb'
import WriteStream from 'level-ws'
import { ok } from 'assert'


export class Metric {
    public timestamp: string
    public value: number
  
    constructor(ts: string, v: number) {
      //console.log("v is ",v)
      //console.log("ts is ",ts)
      this.timestamp = ts
      this.value = v
      
    }
}
  
 
export class MetricsHandler {
  private db: any 


  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public closeDB(){
    this.db.close()

  }


  
  
//const stream = WriteStream(this.db)
    //stream.on('error', callback)
    //stream.on('close', callback)
    //metrics.forEach((m: Metric) => {
      //this.db.put({ key: `metric:${key}${metrics.timestamp}`, value: metrics.value })
      //console.log(metrics.timestamp)
      //console.log(metrics.value)


      //})
    //stream.end()


  public saveOne(key:string, timestamp:string, value: number, callback: (error: Error | null) => void) {

      this.db.put(`${key}${"#"}${timestamp}`, value, (err: Error | null) => {
        callback(err)
    })
     
        
    
  }
  
  /*
  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `${key}${m.timestamp}`, value: m.value })
    })
    stream.end()
  }
  */
  public getAll(
    callback:(error:Error |null ,result : any |null )=> void
  ){
    let metrics: Metric[]=[];
    this.db.createReadStream()
      .on('data', function (data) {

        //console.log("testData"+JSON.stringify(data))
        //console.log("testDataSplit"+JSON.stringify(data.key.split(':')))
        
        let timestamp:string = JSON.stringify(data.key.split(':'))
        //console.log(timestamp)
        //console.log(data.value)
        let metric: Metric =new Metric(timestamp,data.value)
        metrics.push(metric)
        
        
      })
      .on('error', function (err) {
        //console.log('Oh my!', err)
        callback(err,null)
      })
      .on('close', function () {
        //console.log('Stream closed')
      })
      .on('end', function () {
        callback(null,metrics)
        //console.log('Stream ended')
        
      })
  }

  public getByUser(
    key: string ,callback:(error:Error |null ,result : any |null )=> void
  ){
    let metrics: Metric[]=[];
    this.db.createReadStream()
      .on('data', function (data) {
        //console.log('data, ', data);
        //console.log('key, ', key);
        
        let username:string = data.key.split('#')[0]
        
        //console.log("username",username)

        if(username === key){
          let timestamp:string = data.key.split('#')[1]
          //console.log("timestamp is this: ", timestamp)
          //console.log('data.value is : ',data.value)
          let metric: Metric =new Metric(timestamp,data.value)
          metrics.push(metric)
        }else
        console.log('No match with: '+key)
       
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err,null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null,metrics)
        console.log('Stream ended')
      
      })
  }
  
  
  public deleteOneWithId(key:string,timestamp: string, callback: (error: Error | null, result?) => void) {
     this.db.del(`${key}${"#"}${timestamp}`,(err: Error | null) => {
      callback(err, ok)
    })
    
  }

  
   
}

