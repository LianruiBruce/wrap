document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get("token", (result) => {
    const token = result.token;

    if (!token) {
      document.getElementById("scan-btn").style.display = "none";
      document.getElementById("upload-btn").textContent = "Log In";
    } else {
      document.getElementById("scan-btn").style.display = "block";
      document.getElementById("upload-btn").textContent = "Manual Upload";
    }
  });

  //settings set
  document
    .getElementById("wrap_settings")
    .addEventListener("click", function () {
      const currentPath = window.location.pathname;
      chrome.storage.local.set({ backpage: currentPath }, () => {
        console.log("Back page stored");
      });
      window.location.href = "/extension_frontend/wrap_setting.html";
    });

  //close button
  document.getElementById("close-btn").addEventListener("click", function () {
    window.close();
  });

  //scan button
  document.getElementById("scan-btn").addEventListener("click", function () {
    window.location.href = "/extension_frontend/wrap_detected.html";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        console.log(currentTab.url);

        chrome.runtime.sendMessage(
          { from: "popup", subject: "scan-page", url: currentTab.url },
          (response) => {
            console.log("Response in popup:", response);
          }
        );
      }
    });
  });

  //upload button
  document.getElementById("upload-btn").addEventListener("click", function () {
    chrome.tabs.create({ url: "https://wrapcapstone.com/login" });
  });

  //report error button
  document
    .getElementById("report-error-btn")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ["report_error.js"],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error(
                "Script injection failed: ",
                chrome.runtime.lastError.message
              );
              return;
            }
            // If no error, proceed to send the message
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "openModal" },
              function (response) {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error sending message:",
                    chrome.runtime.lastError
                  );
                } else if (response) {
                  console.log("Received response:", response.status);
                } else {
                  console.log("No response received.");
                }
              }
            );
          }
        );
      });
    });

  const currentPath = window.location.pathname;

  if (currentPath.includes("wrap_detected.html")) {
    showLoadingWheel();
  }
});

function getReportInfo() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["reportInfo"], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.reportInfo);
      }
    });
  });
}

function getRiskInfo() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["riskInfo"], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.riskInfo);
      }
    });
  });
}

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "updatePopup") {
    console.log("Received data in popup: ", message.data);
    //await updatePopupContent(message.data);
    updatePopupContent(message.data);

    console.log(message.data);
    sendResponse("Received update data in popup.");
  }
  if (message.type === "noResult") {
    console.log("Received No Document Detected");
    window.location.href = "/extension_frontend/wrap.html";
  }
  if (message.type === "reportError") {
    console.log("Received Report Error");
    window.location.href = "/extension_frontend/wrap_error.html";
  }
  if (message.type === "updateRisk") {
    console.log("Received data in popup: ", message.data);
    await updateRiskData(message.data);
    console.log(message.data);
    sendResponse("Received update risk in popup.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup opened, loading data from storage...");

  const reportData = await getReportInfo();
  if (reportData) {
    chrome.storage.local.get("token", (result) => {
      const token = result.token;

      if (!token) {
        document.getElementById("report-btn").textContent = "Login";
      } else {
        document.getElementById("report-btn").textContent = "View Report";
      }
    });

    console.log("Loaded report data:", reportData);

    // Update the popup content with report data
    document.getElementById("company").textContent =
      reportData.company ?? "No Company Name";
    document.getElementById("company-name").textContent =
      reportData.company ?? "No Company Name";
    document.getElementById("category").textContent =
      reportData.category ?? "No Category";
    document.getElementById("date").textContent = reportData.date ?? "No Date";
    updateReadability(reportData.readability);
    console.log("Updated readability by event listener");

    //settings set
    document
      .getElementById("wrap_settings")
      .addEventListener("click", function () {
        window.location.href = "/extension_frontend/wrap_setting.html";
      });

    //close button
    document.getElementById("close-btn").addEventListener("click", function () {
      window.close();
    });

    //report back button
    document.getElementById("home-btn").addEventListener("click", function () {
      chrome.runtime.sendMessage({ type: "Back_Home" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error:", chrome.runtime.lastError);
        } else {
          console.log("Response from background:", response);
        }
      });
      window.location.href = "/extension_frontend/wrap.html";
      chrome.action.setPopup({ popup: "extension_frontend/wrap.html" });
    });

    //report button
    document
      .getElementById("report-btn")
      .addEventListener("click", function () {
        chrome.tabs.create({ url: "https://wrapcapstone.com/login" });
        chrome.storage.local.get("documentID", (result) => {
          const documentID = result.documentID;

          if (documentID) {
            chrome.runtime.sendMessage(
              { type: "FETCH_REPORT", documentID },
              () => {
                console.log(
                  "Tracking backend task for document ID:",
                  documentID
                );
              }
            );
          } else {
            console.error("No document ID found");
          }
        });
      });
  } else {
    console.log("No report data found in storage.");
  }

  const riskData = await getRiskInfo();

  if (riskData) {
    await updateRiskData(riskData);
  } else {
    console.log("No risk data found in storage.");
    document.querySelector(".risk-container").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup opened, checking stored risk status...");

  chrome.storage.local.get("riskStatus", (result) => {
    const riskStatus = result.riskStatus;

    if (riskStatus === "hideRiskContainer") {
      document.querySelector(".risk-container").style.display = "none";
      document.querySelector(".loading-container").style.display = "none";
      document.getElementById("report-btn").style.display = "none";
    } else if (riskStatus === "loginError") {
      document.querySelector(".risk-container").style.display = "none";
      document.querySelector(".loading-container").style.display = "none";
      document.getElementById("report-btn").disabled = false;
    } else if (riskStatus === "reportError") {
      document.querySelector(".risk-container").style.display = "none";
      document.querySelector(".loading-container").style.display = "none";
      document.getElementById("report-btn").disabled = true;
    } else {
      console.log("No risk status found.");
      document.getElementById("report-btn").disabled = false;
    }
  });
});

function updateRiskData(riskAssessment) {
  const loadingContainer = document.querySelector(".loading-container");
  const riskContainer = document.querySelector(".risk-container");

  loadingContainer.style.display = "none";

  riskContainer.style.display = "block";
  riskContainer.style.opacity = "0";

  void riskContainer.offsetWidth;

  requestAnimationFrame(() => {
    riskContainer.style.transition = "opacity 0.5s ease-in-out";
    riskContainer.style.opacity = "1";
  });

  if (typeof riskAssessment === "string") {
    try {
      console.log("Attempting to parse riskAssessment...");
      riskAssessment = JSON.parse(riskAssessment);
      console.log("Parsed riskAssessment:", riskAssessment);

      if (typeof riskAssessment === "string") {
        console.log("Detected double-stringified JSON, parsing again...");
        riskAssessment = JSON.parse(riskAssessment);
        console.log("Successfully parsed twice:", riskAssessment);
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return;
    }
  } else {
    console.log("Input is already an object or array:", riskAssessment);
  }

  if (Array.isArray(riskAssessment)) {
    console.log("Risk assessment is an array");
    riskAssessment.forEach((risk) => {
      updateRiskFields(risk);
    });
  } else if (typeof riskAssessment === "object" && riskAssessment !== null) {
    console.log("Risk assessment is an object");
    updateRiskFields(riskAssessment);
  } else {
    console.error(
      "Invalid data structure, expected array or object. Got:",
      typeof riskAssessment
    );
  }
}

function updateRiskFields(risk) {
  console.log("Updating risk fields for:", risk);

  if (risk.Legal) {
    const legalScore = parseInt(risk.Legal.Score) || 0;
    updateCircleProgress("financial-risk", legalScore);
    document.getElementById("legal-risk-level").textContent =
      getRiskLevelLabel(legalScore); // Update Legal Risk Label
  }

  if (risk.Financial) {
    const financialScore = parseInt(risk.Financial.Score) || 0;
    updateCircleProgress("privacy-risk", financialScore);
    document.getElementById("financial-risk-level").textContent =
      getRiskLevelLabel(financialScore); // Update Financial Risk Label
  }

  if (risk.Data) {
    const dataScore = parseInt(risk.Data.Score) || 0;
    updateCircleProgress("data-risk", dataScore);
    document.getElementById("data-risk-level").textContent =
      getRiskLevelLabel(dataScore); // Update Data Risk Label
  }

  if (risk)
  {
    document.getElementById("report-btn").disabled = false;
  }
}

function getRiskLevelLabel(score) {
  if (score > 4) return "Critical";
  if (score > 3) return "High";
  if (score > 2) return "Moderate";
  if (score > 1) return "Low";
  return "Very Low";
}

function updateReadability(score) {
  const fillElement = document.getElementById("readability-fill");
  document.querySelector(".readability-container").style.display = "flex";
  const label = document.getElementById("readability-text");
  let fillWidth = 0;
  fillElement.style.width = "0%";
  void fillElement.offsetWidth;

  if (score >= 10 && score <= 20) {
    fillWidth = ((score - 10) / 10) * 100;
  } else if (score < 10) {
    fillWidth = 0;
  } else {
    fillWidth = 100;
  }

  const dynamicColor = getDynamicColor(score);
  fillElement.style.backgroundColor = dynamicColor;

  if (score < 12) {
    fillElement.className = "readability-fill easy";
    label.innerText = "Easy";
  } else if (score >= 12 && score <= 15) {
    fillElement.className = "readability-fill moderate";
    label.innerText = "Moderate";
  } else {
    fillElement.className = "readability-fill challenging";
    label.innerText = "Challenging";
  }

  fillElement.style.transition =
    "width 1s ease-in-out, background-color 1s ease-in-out";
  fillElement.style.width = `${fillWidth}%`;
}

function getDynamicColor(score) {
  const minScore = 10;
  const maxScore = 20;

  // Normalize score to a range between 0 and 1
  const percentage = (score - minScore) / (maxScore - minScore);

  const easyColor = { r: 76, g: 175, b: 80 };
  const moderateColor = { r: 255, g: 193, b: 7 };
  const challengingColor = { r: 244, g: 67, b: 54 };

  let r, g, b;
  if (percentage <= 0.5) {
    const midPercentage = percentage * 2;
    r = Math.round(
      easyColor.r + (moderateColor.r - easyColor.r) * midPercentage
    );
    g = Math.round(
      easyColor.g + (moderateColor.g - easyColor.g) * midPercentage
    );
    b = Math.round(
      easyColor.b + (moderateColor.b - easyColor.b) * midPercentage
    );
  } else {
    const midPercentage = (percentage - 0.5) * 2;
    r = Math.round(
      moderateColor.r + (challengingColor.r - moderateColor.r) * midPercentage
    );
    g = Math.round(
      moderateColor.g + (challengingColor.g - moderateColor.g) * midPercentage
    );
    b = Math.round(
      moderateColor.b + (challengingColor.b - moderateColor.b) * midPercentage
    );
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function updateCircleProgress(id, value) {
  const circle = document.querySelector(`#${id} .circle`);

  const dashArray = (value / 5) * 100;
  circle.setAttribute("stroke-dasharray", `${dashArray}, 100`);

  const color = getColor(value);
  circle.setAttribute("stroke", color);
}

function getColor(value) {
  let red, green;

  if (value <= 2.5) {
    red = Math.floor((value / 2.5) * 255);
    green = 255;
  } else {
    red = 255;
    green = Math.floor(255 - ((value - 2.5) / 2.5) * 255);
  }
  return `rgb(${red}, ${green}, 0)`;
}

function updatePopupContent(receivedData) {
  return new Promise((resolve, reject) => {
    fetch("/extension_frontend/report.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.text();
      })
      .then((data) => {
        chrome.storage.local.get("token", (result) => {
          const token = result.token;

          if (!token) {
            document.getElementById("report-btn").textContent = "Login";
          } else {
            document.getElementById("report-btn").textContent = "View Report";
          }
        });

        document.body.innerHTML = data;
        document.getElementById("company").textContent =
          receivedData.company ?? "No Company Name";
        document.getElementById("company-name").textContent =
          receivedData.company ?? "No Company Name";
        document.getElementById("category").textContent =
          receivedData.category ?? "No Category";
        document.getElementById("date").textContent =
          receivedData.date ?? "No Date";
        updateReadability(receivedData.readability);

        console.log("Updated Readability by updatePopupContent");

        //settings set
        document
          .getElementById("wrap_settings")
          .addEventListener("click", function () {
            window.location.href = "/extension_frontend/wrap_setting.html";
          });

        //close button
        document
          .getElementById("close-btn")
          .addEventListener("click", function () {
            window.close();
          });

        //report back button
        document
          .getElementById("home-btn")
          .addEventListener("click", function () {
            chrome.runtime.sendMessage({ type: "Back_Home" }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError);
              } else {
                console.log("Response from background:", response);
              }
            });
            window.location.href = "/extension_frontend/wrap.html";
            chrome.action.setPopup({ popup: "extension_frontend/wrap.html" });
          });

        //report button
        document
          .getElementById("report-btn")
          .addEventListener("click", function () {
            chrome.tabs.create({ url: "https://wrapcapstone.com/login" });

            chrome.storage.local.get("documentID", (result) => {
              const documentID = result.documentID;

              if (documentID) {
                chrome.runtime.sendMessage(
                  { type: "FETCH_REPORT", documentID },
                  (response) => {
                    if (response.success) {
                      console.log("Document data received:", response.data);
                    } else {
                      console.error(
                        "Failed to fetch document data:",
                        response.message
                      );
                    }
                  }
                );
              } else {
                console.error("No document ID found");
              }
            });
          });

        resolve();
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        document.getElementById("status-update").textContent =
          "Failed to load the document data.";
        reject();
      });
  });
}

function showLoadingWheel() {
  document.querySelector(".loading-container").style.display = "flex";
}

function hideLoadingWheel() {
  document.querySelector(".loading-container").style.display = "none";
}
