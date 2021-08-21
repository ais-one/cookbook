Azure CLI

https://docs.microsoft.com/en-us/cli/azure/

- install
  - windows (Powershell)
    - Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; rm .\AzureCLI.msi
    - remove **/quiet** as it may not work properly 
  - ubuntu
    - curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
  - docker
    - docker run -it mcr.microsoft.com/azure-cli

- https://docs.microsoft.com/en-us/azure/developer/javascript/tutorial/tutorial-vscode-azure-cli-node/tutorial-vscode-azure-cli-node-01

Commands

```
az upgrade
az login
```

Azure Hierachy

- Management group (manage access, policy, compliance across subscriptions)
  - Subscription (logical grouping of azure services)
    Billing boundary / Access control boundary
    Use subscriptions to seperate Environments and/or Organizational Structures, and/or for Billing purpose
    e.g. Dev Subscription, UAT Subscription, Production Subscription
    - Resource Group (cannot nest resource group)
      Az resource manager
      RBAC applied here
      - you own resource grouping here (lifecycle for r&d, storage, app...)
      - Resources (can be in only one resource group)


Billing account -> billing profile -> invoice section -> subscription

Directory (sandbox / default) -> Management Group (node) -> Management Group (node) or Subscription (leaf)
- 6 levels deep (exclude root level), 10k groups per directory

- Azure Region Pair
  - Azure Region
    - Azure Availability Zone (DC)
      - zonal services (use only 1 zone)
      - zone redundant services


- compute
  - vms
    - virtual machine sets
    - azure batch
  - azure constainer instances & k8s
  - app service
  - functions
  - azure virtual desktop (like vmware cloudpc)

- networking
  - azure virtual network
    - filter (network security groups, network virtual appliances), route traffic (routing tables, BGP), connect virtual networks (peering, UDR)
    - communicate between az resources, with on-prem resource
    - isolation, segmentation, internet comms
  - expressRoute P2P
    - peering for office 365, az public services
    - az private peering for vnets
    - P2p (L2, L3), Any2Any (L3), Colo (L2, L3)
  - vpn (private IP)
    - active-standby, active-active
    
- storage
  - blob
    - blob access tiers
  - disk
  - files
  - table storage (k-v pair)
  - queue storage (mq)
  - tiers
    - hot
    - cold (infrequent access)
    - archive (rarely accessed)
  - create azure storage account ()

- db
  - 