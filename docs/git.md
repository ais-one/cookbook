## git

### Commands

```
git add .
git commit -m "msg"
git push origin <branch>
git checkout <branch>
git checkout -b <new branch>
git branch
git branch -D <branch>
git log
git status
git merge <from branch>
git diff
git pull origin <branch>
git remote -v
git remote set-url origin git@hostname:USERNAME/REPOSITORY.git
git remote set-url httpsorigin https://hostname:USERNAME/REPOSITORY.git
git remote add neworigin https://github.com/user/repo.git
git remote rm someorigin
git reset --hard
git commit -am "some message"

# remove file or folder from tracking
git rm --cached <file>
git rm -r --cached <folder>
```

### clone git repo without history

$ git clone ...
$ cd path/to/repo
$ rm -rf .git
$ git init

git clone --depth 1 <remote_repo_url>

https://www.atlassian.com/git/tutorials/comparing-workflows


## Commit messages

https://www.alibabacloud.com/blog/how-can-we-standardize-git-commits_597372


Format of Commit Message
<type>(<scope>): <subject>

### Type (required)

This indicates the type of the git commit. Only the following types are allowed:

- feat: Introduces a new feature.
- fix/to: Fixes a bug found by QA or developers.
- fix: Generates diff and automatically fixes a bug. This is used to fix bugs with a single commit.
- to: Only generates a diff instead of automatically fixing the bug. This is used for multiple commits. Then, you can use fix for the commit when you finally fix the bug.
- docs: Commits documentation only changes.
- style: Commits format changes that do not affect code running.
- refactor: Commits a code change that neither fixes a bug nor adds a feature.
- perf: Commits optimization changes, such as to improve performance and experience.
- test: Adds tests.
- chore: Commits changes to the build process or supporting tools.
- revert: Rolls back to the previous version.
- merge: Merges code.
- sync: Synchronizes bugs of the main thread or a branch.

### Scope (optional)

Scope is used to describe the scope of the impact of a commit, such as the data layer, control layer, or view layer, depending on the project.

For example, in Angular, it can be location, browser, compile, rootScope, ngHref, ngClick, or ngView. If your modification affects more than one scope, you can use * instead.

### Subject (required)

The subject is a brief description of the purpose of a commit. It can be up to 50 characters in length. Do not end with a period or other punctuation marks.

Therefore, the git commit message will be in the following formats:

```
Fix(DAO): User query missing the username attribute
feat(Controller): Development of user query interfaces
```


https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53


References in commit messages
If the commit refers to an issue, add this information to the commit message header or body. e.g. the GitHub web platform automatically converts issue ids (e.g. #123) to links referring to the related issue. For issues tracker like Jira there are plugins which also converts Jira tickets, e.g. Jirafy.

In header:

```
[#123] Refer to GitHub issue…
CAT-123 Refer to Jira ticket with project identifier CAT…
```

In body:

```
Fixes #123, #124
```

https://wiki.openstack.org/wiki/GitCommitMessages


## Github

### Github pages

https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f

```bash
npm i -D gh-pages
```

package.json
```json
{
  "homepage": "http://<username>.github.io/<repo-name>",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d <build folder>"
  }
}
```

## Git Hooks

- https://dev.to/krzysztofkaczy9/do-you-really-need-husky-247b
- https://dev.to/azu/git-hooks-without-extra-dependencies-like-husky-in-node-js-project-jjp


### commitizen

```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

.git/hooks/prepare-commit-msg

```bash
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```

### semantic-release

- https://github.com/semantic-release/semantic-release
- https://github.com/semantic-release/semantic-release/tree/master/docs/recipes
