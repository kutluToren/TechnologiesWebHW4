import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"
import { notDeepEqual } from 'assert'

const dbPath: string = './db/db_test'
var dbMet: MetricsHandler

  describe('Metrics', function () {
    before(function () {
      LevelDB.clear(dbPath)
      dbMet = new MetricsHandler(dbPath)
    })

    after(function () {
      dbMet.closeDB()
    })

  describe('#get', function () {
    it('should get empty array on non existing group', function (next) {
      dbMet.getByUser("11", function (err: Error | null, result?: Metric[]) {
        //console.log(result)
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(Array.isArray(result))
        expect(result).to.be.empty //There should be no matching user 11
        next();
      })
    })

    it('should get empty array on non existing group', function (next) {
      dbMet.saveOne("11","8888888888888",8 ,(err:Error|null) =>{})
      dbMet.saveOne("11","7777777777777",7 ,(err:Error|null) =>{})
      dbMet.saveOne("12","6666666666666",6 ,(err:Error|null) =>{})
      dbMet.saveOne("13","5555555555555",5 ,(err:Error|null) =>{})

      dbMet.getByUser("11", function (err: Error | null, result?: Metric[]) {
        //console.log(result)
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(Array.isArray(result))
        expect(result).to.have.length(2) //There should be 2 metrics for user 11
        next();
      })
    })


    it('should get all the metrics', function (next) {

      dbMet.getAll(function (err: Error | null, result?: Metric[]) {
        //console.log(result)
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(Array.isArray(result))
        expect(result).to.have.length(4) //up to now there should be 4 metrics
        next();
      })
    })
    
    it('should read the metrics of mockUser correctly saved now',function(){
      
      dbMet.saveOne("mockUser","9999999999999",9 ,(err:Error|null) =>{
        dbMet.getByUser("mockUser", (err: Error | null, result?: Metric[])=>{
          //expect(err).to.be.null
          //expect(result).to.not.be.undefined 
          
          if(typeof(result)=='object'){
            const MetricTest = new Metric ('9999999999999',9)
            //console.log(result[0])
            expect(result[0]).to.deep.equal((MetricTest))

          }  
        })
      })
    })
    
    it('should delete the metric with id mockUser#9999999999999 in the metrics', function (next) {

      dbMet.saveOne("mockUser","9999999999999",9 ,(err:Error|null) =>{
        
      })
      dbMet.saveOne("mockUser","8888888888888",8 ,(err:Error|null) =>{
  
      })

      it('number of metrics of mockUser before saving and deleting', function (next) {

        dbMet.getByUser("mockUser", function (err: Error | null, result?: Metric[]) {
          //console.log(result)
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(Array.isArray(result))
          expect(result).to.be.empty //has no value in beginning
          next();
        })
      })

      dbMet.deleteOneWithId("mockUser","9999999999999", (err1: Error | null, result?)=> {
        dbMet.getAll(function (err: Error | null, result?: Metric[]){
          //console.log("result is:",result)
          //console.log("err get all",err)
          expect(err).to.be.null
        })
        //console.log("err delete",err1)
        expect(err1).to.be.undefined
        expect(result).to.equal('ok')
        next();
      })
    })

    it('should delete worked for mockUser', function (next) {

      dbMet.getByUser("mockUser", function (err: Error | null, result?: Metric[]) {
        //console.log(result)
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(Array.isArray(result))
        expect(result).to.have.length(1) //2 metrics added 1 removed so if delete ssuccessfull should be one
        next();
      })
    })
    
  })
})