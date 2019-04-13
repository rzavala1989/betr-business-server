# Do Betr Business [API]

Server API for DBB client.  

* Create - Add an expense
* Read - Get a list of all current expenses by date or amount
* Update - Update expense info
* Delete - Delete expense
## Built With

### Back End
* Node.js
* Express
* Mongo
* Mongoose
* JWT Authentication
* bcryptjs
* Passport
* Mocha
* Chai

### DevOps
* Heroku
* TravisCI
* mLab

## Using the API

### Authentication / Login
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/auth/login

* Bearer Authentication with JSON Web Token
* Must supply valid Username and Password in request header
* If authentication succeeds, a valid 7d expiry JWT will be provided in response body

### Register New User
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/users 

* Must supply First name, Last name, Username and Password in request body
* If successful, a valid 7d expiry JWT will be provided in response body

### Get All Expenses
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/expenses/

* This endpoint retrieves all expenses from user database
* Must supply valid JWT via Bearer Authentication
* If authentication succeeds, all expenses will be returned


### Add Expense
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/expenses

* This endpoint adds a single expense to user database
* Supply expense object in request body
* Must supply valid JWT via Bearer Authentication


### Update Expense
##### PUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/expenses/{EXPENSE-ID-GOES-HERE}

* This endpoint updates a single expense in user database
* Supply expense ID as route parameter
* Supply expense object in request body
* Must supply valid JWT via Bearer Authentication

### Delete Expense
##### DELETE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/expenses/{EXPENSE-ID-GOES-HERE}

* This endpoint deletes a single expense from user database
* Supply expense ID as route parameter
* Must supply valid JWT via Bearer Authentication


