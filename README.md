# Changeset Changelog Bitbucket

Generate changelogs from bitbucket repositories. Mimics what [`@changesets/changelog-github`](https://github.com/atlassian/changesets/tree/master/packages/changelog-github) does but for Bitbucket repositories.

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
