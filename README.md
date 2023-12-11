# uptime_project
A project for uptime


To run the project, please read the readme's that are in my-app and my-api, run them seperatly, on the same machine or not
Please add your own variables into .env inside of /my-app/.env

Create your own mysql database with user, and add the information into .env
Please make sure to up the amount of allowed connections to 1024 with this command in mysql the code will try to do this on its own aswell:
```sql
 SET GLOBAL max_connections = 1024
```
