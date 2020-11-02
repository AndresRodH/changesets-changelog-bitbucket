# changesets-changelog-bitbucket

Generate changelogs from bitbucket repositories. Mimics what [`@changesets/changelog-github`](https://github.com/atlassian/changesets/tree/master/packages/changelog-github) does but for Bitbucket repositories.

## Motivation

We use Bitbucket at our company and use `standard-version`. In my opinion and what we've experienced using `standard-version`, I concluded it did not fit our team's necessities. Due to lack of tooling in Bitbucket, it is pretty difficult to keep the conventional commits structure since there is no _easy_ way to add a build check for the merge commit or adding a plugin to format it for you. Manually fixing or adding changelog entries is something we should **_not_** be doing and rather focus on deliverables.

I like how `@changesets/changelog-github` formats the changelog entries and wanted to have the same functionality for our project. I tried to look for a package that offers this but there was not one available at the moment, so I decided to roll one by mimicking what the official one does for Github.

## Instalation

```bash
# using yarn
yarn add -D changesets-changelog-bitbucket

# npm
npm install --save-dev changesets-changelog-bitbucket
```

## Configuration

In your `.changeset/config.json` file:

```json
{
  "changelog": [
    "changesets-changelog-bitbucket",
    {"repo": "atlassian/atlaskit"}
  ]
}
```

Add a `.env` file with BITBUCKET_USERNAME and BITBUCKET_PASSWORD

```env
BITBUCKET_USERNAME=username
BITBUCKET_PASSWORD=password
```
