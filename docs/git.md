
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
```

### clone git repo without history

$ git clone ...
$ cd path/to/repo
$ rm -rf .git
$ git init

git clone --depth 1 <remote_repo_url>

https://www.atlassian.com/git/tutorials/comparing-workflows

