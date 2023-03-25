---
external: false
title: Automatization for github-based blog.
description: ""
date: 2022-07-10
tags:
  - automatization
  - github-actions
---

The need to share knowledge is truly an amazing human trait. He can sit for years and rewrite the same book by hand, only to create as many copies as possible, which can then be given to other hands who will do the same.

Fortunately, today, information sharing processes have evolved a lot and every second yet another developer is already thinking about blogging and sharing his experience with other colleagues. I also consider myself one of those developers.

On the other hand, most developers are very lazy, but this is exactly what makes them more productive. No one lazy person wants to do the same job more than once, which is a common occurrence in a developer's routine. All of the above smoothly brings us to the topic of this note.

## Choose tools for your task not task for your tools

If you are reading this article, then most likely you have already noticed that I chose github as the platform for my blog. I find this solution extremely convenient and here's why.

Like I said, I'm one of those lazy developers who try to optimize their routine. And why look for a new platform if I spend the whole day on github, working with code. And the key feature here, I think, is the ability to write issues in markdown format. The ability to write technical stories with code inserts makes github almost the best platform, especially when you can mention related technologies and the people who make them.

Also, another important feature of the github, available out of the box, is SEO and optimization in search engines. This means that a developer writing a blog saves a huge amount of time and money on promotion. Well, the last thing that can be said, but not least - you don't need to work on design and styles what allows you to focus only on the content itself.

With the huge pluses listed above, we also inherit some minor inconveniences. But, which we can solve, again, by the abilities of the github itself. What I mean?

First, due to the fact that the repository is public, anyone can come and open their own issue, which is of course not a desirable scenario. It is possible, of course, to completely disable issues, but then we ourselves will not be able to write them. Here another github feature comes to the rescue. Github actions.

We need an automatic mechanism that, when another issue opened, will check who did it. If this is the author of the repository himself, then everything is OK, otherwise it will delete opened issue.

And the first thing we need to do for this is to fork [the repository](https://github.com/actions/typescript-action) with the base action template on typescript. Further, having cleared the template of garbage (unnecessary tests and actions), you can start writing your action.

Any github action repo should contain an `action.yml` file in root that describes all input and output parameters.

```yml
# action.yml
inputs:
  github_token:
    description: "Personal access token with admin rights granted."
    required: true
  issue_node_id:
    description: "Issue NodeId to delete"
    required: true
runs:
  using: "node16"
  main: "dist/index.js"
```

Further, [referring to the documentation](https://docs.github.com/en/issues/tracking-your-work-with-issues/deleting-an-issue), we can see that in order to delete an issue, we need admin write permissions and a [standard authorization token](https://docs.github.com/en/actions/security-guides/automatic-token-authentication) that github generates itself and puts in `secrets.GITHUB_TOKEN` will not work. Therefore, we need to generate our own personal token for this action. [[Instruction]](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

Next, we are going to look among the API documentation for how we can delete the issue, and what parameters are needed for this.

We find out that the github has a [graphql endpoint](https://docs.github.com/en/graphql/reference/mutations#deleteissue) that allows us to delete the issue. Unfortunately, there is no such endpoint for the REST protocol, but this is not a problem. Github supports the [npm package](https://www.npmjs.com/package/@actions/github), which allows us to create an authorized client and make a request in the form of a mutation on the graphql.

```ts
import * as core from '@actions/core'
import * as github from '@actions/github'

...

const token: string = core.getInput('github_token')
const issueNodeId: string = core.getInput('issue_node_id')

const octokit = github.getOctokit(token)

await octokit.graphql(`mutation {
    deleteIssue(input: { issueId: "${issueNodeId}" }) { ... }
}`)
```

The global id of the issue, which is called `node_id`, must be passed as the parameter for this mutation. We can get it by [subscribing to the issue opening event](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#issues) in the workflow config file.

```yml
# .github/workflows/your-delete-issue-workflow.yml
on:
  issues:
    types: [opened]
jobs:
  delete-issue:
    ...
    steps:
      - uses: vtcaregorodtcev/delete-issue@main
        with:
          github_token: ${{ secrets.PERSONAL_TOKEN }}
          issue_node_id: ${{ github.event.issue.node_id }}
```

You can see the final version of github action in [a separate repo](https://github.com/vtcaregorodtcev/delete-issue) and even use it in your projects. Also the way this action used in this blog also presented [here](https://github.com/vtcaregorodtcev/2minsDevsNotes/blob/main/.github/workflows/new-issue-guard.yml).

Further, in the blog's repository, we set in the config that it is necessary to delete an opened issue only when the creator is not the owner of the repository. Now this is only our platform and an outsider will not be able to open an issue that is not related to our blog.

```yml
# .github/workflows/your-delete-issue-workflow.yml
...
jobs:
  delete-issue:
    if: github.event.issue.user.login != 'vtcaregorodtcev'
    ...
```

The full list of available properties on issue object you can find [here](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#webhook-payload-example-when-someone-edits-an-issue).

And finally, there is one more small automation. It would be very nice, when adding a new issue, to update the entire list of open issues in the README file. But fortunately, [@geraldiner](https://github.com/geraldiner) has already dealt with this problem and prepared a solution, which can be found at [the link](https://github.com/geraldiner/projects-readme-tutorial).
