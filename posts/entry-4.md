---
  title: 'Entry [4]'
  date: '2022-02-02'
---

The past 2 weeks were mainly authentication / authorization and mobile development driven.

I saw a bunch of videos on mobile development. Mainly Takuya Matsuyama's video on creating an [https://www.youtube.com/watch?v=k2h7usLLBhY](animated ToDo app) and the React Native documentation on how to start on a React Native project.

As I'm building a mobile application, on the path to become a unicorn company (let's hope), I also wanted to integrate a new method of authentication in the app.

### FIDO2

The [https://fidoalliance.org/fido2/](FIDO2 specifications) use a public-private key relation to ensure a more robust and secure application, by removing the need of a password for the user. Instead, upon registration, the user sends their public key to the server, which is then every time authenticated with their private key. This makes the hole brute-forcing a lot more harder and basically pointless.

FIDO2, along with CTAP allow for the usage of biometric authentication (TouchID, FaceID) to authenticate the user for the private-public key relation and thus.

Personally, I believe that this authentication method will be the future and it should be used with any application, where it is possible.

One such case is mobile app development. Most, if not all, phones have some form of biometrics available with them. 

As such, I'm now on a path of integrating the FIDO2 specs into the mobile app I'm building and figuring out how that will be best done, additional pros and cons, etc. 

With that in mind, see you in 2 weeks.
