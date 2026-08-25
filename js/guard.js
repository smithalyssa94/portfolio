(function () {
  try {
    if (sessionStorage.getItem("gateUnlocked") !== "1") {
      window.location.replace("../index.html");
    }
  } catch (e) {
    window.location.replace("../index.html");
  }
})();
