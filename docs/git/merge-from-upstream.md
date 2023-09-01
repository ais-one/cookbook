# Merge updates from upstream

## From Clone

### ref

- https://medium.com/geekculture/how-to-use-git-to-downstream-changes-from-a-template-9f0de9347cc2
- https://www.mslinn.com/git/700-propagating-git-template-changes.html

### steps

**initial setup**

```bash
git clone <template repo> <new repo>
git remote add upstream <template repo>
# git remote add upstream https://github.com/ais-one/my-template.git
git remote set-url --push upstream no_push
git remote -v
```

**updates**

```bash
# to get upstream updates
git fetch upstream
git merge upstream/main

# or if needed...
git merge upstream/main --allow-unrelated-histories
# or if using rebase...
git rebase upstream/main
# checkout code... if needed
git checkout --track origin/main

git push origin <branch>
```

---

## From FORK

### https://gist.github.com/0xjac/85097472043b697ab57ba1b1c7530274 - To Test

### Merge updates from upstream for private fork

The [repository](https://github.com/usi-systems/easytrace) for the assignment is public and Github does not allow the creation of private forks for public repositories.

The correct way of creating a private fork by duplicating the repo is documented [https://help.github.com/articles/duplicating-a-repository/]().

For this assignment the commands are:

```bash
 # 1. Create a bare clone of the repository. (This is temporary and will be removed so just do it wherever.)
git clone --bare git@github.com:usi-systems/easytrace.git

#  2. [Create a new private repository on Github](https://help.github.com/articles/creating-a-new-repository/) and name it `easytrace`.

# 3. Mirror-push your bare clone to your new `easytrace` repository.
#  > Replace `<your_username>` with your actual Github username in the url below.

cd easytrace.git
git push --mirror git@github.com:<your_username>/easytrace.git

# 4. Remove the temporary local repository you created in step 1.
cd ..
rm -rf easytrace.git

# 5. You can now clone your `easytrace` repository on your machine (in my case in the `code` folder).
cd ~/code
git clone git@github.com:<your_username>/easytrace.git

# 6. If you want, add the original repo as remote to fetch (potential) future changes.
# Make sure you also disable push on the remote (as you are not allowed to push to it anyway).
git remote add upstream git@github.com:usi-systems/easytrace.git
git remote set-url --push upstream DISABLE

git remote -v
# origin	git@github.com:<your_username>/easytrace.git (fetch)
# origin	git@github.com:<your_username>/easytrace.git (push)
# upstream	git@github.com:usi-systems/easytrace.git (fetch)
# upstream	DISABLE (push)

# > When you push, do so on `origin` with `git push origin`.

# > When you want to pull changes from `upstream` you can just fetch the remote and rebase on top of your work.
git fetch upstream
# or merge
git rebase upstream/master

# And solve the conflicts if any

```
