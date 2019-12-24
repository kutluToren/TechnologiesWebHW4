# WebTech_Kutlu_Niklas
## Project of the Web Technologies class in ECE Paris 2019 GR1

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
- login.js handles the frontend for the login process (Forms, Buttons, Explanations) Everytime you enter the correct user-password combination you will be forwarded to our mainpage (index.js) with your userdata being passed to the current session. Also if a wrong user-password gets entered, it will forward you to another page that will tell you that it is not correct.

- signup.js handles the frondend for the signup process but now also contains a button that is connected to a POST function for inserting new users into our database. It checks everytime that the user you enter DOES NOT exist already in the database.

- index.js basically represents the main page, where every action happens. On the left side there are the metrics functionalities, where the user can see only his OWN metrics he stored. Also there is the possibility to add new metrics to the database. The user needs to login again to refresh the list of metrics. Also on the right side, there are the possibilites to change your email or password from your current account. This will redirect you to the login page for refreshing reasons.

### Backend:
- server.ts is responsable for every interaction with the servers and the frontend. It is the backbone of our backend. Functions like "signup", "login" or "authCheck" are handled here

- metrics.ts handles the storing metrics with the database and is responsible for inserting the metrics in a propper way like "username" + "#" + "timestamp" , insertedValue . Furthermore this file handles the GET function for metrics as well, where every user can see only his own metrics.

- user.ts same as metrics.ts but for users. It is responsible for saving and getting users from the user database.