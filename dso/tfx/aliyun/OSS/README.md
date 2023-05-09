Will change

AccessKey ID LTAI5tPaWYgnWMiKJDE9aQQ2
AccessKey Secret KOwM9Xngdq1OFNDQkD5pkBoyMnjTr8



Need domain / DNS to access the static website

TBD get terraform code for associating Domain to the bucket...

Also for teardown ?


---

## Alicloud Security Token Service - Using STS to create resource

Goto RAM -> Create Role

Select Alibaba Cloud Service -> Next

Select Normal Service Role
Enter role name: <labex-role-0119>
Select trusted service: Elastic Computer Service -> OK

Next, Add Permissions to RAM Role
select ossFullAccess click complete...



Go to ECS console and bind to ECS console? (at other information box)

the binding is to run the command below to get the access info
curl http://100.100.100.200/latest/meta-data/ram/security-credentials/labex-role-0119

{
  "AccessKeyId" : "STS.NUDj77JRKuad3KiJuudSExLNb",
  "AccessKeySecret" : "AqPUGYC2CiPB4R3qvrJeEPAKweHdUv81uEKxfQjUpRBt",
  "Expiration" : "2022-01-20T12:46:29Z",
  "SecurityToken" : "CAISiwJ1q6Ft5B2yfSjIr5bxIY2Dp41qwqOPMW3YrnUgaNxpl4nlgDz2IHhOeHNqAu4etvQwn2pW7/oZlrRtTtpfTEmBbI5sspJZ9l69OoXH4s/v9KMdipKlFDAovO4vU4iADd/iRfbxJ92PCTmd5AIRrJL+cTK9JS/HVbSClZ9gaPkOQwC8dkAoLdxKJwxk2qR4XDmrQpTLCBPxhXfKB0dFoxd1jXgFiZ6y2cqB8BHT/jaYo60339mocsn+NpQzZssuCobpgLRMG/CfgH4A2X9j77xriaFIwzDDs+yGDkNZixf8aLKOroc1d1EhPvhlQPQa9aSnj5p8s+beh8HtzBJAeLkMCnXP9kh1DXtxrYkagAE6o6+zP7LhlWxFXEYKg3wSR0OQhkw+Bg4FHVRZQLt3aUwxBfIYg+lhamLjmixjJKcMy5Q6kL6f9vDPtzRonfqq4hsLHRRciyEfpDuhaRe655tqPKywj2xIt9lIntPN5I91SySI8b8djp1D0MAOPKiXnN93gLO/zv+kie+d+fVTVQ==", 
  "LastUpdated" : "2022-01-20T06:46:29Z",
  "Code" : "Success"
}

So we use AccessKeyId, AccessKeySecret, SecurityToken to run terraform..., you can unbind role from ecs and use...