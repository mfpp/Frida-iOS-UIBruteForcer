# Frida iOS UIBruteForcer

Simple tool to automate brute forcing tasks against iOS apps, using [Frida](https://www.frida.re).

## Features

- [x] Bank branch/account enumeration;
- [ ] General login/password brute force [working].

## Usage

1. First, define your own match-replace placeholders in the **Requirements** section of the javascript file;
2. Next, define your **success conditions' function** in the **Requirements** section of the javascript file;
3. Finaly, run the python script with your wordlist files, as shown below:
```
python2 iOS-UIBruteForcer.py <IOS_APP_NAME_OR_PID> <FILE1,FILE2>
```
