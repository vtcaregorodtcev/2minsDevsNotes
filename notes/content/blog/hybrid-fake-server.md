---
external: false
title: How and why to set up a hybrid fake server?
description: ""
date: 2022-06-30
tags:
  - API
  - http-proxy-middleware
  - json-server
---

Very often, when a new web project is about to start, all developers start to code at the same time, which means that there is no ready-made API for the frontend. In this case, developers get out of this situation by creating their fake API so as not to be idle.

And of course, for these needs, there are a huge number of tools. One of the most convenient is [`json-server`](https://github.com/typicode/json-server).

The main concept of this package is very simple. We should create a JSON file with a structure of all the entities that are needed in our application. Then we just run the following and we get the REST API in one line of code.

```js
// db.json
{
    "products": [{ "id": 1, "name": "name", ... }, ...]
}
```

```bash
json-server --watch db.json
```

We can fetch data using GET requests (or see them just in the browser) and write new items directly to JSON using POST requests.

But there is one caveat. If more than one developer works on a project, then most likely everyone will want to use such JSON in their way. Therefore, the content of such JSON will be constantly changing, which will lead to constant conflicts, which in turn will take time. Nobody wants to fix conflicts in files that won't be needed at all later. Therefore, it makes sense to add such a file to the `.gitignore`. So that each developer works with his version of the database.

Getting rid of one problem, we stumble upon another. What to do now if a new developer comes?

- they need to refill the database themselves;
- they need to know the set of fields for each entity so that the application can adequately process them.

All this again leads to wasting time on communication and sending files in messengers. Therefore, we need a mediator who will do all this for us.

Some analogue of `faker.js` immediately comes to mind. We will write a script once that will create a database for us and then each developer will be able to use it.

```js
const createProduct = () => ({
    price: faker.commerce.price(100, 200),
    description: faker.commerce.productDescription()
    ...
})
```

This way will work, but it's another item to maintain. We will need to keep it up to date. And if custom fields are not required or the backend part is almost ready, then you can delegate the creation of this database to another service. For example [`FakeStoreAPI`](https://github.com/keikaavousi/fake-store-api).

I find this approach very convenient:

- developers do not waste time creating and maintaining their database;
- developers still can modify and add new entities through a fake API;
- none of these changes affect other developers, no need to resolve conflicts.

But then you will ask "how to modify data on a remote server without write permissions?". It's simple, we don't need to. We still have our local JSON server running, which allows us to write entities to our local JSON file. We just need to rewrite the read requests. To do this, there is a middleware mechanism from the JSON server documentation.

We can use the [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) package for such purposes and then just create a `proxy.js` file.

```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = createProxyMiddleware("/products", {
  target: "https://fakestoreapi.com",
  secure: false,
  changeOrigin: true,
});
```

Restart the server with the following arguments:

```bash
json-server --watch db.json --middlewares ./proxy.js
```

Et voilà. The remote database is immediately available to us, and if we need to create a new entity, then it will be created locally. For example, we can fetch products from a remote database but we also can create a cart or order locally.

```bash
curl -X POST http://localhost:3004/orders
   -H 'Content-Type: application/json'
   -d '{"userId": 1, "products": "1,2,5"}'
```
