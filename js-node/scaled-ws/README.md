## Introduction

This is an example of scaling up websockets using Redis Pubsub, it also includes
- upgrade event and authentication
- setting an id

## References

- https://tsh.io/blog/how-to-scale-websocket/
- https://socket.io/docs/v4/using-multiple-nodes
- https://socket.io/docs/v4/adapter
- https://redislabs.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/
- https://www.shebanglabs.io/horizontal-scaling-websocket-on-kubernetes-and-nodejs/
- https://www.telerik.com/blogs/websockets-vs-server-sent-events (Websockets vs SSE)

## Usage

Redis should be available on its default port on localhost

```
npm i
npm start -- 3000
npm start -- 3001
```

Use the following website to test

https://www.websocket.org/echo.html

connect 3 clients to 3000
connect 2 clients to 3001

See output when sending message from a client (currently client that sent will also receive its own message)

## Notes

If going through a proxy such as load balancer, need sticky sessions

TBD: handle duplicate message to message originator client on subscription message
