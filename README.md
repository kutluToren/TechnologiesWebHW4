# WebTech_Kutlu_Niklas
## Project of the Web Technologies class in ECE Paris 2019 GR1
### Project Contributors: Kutlu Toren, Niklas Johannesmeier

## First steps to set up the environment:
- Open command prompt in the projects directory and execute "npm install"
- Populate the database with "npm run populate"
    -> enter the localhost:8080 to make it work
    -> it will create a small data sample with two example accounts, each having metrics already stored
    -> users you can use are username:kutlu password root1  and username:niklas password: root2 both has 2 metrics in it
- Ready now! Start the project every time with "npm run dev" or "npm start"

## To do the testing part we created two timescript files
- First one is "metrics.test.ts"
- Second one is "users.test.ts"
-> Run all test by typing "npm test" in the console



## Additional overview above each important file and it's functionality inside the project:
### Frontend:
- login.ejs handles the frontend for the login process (Forms, Buttons, Explanations) Everytime you enter the correct user-password combination you will be forwarded to our mainpage (index.ejs) with your userdata being passed to the current session. Also if a wrong user-password gets entered, it will forward you to another page that will tell you that it is not correct. There is a link to go to signup page as well

- signup.ejs handles the frondend for the signup process but now also contains a button that is connected to a POST function for inserting new users into our database. It checks everytime that the user you enter DOES NOT exist already in the database.

- index.ejs basically represents the main page, where every action happens. On the left side there are the metrics functionalities, where the user can see only his OWN metrics he stored. Also there is the possibility to add new metrics to the database. The user needs to login again to refresh the list of metrics. Also on the right side, there are the possibilites to change your email or password from your current account. This will redirect you to the login page for refreshing reasons.

### Backend:
- server.ts is responsable for every interaction with the servers and the frontend. It is the backbone of our backend. Functions like "signup", "login" or "authCheck" are handled here

- metrics.ts handles the storing metrics with the database and is responsible for inserting the metrics in a propper way like "username" + "#" + "timestamp" , insertedValue . Furthermore this file handles the GET function for metrics as well, where every user can see only his own metrics.

->Functions of MetricsHandler

--> public saveOne(key:string, timestamp:string, value: number, callback: (error: Error | null) => void) {
    It saves one metrics into the db with key should be username and timestamp is unique extension of the key for the user

-->public getAll(
    callback:(error:Error |null ,result : any |null )=> void
  ){
      It returns all the metrics as a metrics array if there is no error. This is used for testing

-->public getByUser(
    key: string ,callback:(error:Error |null ,result : any |null )=> void
  ){
      It gets the metrics of a user. This is used in the actual functionality to show the metrics of a user when logged in

-->public deleteOneWithId(key:string,timestamp: string, callback: (error: Error | null, result?) => void) {
    It deletes a metric for a given user and timestamp


- user.ts same as metrics.ts but for users. It is responsible for saving and getting users from the user database.

->Functions of usersHandler

--> public save(user: User, callback: (err: Error | null) => void) {
    Saves a user to the database. It gets a user as an input

-->  public getAll(callback: (error: Error | null, result: any | null) => void) {
    It gives all the users, used mainly for testing

-->public get(username: string, callback: (err: Error | null, result?: User) => void) {
    gets the user info regarding to given username

-->public delete(username: string, callback: (err: Error | null) => void) {
    It deletes a user from database



## File structure
--- ProjectFile
---- db                     (levelDB File)<br/>
------>db_test              (for testing)<br/>
------>metrics              (for storing metrics)<br/>
------>sessions             (for storing session info)<br/>
------>users                (for storing users info)<br/>
---- src<br/>
------>declarations.d.ts<br/>
------>leveldb.ts<br/>
------>metrics.ts           (has metrics class and metricsHandler in it)<br/>
------>populate.ts          (for creating initial users and metrics)<br/>
------>server.ts            (hadles the server main part)<br/>
------>users.ts             (has users class and userHandler in it))<br/>
------>users.test.ts        (test to check userHandler functions)<br/>
------>metrics.test.ts      (test to check metricsHandler functions)<br/>
------>views                (has ejs files in it)<br/>
--------->partials          (has head.ejs)<br/>
--------->errorDelete.ejs   (fronthand to show when a faulty error on user)<br/>
--------->home.ejs          (fronthand of home page)<br/>
--------->index.ejs         (fronthand of user page)<br/>
--------->login.ejs         (fronthand of login page)<br/>
--------->signup.ejs        (fronthand of signup page)<br/>
--------->userExists.ejs    (fronthand to show when signup attempt on an existing username)<br/>
--------->wrongLogin.ejs    (fronthand to show when a faulty login attempt)<br/>
----node_modules<br/>
----.gitignore<br/>
----.travis.yml<br/>
----nodemon.json<br/>
----package-lock.json<br/>