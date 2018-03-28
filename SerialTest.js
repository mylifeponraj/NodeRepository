var SerialPort = require('serialport');
const Delimiter = SerialPort.parsers.Delimiter;

var json = require('string-to-json');

var scheduler = require('node-schedule');

var SerialTest = function() {
	var arduinoInfo="";
	var sPort ;

	function getArduinoInfo() {
		console.log('About to get the Arduino Status..');
		sPort.write('GSI\n', function(err) {
			if (err) {
				return console.log('Error on write: ', err.message);
			}
		});
	}

//	var montlyJob = scheduler.scheduleJob('*/5 * * * * *', function(){
//		console.log('About to get the Arduino Status..');
////		sPort.write('GSS\n', function(err) {
////			if (err) {
////				return console.log('Error on write: ', err.message);
////			}
////		});
//	});

	function messageReceived(message) {
		if(message.startsWith("{")) {
			//Json Message
			message = message.replace("\"", "");
			message = message.replace(/'/g, "\"");
			arduinoInfo = JSON.parse(message);
			console.log(arduinoInfo.SystemName);
		}
		else if(message.startsWith("[")) {
			//command Message
			console.log(message);
		}
		else {
			//Status Message
			console.log(message);
		}
	}

	SerialPort.list()
	.then(ports => ports.find(port => /arduino/i.test(port.manufacturer)))
	.then(port => {
		if (!port) {
			throw new Error('Arduino Not found');
		}
		arduinoInfo = port.manufacturer;
		sPort = new SerialPort(port.comName, {
			autoOpen: true,
			baudRate: 9600
		});
		const parser = sPort.pipe(new Delimiter({ delimiter: '\n' }));
		parser.on('data', function (data) {
			messageReceived(data.toString("utf-8"));
		});

		sPort.on('open', function() {
			console.log('Port is Open.');
			setTimeout(getArduinoInfo, 3000);
		});
		sPort.on('close', function() {
			console.log('Port is Closed.');
		});

		//Switches the port into "flowing mode"
		//sPort.on('data', function (data) {
		//  console.log('Data:', data.toString("utf-8"));
		//});
	})
	.catch((err) => {
		console.error(err.message);
		process.exit(1);
	});

	//Function to Export
	this.getArduinoConnectedData = function(){
		return arduinoInfo;
	};
};

//module.exports = SerialTest;

var sTest = new SerialTest();


