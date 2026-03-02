// notification-permission.js

(function () {

  // Wait until page fully loads
  window.addEventListener("load", function () {

    // Wait 15 seconds before asking
    setTimeout(function () {

      // Check if browser supports notifications
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
        return;
      }

      // Ask only if permission not decided
      if (Notification.permission === "default") {

        Notification.requestPermission().then(function (permission) {

          if (permission === "granted") {
            new Notification("Thanks for subscribing!", {
              body: "You will now receive latest mobile updates from Maaney Store.",
              icon: "/favicon.ico" // Change to your logo path
            });
          }

        });

      }

    }, 15000); // 15 seconds

  });

})();