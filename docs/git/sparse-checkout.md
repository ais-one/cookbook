https://www.baeldung.com/ops/git-clone-subdirectory


```bash
git clone --depth=1 https://github.com/<org/user>/<repo>.git
cd <repo>
git sparse-checkout set --no-cone <sub-directory>

# e.g. The ‘!*/tomcat-app’ pattern directs the command to ignore any child resource named tomcat-app in the sibling subdirectories of the tomcat-app subdirectory:
# git sparse-checkout set --no-cone tomcat-app/ '!*/tomcat-app'

# git sparse-checkout add webservices
# git sparse-checkout disable
```