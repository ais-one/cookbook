## Guiding Principles

- Do not built technical debt
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
   - live share, collaborative development

Jest
- Automated Testing
  - Unit Test
  - Functional Testing
  - Integration Testing
- Test coverage Analysis


## Repository

Github is our version control system for the team to collaborate on code development effectively.

**Branch Organization**

- develop, all will eventually merge into this branch
  - [team branch]
    - [sub-team 1]
       - [sub-team ..N]
         - [username], branch by username
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

[[https://github.com/VisionGroupTech/Vision_RnD/blob/master/wiki-images/project.jpg|alt=project]]

## Tech knowledge repository

Github Wiki

We use the wiki to store and maintain technical knowledge

Document stack, how-tos, and other similar knowledge bases

---

## Code Quality & Security

### Dependency Security

Snyk - https://snyk.io/plans/

Continuously find and fix vulnerabilities in open source libraries and containers.

TBD more description on the work



[[https://github.com/VisionGroupTech/Vision_RnD/blob/master/wiki-images/snykjpg.jpg|alt=snykjpg]]

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

**CI/CD Integration**

Integrate with Jenkins, TeamCity, Azure Pipelines or any other CI

**Other alternatives studied**

1. Deepsource - https://deepsource.io

Limited language supported. Javascript which we use for web development is not supported

2. Veracode - https://www.veracode.com/

Limited information, no info, mainly on application security, which others can handle

---

## CI/CD

**CircleCI** - Automate your development process quickly, safely, and at scale.

1. VCS integration

CircleCI integrates with GitHub, GitHub Enterprise, and Bitbucket. Every time you commit code, CircleCI creates a pipeline.

2. Automated testing

CircleCI automatically runs your pipeline in a clean container or virtual machine, allowing you to test every commit.

3. Notifications

Your team is notified if a pipeline fails so issues can be fixed quickly. Automate notifications with our Slack integration.

4. Automated deployment

Passing pipelines are deployed to various environments so your product goes to market faster.

[[https://github.com/VisionGroupTech/Vision_RnD/blob/master/wiki-images/circle_ci.jpg|alt=circle_ci]]

Alternative: **AppVeyor**

---

Research In Progress

## Application Performance Monitoring APM
https://www.appdynamics.com/
https://www.datadoghq.com/
https://newrelic.com/

## Logging
https://logrocket.com/
https://www.splunk.com/
https://raygun.com/
https://sentry.io/welcome/
https://rollbar.com/

## User Behaviour Analysis

Analyze user behavior across your sites and apps

1. MixPanel https://mixpanel.com/home/
2. Google Analytics

