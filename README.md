# Chat application - Backend


## 1. Techstack
- Nodejs
- Express
- Websocket
- Redis Pub/Sub

## 2. Installation
### 2.1 Build app
```bash
docker-compose build
```
### 2.2 Create .env file
```bash
cp .env.template .env
```

### 2.3 Start Mongodb server
```bash
docker-compose up -d db
```
### 2.4 Add user
Note: `mongo` and `MONGO` is sample.
```bash
docker-compose exec db mongo -u mongo -p MONGO
```
In mongo shell, run following command.
```javascript
use chatapp;
db.createUser({user: "mongo", pwd: "MONGO", roles: [{role: "readWrite", db: "chatapp"}]});
```
Exit mongo shell.

### 2.5 Start app
```bash
docker-compose up -d app
```

