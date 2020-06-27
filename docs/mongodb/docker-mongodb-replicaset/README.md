# docker-mongodb-replicaset

Docker-compose based mongodb replicaset 

# Installation

* Clone this repository
* Run docker-compose up to create the databases

```
sudo docker-compose up -d
```

# Importing demo data

To import some demo data (Obtained from Mongodb website - http://media.mongodb.org/zips.json) Run the below.

_NOTE: If you have already created your replicaset this command must be written to the master - You can find the PRIMARY by using the rs.status() command_
 
```
mongoimport -v --file=demo-data.json --host localhost --port 27019
```

# Configuration

* To create the replicaset, use the mongo command to access mongodb1 on port 27017 and use rs.initiate to create the replicaset (Adjusting the initiate command based on how many mongodb instances you require).

_NOTE: If you do not have mongo client installed on your Desktop, you can docker exec into the container to run the below._

```
mongo

rs.initiate( {
_id : "test",
members: [
{ _id: 0, host: "mongodb1:27017" },
{ _id: 1, host: "mongodb2:27018" },
{ _id: 2, host: "mongodb3:27019" },
]
})
```

You can confirm the replicaset status by running the below:

```
mongo

rs.status()
```

# Adding a Replica set member

To add a new member to your cluster, run the below command from one of the existing database servers (Will be using mongodb4 for this example):.

```
mongo

rs.add( { host: "mongodb4:27020", priority: 0, votes: 0 } )
```

# Making a "Hidden" Replicaset member

To add a hidden member to your Mongodb cluster (Eg for backups) add the new member to the cluster and set it's attribute to hidden as below (Will be using mongodb5 for this example):

```
mongo

rs.add( { host: "mongodb5:27021", priority: 0, votes: 0 } )

```

Now use rs.status() to get the "id" of the new replicaset member - Make a note of this _id:

```
mongo

rs.status()
```

Now edit the replicaset configuration to set this new member to "hidden", replacing *id* with the value you noted before (Eg 4)

```
cfg = rs.conf()
cfg.members[4].priority = 0
cfg.members[4].hidden = true
rs.reconfig(cfg)
```

# Removing a Replicaset Member

To remove a Replicaset member, simply run the below command on your current Mongodb PRIMARY server (Replacing the hostname and port with the instance you wish to remove):

```
rs.remove("mongodb4:27020")
```