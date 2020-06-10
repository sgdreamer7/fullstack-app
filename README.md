**Fullstack app boilerplate**

This is ready to use fullstack application which runs in docker containers in the standalone mode
or in blue/green setup.

**Folder structure**

- backend-< backend type > - root folder for the application backend sources
- frontend-< frontend type > - root folder for the application frontend sources
- environments - environments
  - development - development environment
  - production - production environment
  - staging - staging environment
  - testing - testing environment

**Usage**

**Standalone mode:**

```bash
git clone https://github.com/sgdreamer7/fullstack-app.git
cd fullstack-app
./standalone build
./standalone start
./status all
./standalone logs frontend --follow
./standalone stop
```

**Blue/Green mode:**

```bash
git clone https://github.com/sgdreamer7/fullstack-app.git
cd fullstack-app
./blue-green-router build
./blue-green start
./status all
./blue-green deploy
./blue-green stop
```
