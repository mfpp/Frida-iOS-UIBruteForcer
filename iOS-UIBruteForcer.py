import frida, os, sys, codecs
from termcolor import colored

# GLOBAL ####
TARGET_APP = ''
FILE_PATHS = []
FILE_CONTE = []

# File reader
def get_file(path):
    content = ''
    if os.path.isfile(path):
        with codecs.open(path, 'r', 'utf-8') as f:
            content = f.read()
            return content
    else:
        print colored('[ERROR] File not found: "%s"' %path, 'red')
        sys.exit(1)

# Default callback
def default_callback(message, data):
    if message['type'] == 'send':
        msg = message['payload']
        if 'true|' in msg:
            print colored('[+] ' + msg.split('|')[1], 'green')
        elif 'false|' in msg:
            print colored('[-] ' + msg.split('|')[1], 'red')
        elif 'done|' in msg:
            print colored('\n[*] DONE', 'blue')
        else:
            print colored(msg, 'blue')
    elif message['type'] == 'error':
        err = message['stack']

# INIT ####
print colored('iOS UI Brute Forcer [v1.0]\n', 'yellow', attrs=['bold'])
try:
    TARGET_APP = sys.argv[1].decode('utf-8')
    if TARGET_APP.isnumeric():
        TARGET_APP = int(TARGET_APP)
    FILE_PATHS = sys.argv[2].decode('utf-8').split(',')
except:
    print colored('[USAGE] python iOS-UIBruteForcer.py <IOS_APP_NAME_OR_PID> <FILE1,FILE2>', 'blue')
    sys.exit(1)

# FRIDA MAIN ####
try:
    device = frida.get_usb_device()
    session = device.attach(TARGET_APP) # Attaching to the app (by name or pid)
    print colored('[*] Attaching to: %s' %TARGET_APP, 'blue')
    print colored('[*] Reading the following file(s): %s\n' %(', '.join(FILE_PATHS)), 'blue')
    for p in FILE_PATHS:
        FILE_CONTE.append(get_file(p))
    script = session.create_script(get_file('branch-account-enumeration/branch-account-enumeration.js'))
    script.on('message', default_callback)
    script.load()
    script.post({'type':'start', 'list':FILE_CONTE})
    sys.stdin.read()
except frida.TimedOutError:
    print colored('[ERROR] Device not found: is your device connected?', 'red')
    sys.exit(1)
except frida.ServerNotRunningError:
    print colored('[ERROR] Unable to connect to Frida server: is Frida installed on your device?', 'red')
    sys.exit(1)
except frida.ProcessNotFoundError:
    print colored('[ERROR] Process not found: maybe target app is not running', 'red')
    sys.exit(1)
except frida.NotSupportedError:
    print colored('[ERROR] Frida error: try again', 'red')
    sys.exit(1)
except KeyboardInterrupt:
    session.detach()
    sys.exit(0)
