reasons ocl needs to be redeployed for each event - priorities for dev

* new cube list (update in OCL Data sheet then run scripts/initialize.js)
* update chat colors (commit + push to github, fetch, install and build)
* update owned/wishlist cards (create file, update ocl.ini and push to ocl-app/data/, then scripts/initialize.js)

reasons it does not need to be redeployed:

* adding a new event, just push ocl.ini and `mutation{dataSync}` (see below)
* adding new players, add to latest event sheet and `mutation{dataSync}`

todo: All items should be added to discord bot functionality


## new event sheet
```
cd ~/Projects/ocl-app/backup/config
scp ocl:~/ocl-app/config/ocl.ini .
code ocl.ini
```
* add `<eventId>=<sheets id>` under `[eventSheets]` and save
```
scp ocl.ini ocl:~/ocl-app/config
```
* execute `mutation{syncData}` against onlinecubeleage.com/api/data

## redeploy ocl-app from scratch 
### (all steps not needed for everything)

*  ocl-tundra only steps
```
ssh ocl 'sudo reboot'

## wait a couple minutes
ssh ocl
screen
sudo /opt/bitnami/ctlscript.sh stop apache
sudo /opt/bitnami/ctlscript.sh stop redis
sudo service mongod start
```

* general steps, from ocl:~ or ocl-app project folder
```
cp -r ocl-app/data backup
cp -r ocl-app/google-auth backup
cp ocl-app/config/ocl.ini backup/config
sudo rm -rf ocl-app
git clone https://github.com/oelarnes/ocl-app
mkdir ocl-app/data
cp -r backup/google-auth ocl-app
cp -r backup/data ocl-app
cp backup/config/ocl.ini ocl-app/config
cd ocl-app
export OCL_ENV=prod
sudo npm install
npm run build
node scripts/initialize_ocl.js
sudo npm run start
```

# new dek files
* correct, up-to-date `data/owned*`, `data/wishlist*` and `config/ocl.ini` files locally
```
ssh ocl 'rm backup/data/owned*'
ssh ocl 'rm backup/data/wishlist*'
scp data/owned* ocl:~/backup/data
scp data/wishlist* ocl:~/backup/data
scp config/ocl.ini ocl:~/backup/config
ssh ocl
rm ocl-app/config/ocl.ini
rm ocl-app/data/owned*
rm ocl-app/data/wishlist*
cp backup/config/ocl.ini ocl-app/config
cp backup/data/owned* ocl-app/data
cp backup/data/wishlist* ocl-app/data
```
* execute `mutation{syncData}` against onlinecubeleage.com/api/data

# push new event files
* copied from dw email to `data/events/<eventId>`

```
scp data/events/<eventId>/* ocl:~/ocl-app/data/events/<eventId>
ssh ocl 'cp -r ~/ocl-app/data/events/<eventId> ~/backup/data/events'
```

* execute `mutation{syncData}` against onlinecubeleage.com/api/data