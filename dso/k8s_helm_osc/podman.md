## Install On Windows

Reference: https://www.redhat.com/sysadmin/run-podman-windows

1. download zip from https://github.com/containers/podman/releases
2. unzip to devtools folder
3. add to user env /c/devtools/podman-4.3.1/usr/bin
4. test using podman --help
5. require WSL and admin (wsl --install) => set username/password
6. commands
   - podman machine init (1st time or after machine removal)
   - podman machine set --rootful
   - podman machine start
   - podman machine stop (to stop machine)
   - podman machine list (to list machines)
   - podman machine rm <machine name> (to remove a stopped machine)
7. configure CR for podman
   - podman search <rhel>
   - podman pull <rhel>
   - podman run [options] <rhel>:<tag> echo "Hello World"
     - -d run in background
     - --name <some name>
     - -t create pseudo terminal
     - -i interactive (keep STDIN open even if not attached)
     - -e KEY=Value
     - -p 8080:80 (host port to exposed container port)

```bash
# test out podman
podman run --name mysql-test -e MYSQL_USER=user -e MYSQL_PASSWORD=pass -e MYSQL_DATABASE=items -e MYSQL_ROOT_PASSWORD=root -d rhscl/mysql-57-rhel7:5.7-3.14
```

? docker.io/library/mysql

8. setup podman to allow insecure registries - NOT NEEDED

## Usage

### build image locally & test

```bash
podman build -t <project>/<image>:<tag> .
podman run -p 8080:8080 --rm -it <project>/<image>:<tag>
```

### login to registry, tag & push

```bash
# might need to restart if there is a problem
podman login -u <user> --tls-verify=false <image registry host>
# password is SHA token from oc login

podman tag <image>:<tag> <image registry host>/<project>/<image>:<tag>
podman push --tls-verify=false <image registry host>/<project>/<image>:<tag>

# to check on OS Cluster
# oc get imagestream
# or check Builds -> ImageStreams
```

### Some Sample Commands

```bash
podman exec -it mysql-test /bin/bash
podman container stop -a
podman container ls -a

podman build -t <NAME>:<TAG> <DIR to Dockerfile>
```
