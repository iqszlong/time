var notice = {
    icon:"./favicon.png",

    sendNotification: function(title, options) {
        // Memoize based on feature detection.
        if ("Notification" in window) {
            sendNotification = function(title, options) {
                return new Notification(title, options);
            };
        } else if ("mozNotification" in navigator) {
            sendNotification = function(title, options) {
                // Gecko < 22
                return navigator.mozNotification
                    .createNotification(title, options.body, options.icon)
                    .show();
            };
        } else {
            sendNotification = function(title, options) {
                alert(title + ": " + options.body);
            };
        }
        return sendNotification(title, options);
    },
    init: function() {
        if (window.Notification && Notification.permission !== "granted") {
            Notification.requestPermission(function(status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    }

}

notice.init();