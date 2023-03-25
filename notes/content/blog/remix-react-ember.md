---
external: false
title: Remix is like ember but only it's react and SSR as well.
description: ""
date: 2022-07-08
tags:
  - Ember
  - React
  - Remix
---

I bet this is not the first time you might see such comparison in terms of learning a remix.run. And this is not surprising. As the authors say, they were inspired by the technologies that we have been using almost since the dawn of the web. Perhaps the most interesting comparison was made by one of the authors of remix in [Reactathon](https://www.youtube.com/watch?v=95B8mnhzoCM&ab_channel=RealWorldReact), comparing it with PHP.

And they are indeed connected. Remix follows the MVC pattern that was popular with early web frameworks. Remix keeps control of the view and controllers, and leaves the model layer to the responsibility of a developer. And to figure this out, we need to go back to Ember.

Ember is one of the first MVC frameworks that appeared more than 10 years ago. And, when the ideas for its creation were gaining strength, the key one was the idea that the browser address bar or URL is the key place of the entire application. The entire state of the application can be described in the URL, using a large number of possibilities for this like paths, query parameters, hashes. That is why applications on Ember are also called purely browser-based.

How does this bring us closer to the remix? If we open the documentation, we will see [such a line](https://remix.run/docs/en/v1/pages/technical-explanation) that the remix is a compiler for react-router. And it is not difficult to see that the authors of the react-router itself tried to repeat the success of the router implemented in Ember. From here we can conclude that the remix is a descendant of Ember, but which has the features inherent in the react ecosystem.

The documentation itself, of course, says that the remix is not only about React, and that the Remix is just a handler that can process any framework, but still gives a postscript that it will work best with React.

Let's look at it closer.

What is the unique experience of working with a remix, about which the creators say "mind-shift". Most likely, this is a [truly unidirectional data flow](https://remix.run/blog/remix-data-flow).

We have already figured out that the remix inherits the react-router technique, only now it is not necessary to declare all the routes in one place. The router becomes file based. And each separate route is described in its own file. Now, if we return a function called `loader` from the route file, [we can load](https://remix.run/docs/en/v1/guides/data-loading#basics) the data before it is rendered and immediately transfer the fulfiled html to the client.

But we have already seen a similar technique [in nextjs](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props). Nothing special here. Another feature is that by returning a function named `action`, we close the unidirectional data flow cycle, because action also works on the server side and any processing in action causes the loader to be reloaded, which allows us to have up-to-date data on the client.

To implement this on the nextjs, we would need a separate data layer with [`react-query`](https://prateeksurana.me/blog/mastering-data-fetching-with-react-query-and-next-js/) or other similar tools. But this is a topic for a separate note.

And if we touched comparisons with nextjs, it makes sense to also highlight some negative points regarding dx. Because dx is one of the key benefits of nextjs.

- although the examples are presented in the repository, there is no clear command on how to use such an example. I would love to run an example in one line. Fortunately, [`degit`](https://github.com/Rich-Harris/degit) allows you to solve this;
- also in the examples there are deprecated dependencies;
- there is no built-in ability to infer data types from the loader, you need to do it manually;
- styles for components can only be described in css format, unless you do not want to compile styles from other preprocessors before starting the application. Because of this, there is no clear vision on how to organize isolated styles.

As you can see, the remix is not without childish problems that are solved in other tools, but it is worth making allowances for the fact that the remix is very young and the architecture still has the flexibility to accommodate such wishes.
