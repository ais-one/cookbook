# GCP Only Dockerized Google Compute Engine

Prerequisites: Docker image in container registry gcr.io

See [deployment-gcp.md](deployment-gcp.md) "Docker Build And Push To gcr.io"


## Configure Firewall Rules

- https://console.cloud.google.com/networking/firewalls
- Create firewall rule.
  - name: vm-firewall-rule
  - Target tags: vm-firewall-tag (link VMs to this rule)
  - Source IP ranges: 0.0.0.0/0 (allow all incoming traffic, we fix this later to allow only from load balancer)
  - Protocols and ports: check tcp and enter 3000
  - Click Create.

```bash
gcloud compute --project=viow-270002 firewall-rules create vm-firewall-rule --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:3000 --source-ranges=0.0.0.0/0 --target-tags=vm-firewall-tag

gcloud compute --project=viow-270002 firewall-rules delete vm-firewall-rule
```

## Create Instance Template

- https://console.cloud.google.com/compute
  - click Instance Templates in the left menu bar
  - click Create instance template
    - name: gcloud-docker-node-template
    - container: Check Deploy a container image to this VM instance option
    - container image: gcr.io/<project-id>/docker-image:latest
    - Click the Management, security, disks, networking, sole tenancy dropdown and navigate to the Networking tab. In the Network tags form, enter vm-firewall-tag and hit tab. This establishes the link I previously mentioned to our firewall rule. Leave all other settings the same
    - click Create.

```bash
# does not work yet
```

## Create a managed instance group

- https://console.cloud.google.com/compute/instanceGroups
  - click Create instance group.
    - name: gcloud-docker-node-group
    - set region and zone: asia-southeast1, asia-southeast1-b
    - Instance template: select gcloud-docker-node-template
    - Under Target CPU usage, enter 75, and under Maximum number of instances enter 5. This configuration will automatically add or remove VM instances to try and maintain a CPU usage of 75% for each instance. Leave everything else as their defaults
    - hit Create.

If you head over to the VM instances tab, you should now see at least one VM instance spinning up. Once it finishes booting, we’ll SSH into that instance to ensure its running properly with our Docker image.

```bash
gcloud compute --project=viow-270002 instance-groups managed create gcloud-docker-node-group --base-instance-name=gcloud-docker-node-group --template=gcloud-docker-node-template --size=1 --zone=asia-southeast1-b

#below might not work
gcloud beta compute --project "viow-270002" instance-groups managed set-autoscaling "gcloud-docker-node-group" --zone "asia-southeast1-b" --cool-down-period "60" --max-num-replicas "3" --min-num-replicas "1" --target-cpu-utilization "0.8" --mode "on"
```

Test the template IP test with - http://<vm instance ip>:3000/

## Add a load balancer
- https://console.cloud.google.com/net-services/loadbalancing
 - click Create load balancer
 - select HTTP(S) Load Balancing
 - select from Internet to my VMs and click continue
 - name: gcloud-docker-node-lb
 - click Backend configuration
   - Select Create or select backend services & backend buckets -> backend services -> Create a backend service
     - name: lb-backend
     - Under New backend, open the Instance group dropdown and select your managed instance group.
       - Enter 3000 under Port numbers and click done (not Create).
     - Click the Health check dropdown and click Create a health check
       - name : lb-health-check
       - set the protocol to HTTP and the port to 3000
       - Hit Save and continue then hit Create.
   - Click Frontend configuration
     - name: lb-frontend.
     - Click the IP address dropdown, selecting Create IP address. Name it lb-ip and click Reserve.
     - Finally, click Done.
   - Hit Review and finalize, ensure all the values are correct and click Create.

And that’s it! Under the Instance groups section (still on the load balancer page), after a few minutes, 1/1 should be shown under Healthy, indicating that the health checks are passing.

Once our health checks are passing, grab the value under IP:PORT in the Frontend section of the load balancer page and navigate to http://<ip:port>/api/examples/hello, where you should again see the “hello world” message, although this time you’ve accessed your server through the load balancer!

We could setup HTTPS quite easily on the user-facing frontend using Google’s managed SSL certificates, but that would require us to obtain a domain, so for the purpose of this tutorial we will use HTTP. 


## Restrict traffic

Only allow incoming from Load balancer or Health check
- Goto Firewall Rules
- Select vm-firewall-rule
- Click Edit, and in Source IP ranges, replace 0.0.0.0/0 with 130.211.0.0/22 and 35.191.0.0/16. Click Save.
- Can only access from LB

## Deploying new versions

1. Build and deploy our Docker image
2. Perform a rolling restart (beta) on our managed instance group to restart the VMs. Upon booting up, they will pull the newest Docker image in the Container Registry, which will be built with our newly updated code.
3. To perform a rolling restart, we first need to install the gcloud beta CLI tools (gcloud components install beta)
4. gcloud beta compute instance-groups managed rolling-action restart gcloud-docker-node-group --zone us-east1-b
5. check status: gcloud beta compute instance-groups managed list-instances gcloud-docker-node-group --zone us-east1-b

deploy.sh

```bash
#!/bin/bash
# build docker image
gcloud builds submit --tag gcr.io/<project-id>/docker-image . --project <project-id>
# restart instances (this loads new images)
gcloud beta compute instance-groups managed rolling-action restart gcloud-docker-node-group --zone us-east1-b --project <project-id>
```
