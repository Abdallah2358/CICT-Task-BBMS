## Dependencies
- NodeJs version +20 
- MySQl version +8

## Description 
    This a blood bank management system used to help blood banks connect their systems to hospitals and donors to facilitate its operations.

## Running the project locally

- Install node modules
    > ` npm install`
- Update Database Credentials
  1. create a database named `bbms` in MySQL   
  2. make copy the `.env.example` and name it `.env`
  3. open `.env` in your editor
  4. update  the `DB_USERNAME` with your database connection user name
  5. update  the `DB_PASSWORD` with your database connection password
  
- Run Migrations
    ```bash
        cd ./database/
        npx sequelize-cli db:migrate
    ```
- Run the project
    > `npm run start`

- Open project in browser using [http://localhost:3000](http://localhost:3000)

## ERD 
> [link](https://dbdiagram.io/d/BBMS_DB-653c9dbfffbf5169f09fcf8f)
