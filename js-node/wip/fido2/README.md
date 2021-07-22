# WebAuthn / FIDO2 API Codelab

This folder contains the source code for the WebAuthn / FIDO2 API codelab. It gives an introduction into implementing FIDO2 API,
- https://codelabs.developers.google.com/codelabs/fido2-for-android/


Originally: https://github.com/googlecodelabs/fido2-codelab
- removed mwc
- use https and nip.io
- memory only no DB - localStorage may cause problems here... need to clear credId?
- remove lit-element - to improve list item visual

## Test

1. If developing on a windows 10 laptop, setup windows hello pin 

https://support.microsoft.com/en-us/windows/learn-about-windows-hello-and-set-it-up-dae28983-8242-bb2a-d3d1-87c9d265a5f0

2. Navigate to the following domain (using nip.io - a wildcard DNS)

Find the LAN IP of your server (your laptop) a use dash... **192-168-18-8**, so you should navigate to

- https://192-168-18-8.nip.io:8080 (for SSR example)

Usage is similar to this... https://codelabs.developers.google.com/codelabs/fido2-for-android/

- https://192-168-18-8.nip.io:8080/spa (for SPA example)

For SPA signup and user will be prompted to also register device (enable Windows Hello if browser is on windows laptop)

Select login checkbox after you see credentials appear on webpage (successful registration)

Remove the password and click login, you will be prompted to authenticate using Windows Hello

When logged in, the logged in indication text will be set from false to true


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
