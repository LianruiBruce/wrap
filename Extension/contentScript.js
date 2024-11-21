const userToken = localStorage.getItem("token");

if (userToken) {
  chrome.runtime.sendMessage(
    { type: "USER_LOGIN", token: userToken },
    (response) => {
      console.log("Response from background:", response);
    }
  );
}

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.origin !== "http://localhost:3000") return;

  if (event.data.type === "USER_LOGIN") {
    chrome.runtime.sendMessage(
      { type: "USER_LOGIN", token: event.data.token },
      (response) => {
        console.log("Response from background:", response);
      }
    );
  }

  if (event.data.type === "USER_LOGOUT") {
    chrome.runtime.sendMessage({ type: "USER_LOGOUT" }, (response) => {
      console.log("Response from background:", response);
    });
  }
});
