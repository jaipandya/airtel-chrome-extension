alarmInfo = {
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
	
		var div = document.createElement("div");
		div.innerHTML = xhr.responseText;
	
		var ul = div.querySelector("#container .content ul");
		var items = Array.prototype.slice.apply(ul.getElementsByTagName("li"));
	
		items = items.map(function(item) {
			return item.innerText.split(":")[1].trim();
		});
	
		var remaining = parseFloat(items[1]),
			total = parseFloat(items[2]),
			remainingDays = items[3];
	
		// Sending notifications if GB left is less than 20%
		percentage = Math.round((remaining / total) * 100)
		if (percentage < 20) {
			id = null;
			var notificationOption = {
				type: "basic",
				title: "Broadband Usage Alert",
				message: "Only " + percentage + " percent quota remaining",
				iconUrl: "airtel_16.png"
			};
			chrome.notifications.create("", notificationOption, function(id){});
		}
	
	};
	
	xhr.send();
  
});
