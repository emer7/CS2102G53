# Lending King
**CS2102 Group 53 Project**

The application consists of 2 parts:
1. Backend (`express`) developed on ExpressJS with Postgres as database.
2. Frontend (`my-app`) developed on ReactJS using create-react-app.

The application is automatically deployed to Heroku from the latest commit on `master` branch.
Accessible from https://cs2102-53.herokuapp.com

To run the app locally (you will need to host your own database):
1. Clone the repo.
2. Create a file named `.env` for the environment variable. Edit the content of the file as follow (change `xxx` accordingly):
```
DATABASE_URL=xxx
PORT=xxx
SSL='false'
SESSION_SECRET=xxx
```
3. `yarn build` to install and build all the packages and the application.
4. `yarn start` to start the application.
