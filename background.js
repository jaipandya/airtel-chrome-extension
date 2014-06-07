var ALERT_PERCENT_CONSUMPTION = 70;

// Creating alarm for event page
var alarmInfo = {
	delayInMinutes: 0.1, 
	periodInMinutes: 17280
}
chrome.alarms.create("airtel_broadband", alarmInfo);

chrome.alarms.onAlarm.addListener(function(alarm) {

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://122.160.230.125:8080/gbod/gb_on_demand.do", true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
	
		if(xhr.status != 200) {
			return;
		}

		var responseText = xhr.responseText;
		var parser = new DOMParser();
		var doc = parser.parseFromString(responseText , "text/html");
		
		var ul = doc.querySelector("#container .content ul");
		var items = Array.prototype.slice.apply(ul.getElementsByTagName("li"));
	
		items = items.map(function(item) {
			return item.innerText.split(":")[1].trim();
		});
	
		var remaining = parseFloat(items[1]),
			total = parseFloat(items[2]),
			remainingDays = items[3];
	
		// Sending notifications consumed more than the set limit above
		var percentage = Math.round(((total - remaining) / total) * 100)
		if (percentage > ALERT_PERCENT_CONSUMPTION) {
			var notificationOption = {
				type: "progress",
				title: "Broadband Usage Alert",
				message: "You have consumed " + percentage + " percent bandwidth from your quota",
				iconUrl: "airtel_16.png",
				progress: percentage
			};
			// Sending notification
			chrome.notifications.create("", notificationOption, function(id){});
		}
	
	};
	
	xhr.send();
  
});
