0. Download and install Google Cloud SDK
1. create project
2. add users
3. create service keys

4. setup cloud object storage
  - Google Cloud Storage, AWS S3, Alibaba Object Store


## Google Cloud

# Google Cloud Platform

## Install GS UTIL 

https://cloud.google.com/storage/docs/gsutil_install

gsutil init

## gcloud auth, change users, set projects, etc.

If you want to logout from all the accounts run the following command

gcloud auth revoke --all - If you want to logout from a specific account then run the following command
gcloud auth revoke <your_account> - If you want to login with a different account, you can run the following command
gcloud auth login

gcloud projects list

gcloud config set project PROJECT_ID
gcloud config list

## Hosting Statuc Website on GCS

https://cloud.google.com/storage/docs/hosting-static-website

NAME                  TYPE     DATA
www.example.com       CNAME    c.storage.googleapis.com


Verify Domain ownership/control using TXT

gsutil rsync -R spa/dist gs://uat.mybot.live

give permissions to view for public

set website info index page, error page


gsutil web set -m index.html -e 404.html gs://www.example.com
gsutil rm -r gs://www.example.com




















# GCP Only Dockerized Google Compute Engine

Reference: https://levelup.gitconnected.com/dockerizing-and-autoscaling-node-js-on-google-cloud-ef8db3b99486

1. Prerequisites - docker image in gcr.io

```bash
gcloud builds submit --tag gcr.io/viow-270002/viow-node-app .

# https://codelabs.developers.google.com/codelabs/cloud-running-a-nodejs-container
git clone https://github.com/GoogleCloudPlatform/nodejs-docs-samples.git
cd nodejs-docs-samples/containerengine/hello-world/
docker build -t gcr.io/viow-270002/viow-node-app .
gcloud auth configure-docker
docker push gcr.io/viow-270002/viow-node-app:latest
```

Need to enable Cloud Build - https://console.cloud.google.com/cloud-build

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

Now that our load balancer is hooked up, we can close off all incoming traffic to our VM, with the exception of our load balancer and health checks. Navigate back over to the firewall rules page and click on the rule we previously made, 

vm-firewall-rule. Click Edit, and in the Source IP ranges, replace 0.0.0.0/0 with 130.211.0.0/22 and 35.191.0.0/16 (hit tab after entering in each IP). Click Save. Now if you try and access the server through the VMs external IP address, the browser will just hang. All traffic will need to come in through our load balancer.


## Deploying new versions

So what if you need to make changes to your code? Although we haven’t setup a build server or automation with git, we can write a simple script to update our VM instances with a new deployment. This includes two steps, the first being to build and deploy our Docker image, as previously done. After that, we need to perform a rolling restart on our managed instance group to restart the VMs. Upon booting up, they will pull the newest Docker image in the Container Registry, which will be built with our newly updated code. Note: the rolling restart feature is still in beta, but I have never ran into issues with it.
To perform a rolling restart, we first need to install the gcloud beta CLI tools. Run gcloud components install beta and follow the prompts.
Once that’s done, we can start a rolling restart with the following command:
gcloud beta compute instance-groups managed rolling-action restart gcloud-docker-node-group --zone us-east1-b
Note: if you used a different zone then the default, you will need to adjust it above.
This command will start the process of a rolling restart. To check on its status, use:
gcloud beta compute instance-groups managed list-instances gcloud-docker-node-group --zone us-east1-b
Rather than needing to memorize and type out both these steps every time we update our code, we’ll write a simple deploy.sh script which will do it automatically.
Create the file using touch deploy.sh and copy both commands into it:
#!/bin/bash
# build docker image
gcloud builds submit --tag gcr.io/<project-id>/docker-image . --project <project-id>
# restart instances (this loads new images)
gcloud beta compute instance-groups managed rolling-action restart gcloud-docker-node-group --zone us-east1-b --project <project-id>
Make sure to replace <project-id> with your own project ID and change the zone if you did not use the default. Although our project is automatically set by our CLI, I am adding the --project flag in case you need to configure deployments for multiple projects at once.
Run chmod +x deploy.sh to enable permissions. Now if you make any changes to your code, simply run:
./deploy.sh
to deploy the new code.
And that’s it! 🤙 I hope you found the tutorial helpful. I would love to get your feedback, so leave a comment below if you enjoyed it or ran into any issues. Make sure to check out Part 2! If you are interested in doing something similar but with Kubernetes, check out my post on that here.


