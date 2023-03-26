---
external: false
title: "Cooking scrambled eggs: Imperative vs Reactive approaches."
description: "Let's use the analogy of making scrambled eggs to better understand imperative and reactive code, as well as pull and push modes."
date: 2023-03-26
youtubeVideoId: E-CHKd6bwYw
ogImagePath: /2minsDevsNotes/images/reactive_vs_imperative.png
tags:
  - "101"
  - reactivity
  - imperativity
---

Let's imagine we want to cook scrambled eggs and invite friends over for brunch. What might we need in this case?

To make scrambled eggs, we need milk and eggs, which we must purchase before we start cooking. You visit the grocery store's website, find milk and eggs, check their prices, and write down the total amount in smartphone notes. Let's say milk costs 7$, and eggs cost 8$, so you have 15$ written down in your phone notes.

Next, you log in to your bank's app and start placing an order for the delivery of the groceries. You indicate that you need milk and eggs and that you will pay 15$ for them. However, your order cannot be processed due to an error. While you were placing the order, the grocery store changed its prices, and milk now costs 9$, so the amount you are trying to pay no longer matches the actual total (9 + 8 = 17$).

Something similar happens when you write code in a popular programming language, such as JavaScript.

```js
let milk = 7;
let eggs = 8;

let sum = milk + eggs;
```

The code above is written in an imperative style. What does this mean?

It means that if you later assign a new value to milk:

```js
milk = 9;
```

the value of the sum will not change.

This is because the imperative style implies that you are explicitly describing step-by-step instructions to perform a computation, and the sequence of commands directly manipulates the program's state. In this case, the sum value was calculated based on the initial values of milk and eggs, and no further updates were made to it after the change in the value of milk.

To avoid this issue, you can use a reactive approach. How?

Instead of writing down the total sum of the products in your phone notes, you save a link to the grocery store's website. When you are ready to place the delivery order, you follow the link and obtain information about the current prices. Now your order can be successfully placed.

In JavaScript, this can be implemented as follows:

```js
let _milk = 7;
let _eggs = 8;

let milk = () => _milk;
let eggs = () => _eggs;

let sum = () => milk() + eggs();
```

When we reassign `_milk` to 9 and call `sum()` again, we will get the updated value.

This technique is used in modern JavaScript frameworks, such as Solid.js and Qwik. These frameworks provide a more efficient way of managing state updates and automatically handling dependencies, which can lead to better performance and easier maintenance of your code.

```tsx
import { createSignal } from "solid-js";

function GrocerySum() {
  const [milkPrice, setMilkPrice] = createSignal(7);
  const [eggsPrice, setEggsPrice] = createSignal(8);

  // Define a reactive function for the total sum
  const total = () => milkPrice() + eggsPrice();

  setMilkPrice(9);

  return <div>Total: ${total()}</div>; // 17
}
```

Additionally, it is said that these frameworks operate in a "pull" mode. This means that to compute a value, you need to literally "pull" all the dependent variables. In other words, the value is recalculated only when explicitly requested, rather than being automatically pushed to all dependent components upon a change.

All right, we've covered pull reactivity. Let's consider another example.

Suppose we successfully ordered the groceries. If we continue to follow the imperative approach, we must execute the instructions one after another. As a result, we followed the sequence:

![cook eggs sequence](https://mermaid.ink/svg/pako:eNpVjr0KwjAQgF8l3BShfYEMQn9EBScdXLIczbUNNYmkaUVK3920KuhNd9_3DTdB5RSBgPrmHlWLPrDTWVoWJ-N7CqzxriKvqd-wNN2ynF-xb3_ou81XWfDCue6DihWV_GhHHYjVsbbq25er3PEDjlEN9g9nywEJGPIGtYrPTQuREFoyJEHEVaHvJEg7xw6H4C5PW4EIfqAEhrvCQKXGxqMBUeOtp_kFfKpGfQ)

However, there's a nuance here. If one of our friends is lactose intolerant, we should consider this at the earliest stage - while purchasing groceries. This creates a dependency on future instructions, which can make writing and maintaining code in an actual application more challenging.

Indeed, the reactive approach can also be helpful in this situation, particularly when using the push mode.

Instead of having a single "invite friends" instruction, we will have two instructions: "invite friends who can tolerate lactose" and "invite friends who are lactose intolerant."

Both of these instructions should be subscribed to an event related to the purchase of groceries. As soon as the event occurs, the control flow moves to one of the instructions.

![push branch of event development](https://mermaid.ink/svg/pako:eNptjr0KwkAQhF9l2cqAvkAKRVFsxEIr4ZrlbmMO70cuG0WSvLsXFbFwqmVmvmE71NEwlli5eNc1JYHdQQXIWk62LOCtuxQwm81h1e1IS2wYqsS8GN6t1Zj1J256WE9suFkZc8vBNHCvI1BicB_OBomOEwUpfuF97GHzj9UU4E3Id-RF4hQ9J0_W5M-70VEoNXtWWObTULooVGHIPWolHh9BYymp5Sm2V5PX1pbOiTyWFbmGhycJgVdd)

In other words, the event about the purchase literally pushes the choice of a particular branch of event development.

The RxJS library operates in a similar way. We could create observables for lactose-free milk and lactose-containing milk, and subscribe to these observables to determine which friends to invite:

```ts
import { BehaviorSubject } from "rxjs";

const lactoseFreeMilk$ = new BehaviorSubject(false);

lactoseFreeMilk$.subscribe((isLactoseFree) => {
  if (isLactoseFree) {
    console.log("Invite lactose intolerant friends");
  } else {
    console.log("Invite friends who can tolerate lactose");
  }
});

// Later, when you know whether the milk is lactose-free or not:
lactoseFreeMilk$.next(true); // or false, depending on the actual situation
```

In conclusion, considering different programming paradigms and techniques is essential for creating code that is more maintainable, flexible, and efficient.

Pull reactivity, push reactivity, declarative programming, inversion of control, and event-driven programming are some of the approaches that can be employed to achieve this goal. Understanding the strengths and weaknesses of each approach, as well as how to use them effectively, can greatly benefit developers as they create and maintain complex applications.
