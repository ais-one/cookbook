## Team Guiding Principles

- Do not build-up technical debt
  - balance between developing own code and using dependencies

- The tool or language should not get in the way of fulfilling business objectives and adapting to changes

## Tooling

VS Code
 - Integrated Development Environment
 - VS Code Plugins
   - eslint, to implement some standardisation on coding style and format
   - gitlens, to view and compare repositories
   - es6-string-html, formatting html in JS
   - vetur, syntax highlighting for VueJS
   - docker
   - live server ???
   - remote-WSL

Jest?
- Automated Testing
  - Unit Test
  - Functional Testing
  - Integration Testing
- Test coverage Analysis


## Repository

Github is our version control system for the team to collaborate on code development effectively.

**Branch & Organization**

- https://www.atlassian.com/git/tutorials/comparing-workflows


The overall flow of Gitflow is:

- A develop branch is created from master
- A release branch is created from develop (no new features, only bug fixes, documentation, etc.)
  - When the release branch is done it is merged into develop and master (master is tagged)
- Feature branches are created from develop
  - When a feature is complete it is merged into the develop branch
- If an issue in master is detected a hotfix branch is created from master
  - Once the hotfix is complete it is merged to both develop and master

Organize by User

- develop, all will eventually merge into this branch
  - [team branches]
    - [sub-team branches]
       - [sub-sub-team branches]
         - [username], branch by username
- uat
- staging
- master, latest milestone and associated releases
- [previous milestones and associated releases]


Note:

0. [] means more than 1 branch at that level, e.g. there can be multiple team branch, Team A, Team B
1. The feature or issue each user is working on will be in the Github Issue title
2. Avoid having more than 1 person working on the same file, if possible, to reduce conflict resolution requirements

## Merging Process

- We use git merge instead of git rebase
- each person will merge up the tree

```
# at aaron branch - add, and commit changes

# pull, push, push
git pull TeamA
git push origin aaron
git push origin TeamA

# later... move up to Team branch
git checkout TeamA

# pull, push, push
git pull develop
git push origin TeamA
git push origin develop
```

## Milestone and Semantic Versioning

For Milestone, we will follow [semantic versioning](https://semver.org/)

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards compatible manner, and
- PATCH version when you make backwards compatible bug fixes.
Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

## Issue Tracking

Github Issues

Each issue can represent a story which can be
- feature implementation
- enhancement
- bug fix, etc.

You can make your own sub tasks inside each issue


## Project Tracking (Agile & Scrum)

Github Projects & Milestones

Each project will represent a Major version change

Milestone will represent Minor version change

Each issue is a story (which can include sub tasks)
Issues are either in backlog, or milestone (very long sprint?)


## Tech knowledge repository

Github Wiki

We use the wiki to store and maintain technical knowledge

Document stack, how-tos, and other similar knowledge bases

---

## Code Quality & Security

### Dependency Security

Snyk - https://snyk.io/plans/

Continuously find and fix vulnerabilities in open source libraries and containers.


### Continuous Code Inspection

SonarQube - https://www.sonarqube.org/

- Reliability
  - Code Smells - duplicated code, complex code
  - Detect bugs - demonstrably wrong code, or code that is more likely not giving the intended behavior
- Security
  - Hotspots - potential parts of code for injection, xss and other attacks
  - Vulnerability - parts of codes that are at risk, e.g. exposure of secret keys
- Maintainability
  - Updating of aging code base

SonarQube is Opensource and is well regarded, with users in Singapore like Govtech, GIC, AXA Singapore, etc.

**Github Integration**

SonarQube analyzes branches and Pull Requests so you spot and resolve issues BEFORE you merge to master. Clean code becomes the norm!

SonarQube publishes Quality Gate and code metric results right in GitHub Checks (issues, bugs, vulnerability...)

---

## CI/CD

**CircleCI** - Automate your development process quickly, safely, and at scale.

1. VCS integration
2. Automated testing
3. Notifications
4. Automated deployment

Passing pipelines are deployed to various environments so your product goes to market faster.

## Multirepo, Monorepo, Submodules, SubTree
https://blog.breakpoint-technology.fr/choose-the-right-way-to-organize-your-code-in-a-git-repository-a900bf52e326