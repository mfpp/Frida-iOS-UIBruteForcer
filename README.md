# Frida iOS UIBruteForcer

Simple tool to automate brute forcing tasks against iOS apps, using [Frida](https://www.frida.re).

## Features

- [x] General UIWindow brute force;
- [ ] General UIWebView brute force [working];
- [ ] UIView virtual keyboard brute force [working].

## Usage

1. First, connect an iOS device (with Frida installed) through USB;
2. Define your own match-replace placeholders in the **Config** section of the javascript file;
3. Define your **success conditions function** in the **Config** section of the javascript file;
4. Open the target app and type the placeholders you chose (at step 2) into the corresponding fields;
5. Finaly, run the python script with your wordlist files, as shown below:
```
python2 iOS-UIBruteForcer.py <IOS_APP_NAME_OR_PID> <WORDLIST#1,WORDLIST#2...>
```
