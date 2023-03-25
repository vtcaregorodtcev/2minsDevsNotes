---
external: false
title: Basic D3.js components tree visualization feat. chatGPT.
description: ""
date: 2023-03-15
ogImagePath: /images/chatgpt_d3js.png
tags:
  - "101"
  - chatGPT
  - D3.js
---

Before starting this small project, I had heard of D3.js but had never worked with it before. I had not even opened the documentation. Therefore, I decided to experiment with ChatGPT to see how well the neural network could understand what I wanted, even when I was not in the context of what I was asking for.

Now that I am writing this note, I already have a basic understanding of how D3.js works and can probably do similar tasks on my own.

So, the first thing I did was to try to ask for the final result right away, without looking at any examples or documentation. Even though the response from the neural network could not fit within the character limit for the response and had some syntactical errors, the code did not run. Here comes the first insight: D3.js has several versions with breaking changes, and the neural network combined examples from different versions, which led to the code breaking.

To avoid this issue, we can use one of the latest versions that were released before the neural network's dataset was closed in 2021:

`<script src="https://d3js.org/d3.v6.min.js"></script>`

Next, even in that broken version, the silhouette of our application's code is outlined.

```js
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g");
```

D3 works with SVG and performs all manipulations with this format. To start working, we need to create a workspace (SVG), set its attributes, and add a "g" element to group other elements that we will add later.

What are these elements?

As we are going to visualize a component tree, the neural network suggests that we need two types of elements: nodes and links that connect these nodes.

In D3, it looks like this.

```js
nodes = svg
  .selectAll("foreignObject")
  .data(data.nodes)
  .join("foreignObject")
  .attr("width", 100)
  .attr("height", 50)
  .html(function (d) {
    return d.content;
  });

links = svg.selectAll("line").data(data.links).join("line");
```

Nodes are created using foreignObject. This tag allows using SVG from a different namespace and is often used for custom HTML content.

The syntax `.selectAll.data.join` means that we are selecting all the current elements of a particular type (just like "document.querySelector"), then we match each element on the SVG with a real object in the code, and finally call join for those data.something elements that do not have a corresponding element on the SVG canvas.

For example, in the code snippet above, we select all foreignObject elements and bind them with data.nodes, then set their width and height attributes to 100 and 50 respectively, and add HTML content to each of them using the "d.content" function. Similarly, we select all line elements and bind them with data.links using the same syntax.

Accordingly, after calling this code, all corresponding elements for data.nodes and data.links will be drawn on the svg.

To get the full picture, let's look at an example node and link:

```js
// node
{
    id: 1,
    depth: 0,
    name: "name a",
    content: '<div class="node">ROOT</div>',
},

// link
{
    source: 1,
    target: 2,
}
```

For nodes, we specify the id, and links show how nodes are connected to each other through source and target.

In principle, the basic example is finished. We load data about nodes, create links, and feed them to D3.js. However, if there are too many elements, the nodes will overlap each other, which doesn't look very good. Let's seek help from the neural network.

And then it immediately recommends using forceSimulation, a set of functions for simulating physical bodies, to, for example, prevent nodes from visually overlapping on an SVG element.

```js
simulation = d3
  .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
  .force(
    "link",
    d3
      .forceLink() // This force provides links between nodes
      .distance(200) // how long links should be
      .id(function (d) {
        return d.id;
      }) // This provides the id of a node
      .links(data.links) // and this the list of links
  )
  .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
  .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the centre of the SVG area
  .force("collide", d3.forceCollide().radius(75))
  .force(
    "y",
    d3
      .forceY() // on which level each node is supposed to be
      .strength(1)
      .y((d) => d.depth * 250)
  )
  .on("tick", ticked); // callback for each time tick
```

After applying `forceSimulation`, we get a nearly perfect implementation of the visualization.

You can see an example at the [following link](https://jsfiddle.net/tn6mukq9/2/).
