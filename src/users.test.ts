import { expect } from 'chai'
import { User , UserHandler } from './user'
import { LevelDB } from "./leveldb"
import { notDeepEqual } from 'assert'

const dbPath: string = './db/db_test'
var dbUser: UserHandler

  describe('Metrics', function () {
    before(function () {
      LevelDB.clear(dbPath)
      dbUser = new UserHandler(dbPath)
    })

    after(function () {
        dbUser.closeDB()
    })

  describe('#get', function () {
    it('should save a user and get the value back', function (next) {
        const UserTest= new User("mockUser","mockEmail@gmail.com","1234",false)
        dbUser.save(UserTest,function (err1: Error|null){
            dbUser.get("mockUser", function (err: Error | null, result?: User|undefined) {
    
            //console.log(result)
            expect(err1).to.be.undefined
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(Array.isArray(result))
            expect(result).to.deep.equal((UserTest))

        next();
      })
    })
    })




  })
})