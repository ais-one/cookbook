## React & Nest Getting started

### Nest

```bash
npm i
npm run start:dev # create the SQlite database called db.sqlite (in actual should be created using migration) 
# shutdown server once it is fully up and running
node seed.js # seed the data
npm run start:dev # start the server again
```

http://127.0.0.1:3000

### React

```
npm i
npm run start
```

http://127.0.0.1:3001

admin@test.com / password

You can use the test.http file with VS Code REST Client plugin to test enpoints

### Project Installation

npx @nest/cli new nest-admin --skip-git

npm i @nest/cli
npx nest new <project> --skip-git

npx create-react-app react-admin --template typescript

---

### nest-admin


NOTES:
- add module, then controller, then service

TBD:

1. Add One-to-one map in Order -> User (logged in user)
2. Add Item, Create New Order If 1st item (logged in user)
3. Remove Ite, Delete Order if last item (logged in user)
4. exportCSV to use logged in user
5. add swagger/openapi
6. add websockets


SELECT SUBSTR(created_at, 0, 11) as date, SUM(oi.price * oi.quantity) as "sum" FROM "order" o JOIN order_item oi ON o.id = oi.order_id GROUP BY date;

# create modules, controller, service, dtos, etc...
nest g resource users --no-spec

---

### react-admin

- add loading spinner


### nest-Microserice

https://www.merixstudio.com/blog/microservice-nestjs/