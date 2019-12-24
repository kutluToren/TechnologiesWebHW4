import { expect } from 'chai'
import { User , UserHandler } from './user'
import { LevelDB } from "./leveldb"
import { notDeepEqual } from 'assert'

const dbPath: string = './db/db_test'
var dbUser: UserHandler

  describe('Users', function () {
    before(function () {
      LevelDB.clear(dbPath)
      dbUser = new UserHandler(dbPath)
    })

    after(function () {
        dbUser.closeDB()
    })

  describe('#get', function () {
    it('should save the user and get the value back correctly', function (next) {
        const UserTest= new User("mockUser","mockEmail@gmail.com","1234",false)
        const UserTest2= new User("mockUser2","mockEmail2@gmail.com","1234",false)
        dbUser.save(UserTest2,function (err2: Error|null){})
        
        dbUser.save(UserTest,function (err1: Error|null){
            dbUser.get("mockUser", function (err: Error | null, result?: User|undefined) {
    
            //console.log(result)
            expect(err1).to.be.undefined
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(Array.isArray(result))
            expect(result).to.deep.equal((UserTest))

        next()
      })
    })
    })

    
        it('should try getting a user does not exist the value back', function (next) {
            dbUser.get("mockUser", function (err: Error | null, result?: User|undefined) {
            //console.log(result)
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            next();
          })
        })

        it('should get all the users back', function (next) {
            dbUser.getAll( function (err: Error | null, result?: any) {
            //console.log(result)
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(result).to.have.lengthOf(2) //There is 2 saves done in the tests
            next();
          })
        })

        //Checks if delete does not executed when wrong id given
        it('should not delete the user', function (next) {
          dbUser.delete("wrongId", function (err: Error | null) {
      
          dbUser.getAll( function (err: Error | null, result?: any) {
              //console.log("I am the result after delete",result)  
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.not.be.empty
          next();
          })
          })     
        })

        //mockUser added in previous tests 
        it('should delete the user', function (next) {
            dbUser.delete("mockUser", function (err: Error | null) {
        
            dbUser.getAll( function (err: Error | null, result?: any) {
                //console.log("I am the result after delete",result)  
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(result).to.have.length(1)//1 of 2 user deleted
            next();
            })
        })     
        })

        it('should delete the user', function (next) {
          dbUser.delete("mockUser2", function (err: Error | null) {
      
          dbUser.getAll( function (err: Error | null, result?: any) {
              //console.log("I am the result after delete",result)  
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.be.empty//2 of 2 user deleted
          next();
          })
      })     
      })


  })
})