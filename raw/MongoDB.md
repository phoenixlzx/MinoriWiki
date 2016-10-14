title: MongoDB
category: Server Configuration
time: 1470000000000
---
#### Installation

```
sudo add-apt-repository 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen'
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
sudo apt-get update
sudo apt-get install mongodb-10gen
```

#### Authentication (For MongoDB >= 2.4)

##### Add A User Administrator as Per Recommended by MongoDB

```
$ mongo
> db = db.getSiblingDB('admin')
> db.addUser({user: "username", pwd: "password", roles: ["userAdminAnyDatabase"]})
```

##### Add A FULL PRIVILEGED User (For Unlocking Full Functionality of RockMongo, etc)

```
$ mongo
> db = db.getSiblingDB('admin')
> db.addUser({user: "username", pwd: "password", roles: ["dbAdminAnyDatabase", "userAdminAnyDatabase", "readWriteAnyDatabase", "clusterAdmin"]})
```

#### Authentication (For MongoDB < 2.4)

```
$ mongo
> use admin
> db.addUser("username", "password")
```

References:

1. [http://www.mongodb.org/display/DOCS/Security+and+Authentication](http://www.mongodb.org/display/DOCS/Security+and+Authentication)
2. [http://www.mongodb.org/display/DOCS/Security+and+Authentication](http://www.mongodb.org/display/DOCS/Security+and+Authentication)

