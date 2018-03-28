/**
 * 
 */
var message = "{'SystemName': 'Arduino Uno R3','TotalSwitch': '8','Sensor': ['TouchSensor', 'DTHSensor', 'PIRMotionSensor'],'FirstName': 'Ponraj','LastName':'Suthanthiramani','CustomerID':'1001','CustomerEmail':'mylife.ponraj@gmail.com','CustomerLicense':'56DA84-581EE0-8FF47B-FB81B6-555F14-6CFE48-0625'}";
message = message.replace("\"", "");
message = message.replace(/'/g, "\"");
console.log(JSON.parse(message).SystemName);