# Frida iOS UIBruteForcer

Simple tool to automate brute forcing tasks against iOS apps, using [Frida](https://www.frida.re).

## Features

- [x] Bank branch/account enumeration;
- [ ] General login/password brute force [working].

## Usage

1. First, connect an iOS device (with Frida installed) through USB and open the target app;
2. Define your own match-replace placeholders in the **Requirements** section of the javascript file;
3. Define your **success conditions' function** in the **Requirements** section of the javascript file;
4. On the target app, type the placeholders you chose at step 2 into the corresponding fields;
5. Finaly, run the python script with your wordlist files, as shown below:
```
python2 iOS-UIBruteForcer.py <IOS_APP_NAME_OR_PID> <FILE1,FILE2>
```
