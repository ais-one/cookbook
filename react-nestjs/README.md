npx @nest/cli new nest-admin --skip-git

npx create-react-app react-admin --template typescript


### Nest


NOTES:
- add module, then controller, then service

TBD:

1. Add One-to-one map in Order -> User (logged in user)
2. Add Item, Create New Order If 1st item (logged in user)
3. Remove Ite, Delete Order if last item (logged in user)
4. exportCSV to use logged in user


SELECT SUBSTR(created_at, 0, 11) as date, SUM(oi.price * oi.quantity) as "sum" FROM "order" o JOIN order_item oi ON o.id = oi.order_id GROUP BY date;


### React

- add loading spinner
