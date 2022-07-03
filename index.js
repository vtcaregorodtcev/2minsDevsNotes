const octokit = require("@octokit/core");

const client = new octokit.Octokit({ auth: process.env.ACCESS_TOKEN });

const DIVIDER = '<!-- Update Below -->';

async function run() {
  try {
    const readme = await client.request(`GET /repos/vtcaregorodtcev/2minsDevsNotes/contents/README.md`);

    const { path, sha, content, encoding } = readme.data;
    const rawContent = Buffer.from(content, encoding).toString();
    const startIndex = rawContent.indexOf(DIVIDER);

    const updatedContent = `${startIndex === -1
      ? rawContent
      : combineNewReadme(
        `${rawContent.slice(0, startIndex)}`,
        `${DIVIDER}\n`,
        `${process.env.ISSUE_DATA}\n`,
        rawContent.slice(startIndex + DIVIDER.length, rawContent.length)
      )}`;

    commitNewReadme(path, sha, encoding, updatedContent);
  } catch (error) {
    console.error(err);
  }
}

const combineNewReadme = (firstPart, divider, issueData, lastPart) => firstPart + divider + issueData + lastPart;

async function commitNewReadme(path, sha, encoding, updatedContent) {
  try {
    await client.request(`PUT /repos/vtcaregorodtcev/2minsDevsNotes/contents/{path}`, {
      message: "Update README",
      content: Buffer.from(updatedContent, "utf-8").toString(encoding),
      path,
      sha,
    });
  } catch (err) {
    console.error(err);
  }
}

run();
