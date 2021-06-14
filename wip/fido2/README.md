# WebAuthn / FIDO2 API Codelab

This folder contains the source code for the WebAuthn / FIDO2 API codelab. It gives an introduction into implementing FIDO2 API,
- https://codelabs.developers.google.com/codelabs/fido2-for-android/


Originally: https://github.com/googlecodelabs/fido2-codelab
- removed mwc
- use https and nip.io
- memory only no DB - localStorage may cause problems here... need to clear credId?
- remove lit-element - to improve list item visual

TBD
- clear localstorage if no user found...
- remove sessions
- remove hbs
- make as SPA

## Test

1. If developing on a windows 10 laptop, setup windows hello pin 

https://support.microsoft.com/en-us/windows/learn-about-windows-hello-and-set-it-up-dae28983-8242-bb2a-d3d1-87c9d265a5f0

2. Navigate to the following domain (using nip.io - a wildcard DNS)

Find the LAN IP of your server (your laptop) a use dash... 192-168-18-8, so you should navigate to https://192-168-18-8.nip.io:8080


## Sample User Structure in backend

```json
{
  "users": [
    {
      "username": "aa",
      "id": "9YWB7U-urhEjwwl1KViywNZgm2BWDO3UbrdOpVYcpyY",
      "credentials": []
    },
    {
      "username": "aaa",
      "id": "4562etESTv79gCODwT3rgF-4Lt-xf8Jz-dfPPG61ERc",
      "credentials": [
        {
          "publicKey": "pQECAyYgASFYIDVy4WgaIvJA3NmQnGUDBAeJyrrdkX11KpTrVgSew8cDIlgg7jLHowhF76T4SX5I5ayQCYCPg0rZRB29n3DKyt6QaPI",
          "credId": "AZvbuXjNO5NH0Ge9zUnuSLx4AsABu-WgBEgaHPrq7d9g9_1aiemXb34Tgm2W-sx1kYTiRYREH1qw16zRFRYbgis",
          "prevCounter": 0
        }
      ]
    }
  ]
}
```
