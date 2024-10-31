let isProcessing = false;
// this is rule IDs for non-essential cookies, still need to be tested -- Lianrui

const keepAlive = ((i) => (state) => {
  if (state && !i) {
    if (performance.now() > 20e3) chrome.runtime.getPlatformInfo();
    i = setInterval(chrome.runtime.getPlatformInfo, 20e3);
  } else if (!state && i) {
    clearInterval(i);
    i = 0;
  }
})();
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToProxy",
    title: "Scan Webpage",
    contexts: ["link"],
  });

  chrome.storage.sync.set(
    {
      saveToDatabase: true,
      detectLegalDoc: true,
      generateReport: true,
      showNotification: true,
      safeMode: true,
      termsConditions: true,
      privacyPolicy: true,
      contractAgreement: true,
      cookiePolicy: true,
    },
    () => {
      console.log("Default settings saved.");
    }
  );

  chrome.storage.local.remove(["token", "reportInfo", "riskInfo"], () => {
    chrome.action.setIcon({ path: "icons/Wrap_Red.png" });
    console.log("Token and report data removed from storage");
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToProxy" && info.linkUrl) {
    fetch(info.linkUrl)
      .then((response) => response.text())
      .then((html) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["parse_tab.js"],
          },
          () => {
            chrome.tabs.sendMessage(tab.id, {
              action: "parseURL",
              url: info.linkUrl,
              html: html,
            });
          }
        );
      })
      .catch((error) => console.error("Error fetching URL:", error));
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (tab.url && tab.url.startsWith("wrapcapstone.com")) {
    console.log("Skipping legal document detection for wrapcapstone.com");
    return; // Don't execute further if the URL matches wrapcapstone.com
  }

  chrome.storage.local.get("token", (result) => {
    const token = result.token;
    if (token) {
      getCurrentSettings((settings) => {
        if (settings.detectLegalDoc && !isDuplicateRequest(tab, changeInfo)) {
          console.log("Detecting legal documents...");
          console.log("Tab updated: ", tabId);

          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              files: ["parse_tab.js"],
            },
            () => {
              chrome.tabs.sendMessage(tab.id, { action: "parseTab" });
            }
          );
        }
        if (!isDuplicateRequest(tab, changeInfo)) {
          chrome.action.setIcon({ path: "icons/Wrap.png" });
        }
      });
    }
  });
});

let scan_button = false;

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.from === "popup" && message.subject === "scan-page") {
    console.log("Scanning page: ", message.url);
    scan_button = true;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        let currentTabId = tabs[0].id;
        console.log("Executing script on tab: " + currentTabId);
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTabId },
            files: ["parse_tab.js"],
          },
          () => {
            chrome.tabs.sendMessage(currentTabId, { action: "parseTab" });
            console.log("Script injected successfully");
            sendResponse({ success: true, tabId: currentTabId });
          }
        );
      }
    });

    return true;
  }

  if (message.type === "extracted-data") {
    if (message.data.url == "wrapcapstone.com/mainpage") {
      chrome.action.setPopup({ popup: "extension_frontend/wrap.html" });
      return true;
    }

    if (isProcessing) {
      return true;
    }

    console.log("Extracted data");
    chrome.action.setPopup({ popup: "extension_frontend/wrap_detected.html" });
    let isLegalDoc = (
      await isLegalDocument(
        message.data.headers,
        message.data.title,
        message.data.url
      )
    ).valueOf();
    console.log("Is legal document: ", isLegalDoc);

    if (isLegalDoc) {
      chrome.storage.local.remove(["reportInfo", "riskInfo"], () => {
        console.log("Token and report data removed from storage");
      });

      chrome.action.setIcon({ path: "icons/Wrap_Yellow.png" });

      keepAlive(true);

      let reportData = await sendDataToServer(message.data);

      if (reportData && reportData != "") {
        chrome.storage.local.set({ reportInfo: reportData }, () => {
          console.log("reportData stored");
        });

        getCurrentSettings(async (settings) => {
          if (settings.showNotification) {
            chrome.notifications.create("documentDetect", {
              type: "basic",
              iconUrl: "icons/notification.png",
              title: "Document Detect",
              message: "A legal document has been detected!",
              priority: 1,
            });
          }

          if (settings.generateReport) {
            console.log("Generating report...");

            try {
              console.log("Section is: " + message.data.sections);
              const riskAssessmentData = await generateReport(
                message.data.text,
                message.data.sections,
                message.data.tags,
                settings.saveToDatabase
              );
              console.log(riskAssessmentData);
              if (riskAssessmentData && riskAssessmentData.success) {
                const riskAssessment = riskAssessmentData.data.risk_assessment;

                chrome.storage.local.set({ riskInfo: riskAssessment }, () => {
                  chrome.action.setIcon({ path: "icons/Wrap_Green.png" });
                  console.log(
                    "Risk data saved",
                    JSON.stringify(riskAssessment)
                  );
                });

                await sendRiskToPopup(riskAssessment);
              } else {
                chrome.action.setIcon({ path: "icons/Wrap_Red.png" });
                handleRiskAssessmentError(riskAssessmentData);
              }
            } catch (error) {
              chrome.action.setIcon({ path: "icons/Wrap_Red.png" });
              handleRiskAssessmentError(error);
            } finally {
              keepAlive(false);
            }
          } else {
            chrome.storage.local.set(
              { riskStatus: "hideRiskContainer" },
              () => {
                chrome.action.setIcon({ path: "icons/Wrap_Green.png" });
                console.log("Stored hideRiskContainer status in storage.");
              }
            );
          }
        });
        await sendDataToPopup(reportData);
        chrome.action.setPopup({ popup: "extension_frontend/report.html" });
        scan_button = false;

        keepAlive(false);
      } else {
        getCurrentSettings(async (settings) => {
          if (settings.showNotification) {
            chrome.notifications.create("documentDetect", {
              type: "basic",
              iconUrl: "icons/error.png",
              title: "Error to Get Report",
              message:
                "A legal document have detected, but have error to show report!",
              priority: 1,
            });
          }
        });

        chrome.action.setIcon({ path: "icons/Wrap_Red.png" });

        chrome.action.setPopup({ popup: "extension_frontend/wrap_error.html" });

        await sendErrorToPopup();

        keepAlive(false);
      }
    } else {
      try {
        await sendNoResultToPopup();
      } catch (e) {
        console.log("Cannot send message to popup:", e);
        chrome.action.setPopup({ popup: "extension_frontend/wrap.html" });
      }
    }

    return true;
  }

  if (message.type === "USER_LOGIN") {
    const token = message.token;
    console.log("Token received:", token);

    chrome.storage.local.set({ token }, () => {
      chrome.action.setIcon({ path: "icons/Wrap.png" });
      console.log("Token stored in chrome.storage.local");
      getCurrentSettings(async (settings) => {
        if (settings.showNotification) {
          chrome.notifications.create("Login", {
            type: "basic",
            iconUrl: "icons/notification.png",
            title: "Login Successfully",
            message: "You have Login extension successfully!",
            priority: 1,
          });
        }
      });
    });

    sendResponse({ success: true });

    return true;
  }

  if (message.type === "USER_LOGOUT") {
    chrome.storage.local.remove(["token", "reportInfo", "riskInfo"], () => {
      chrome.action.setIcon({ path: "icons/Wrap_Red.png" });
      console.log("Token and report data removed from storage");
      getCurrentSettings(async (settings) => {
        if (settings.showNotification) {
          chrome.notifications.create("Logout", {
            type: "basic",
            iconUrl: "icons/notification.png",
            title: "Logout Successfully",
            message: "You have Logout extension successfully!",
            priority: 1,
          });
        }
      });
    });
    sendResponse({ success: true });

    return true;
  }

  if (message.type === "FETCH_REPORT") {
    const documentID = message.documentID;

    chrome.storage.local.get("token", (result) => {
      const token = result.token;

      if (!token) {
        console.error("Token not found. User might not be logged in.");
        if (settings.showNotification) {
          chrome.notifications.create("userLogin", {
            type: "basic",
            iconUrl: "icons/error.png",
            title: "Error to Generate Report",
            message: "User is not logged in. Please log in.",
            priority: 1,
          });
        }
        sendResponse({ success: false, message: "User not logged in." });
        return true;
      }

      keepAlive(true);

      fetch(`wrapcapstone.com/getReportByDocumentID`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentID }),
      })
        .then(() => {
          console.log("Backend tracking request sent.");
        })
        .catch((error) => {
          console.error("Error sending tracking request:", error);
        })
        .finally(() => {
          keepAlive(false);
        });
    });

    return true;
  }

  if (message.type === "Back_Home") {
    chrome.action.setIcon({ path: "icons/Wrap.png" });
    console.log("Home button click");
    sendResponse({ status: "Icon updated" });
    return true;
  }

  return true;
});

function handleRiskAssessmentError(error) {
  if (error.message === "Not logged in") {
    chrome.storage.local.set({ riskStatus: "loginError" }, () => {
      console.log("Stored loginError in storage.");
    });
  } else {
    chrome.storage.local.set({ riskStatus: "reportError" }, () => {
      console.log("Stored reportError in storage.");
    });
  }
}

function getCurrentSettings(callback) {
  chrome.storage.sync.get(
    [
      "saveToDatabase",
      "detectLegalDoc",
      "generateReport",
      "showNotification",
      "safeMode",
    ],
    callback
  );
}

function getDetectSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      {
        termsConditions: true,
        privacyPolicy: true,
        contractAgreement: true,
        cookiePolicy: true,
      },
      (settings) => {
        resolve(settings);
      }
    );
  });
}

async function sendDataToServer(data) {
  isProcessing = true;

  try {
    const response = await fetch("wrapcapstone.com/process-webpage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: data.text,
        textTags: data.tags,
        url: data.url,
        title: data.title,
        headers: data.headers,
        footer: data.footer,
      }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      console.log("Process data successfull: ", responseData.data);
      return responseData.data;
    }

    return null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    isProcessing = false;
  }
}

async function generateReport(text, sections, textTags, saveToDatabase) {
  isProcessing = true;

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["token", "reportInfo"], (result) => {
      const token = result.token;
      const reportData = result.reportInfo;

      if (!token) {
        console.error("Token not found. User might not be logged in.");
        getCurrentSettings(async (settings) => {
          if (settings.showNotification) {
            chrome.notifications.create("userLogin", {
              type: "basic",
              iconUrl: "icons/error.png",
              title: "Error to Generate Report",
              message: "User is not logged in. Please log in.",
              priority: 1,
            });
          }
        });
        isProcessing = false;
        reject(new Error("Token not found"));
        return;
      }

      fetch("wrapcapstone.com/generate-report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          sections: sections,
          company: reportData.company,
          date: reportData.date,
          category: reportData.category,
          readability: reportData.readability,
          textTags: textTags,
          saveToDatabase: saveToDatabase,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              reject(new Error("Not logged in"));
              return;
            }
            return response.json().then((errorData) => {
              reject(
                new Error(errorData.message || "Failed to generate report")
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            console.log(data.data.risk_assessment);
            const documentID = data.documentID;
            chrome.storage.local.set({ documentID: documentID }, () => {
              console.log("Document ID stored:", documentID);
            });
            resolve(data);
          } else {
            reject(new Error("Failed to generate report"));
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
          getCurrentSettings(async (settings) => {
            if (settings.showNotification) {
              chrome.notifications.create("generateReportError", {
                type: "basic",
                iconUrl: "icons/error.png",
                title: "Error to Generate Report",
                message: error.message,
                priority: 1,
              });
            }
          });
          reject(error); // Reject the promise with the error
        })
        .finally(() => {
          isProcessing = false;
        });
    });
  });
}

async function sendDataToPopup(data) {
  console.log("Sending data back to popup: ", data);
  try {
    await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "updatePopup", data: data },
        function (response) {
          console.log(response);
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    });
    console.log("Data sent to popup successfully.");
  } catch (error) {
    console.error("Error sending data to popup:", error);
  }
}

async function sendRiskToPopup(data) {
  console.log("Sending risk back to popup: ", data);
  try {
    await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "updateRisk", data: data },
        function (response) {
          console.log(response);
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        }
      );
    });
    console.log("Data sent to popup successfully.");
  } catch (error) {
    console.error("Error sending data to popup:", error);
  }
}

async function sendNoResultToPopup() {
  console.log("No Legal Document Detected.");

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "noResult" }, (response) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve();
    });
  });
}

async function sendErrorToPopup() {
  console.log("Report Error.");

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "reportError" }, (response) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve();
    });
  });
}

async function isLegalDocument(header, title, url) {
  const settings = await getDetectSettings();

  const documentLabels = {
    "terms and conditions": settings.termsConditions
      ? [
          "terms & conditions",
          "terms and conditions",
          "terms of use",
          "terms of service",
          "user agreement",
          "other conditions",
        ]
      : [],
    "privacy policy": settings.privacyPolicy
      ? [
          "privacy policy",
          "policy documents",
          "data privacy",
          "gdpr compliance",
          "privacy statement",
        ]
      : [],
    "contract agreement": settings.contractAgreement
      ? [
          "contract agreement",
          "legal agreement",
          "end user license agreement",
          "eula",
          "service agreement",
        ]
      : [],
    "cookie policy": settings.cookiePolicy
      ? ["cookie policy", "cookie notice", "use of cookies", "tracking policy"]
      : [],
  };

  const content = [header, title, url]
    .map((item) => (item ? item.toLowerCase() : ""))
    .join(" ");

  let score = 0;
  for (const [category, terms] of Object.entries(documentLabels)) {
    if (terms.length === 0) continue;

    for (const term of terms) {
      const regex = new RegExp(term.replace(/\s+/g, "[\\s&]+"), "i");
      if (regex.test(content)) {
        score += 1;
        break;
      }
    }
  }

  return score > 0;
}

let requestCache = {};
const COOLDOWN_PERIOD = 5000; // 5 seconds

function isDuplicateRequest(tab, changeInfo) {
  const url = tab.url;
  const currentTime = Date.now();

  if (changeInfo.status === "complete") {
    if (
      requestCache[url] &&
      currentTime - requestCache[url] < COOLDOWN_PERIOD
    ) {
      console.log("Request throttled for URL:", url);
      return true;
    }

    requestCache[url] = currentTime;
    console.log("Sending request to backend for URL:", url);
    return false;
  }

  console.log("URL not completed yet");
  return true;
}

// const nonEssentialCookieRuleIds = [1000, 1001];

// chrome.declarativeNetRequest.updateSessionRules(
//   {
//     removeRuleIds: nonEssentialCookieRuleIds,
//     addRules: [
//       {
//         id: nonEssentialCookieRuleIds[0],
//         priority: 1,
//         action: {
//           type: "modifyHeaders",
//           requestHeaders: [{ header: "Cookie", operation: "remove" }],
//         },
//         condition: {
//           resourceTypes: ["main_frame", "xmlhttprequest"],
//           domains: ["*"], // for all domains, need to be tested -- Lianrui
//         },
//       },
//       {
//         id: nonEssentialCookieRuleIds[1],
//         priority: 1,
//         action: {
//           type: "modifyHeaders",
//           responseHeaders: [{ header: "Set-Cookie", operation: "remove" }],
//         },
//         condition: {
//           resourceTypes: ["main_frame", "xmlhttprequest"],
//           domains: ["*"],
//         },
//       },
//     ],
//   },
//   () => {
//     if (chrome.runtime.lastError) {
//       console.error(
//         "Error updating declarativeNetRequest rules:",
//         chrome.runtime.lastError
//       );
//     } else {
//       console.log("Non-essential cookie blocking rules updated.");
//     }
//   }
// );

// // Use webRequest listeners to log request and response headers
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function (details) {
//     console.log(
//       "Blocked outgoing request with headers:",
//       details.requestHeaders
//     );
//     return { requestHeaders: details.requestHeaders };
//   },
//   { urls: ["<all_urls>"] }, // Match all URLs
//   ["requestHeaders"]
// );

// chrome.webRequest.onHeadersReceived.addListener(
//   function (details) {
//     console.log(
//       "Blocked incoming response with headers:",
//       details.responseHeaders
//     );
//     return { responseHeaders: details.responseHeaders };
//   },
//   { urls: ["<all_urls>"] },
//   ["responseHeaders"]
// );

function updateSettingsBasedOnSafeMode(safeMode) {
  if (safeMode) {
    const nonEssentialCookieRuleIds = [1000, 1001];

    // Update cookie blocking rules to block third-party cookies only
    chrome.declarativeNetRequest.updateSessionRules(
      {
        removeRuleIds: nonEssentialCookieRuleIds,
        addRules: [
          {
            id: nonEssentialCookieRuleIds[0],
            priority: 1,
            action: {
              type: "modifyHeaders",
              requestHeaders: [{ header: "Cookie", operation: "remove" }],
            },
            condition: {
              resourceTypes: [
                "xmlhttprequest",
                "sub_frame",
                "image",
                "script",
                "stylesheet",
                "object",
                "media",
                "font",
                "other",
              ],
              // Apply to third-party domains only
              domainType: "thirdParty",
            },
          },
          {
            id: nonEssentialCookieRuleIds[1],
            priority: 1,
            action: {
              type: "modifyHeaders",
              responseHeaders: [{ header: "Set-Cookie", operation: "remove" }],
            },
            condition: {
              resourceTypes: [
                "xmlhttprequest",
                "sub_frame",
                "image",
                "script",
                "stylesheet",
                "object",
                "media",
                "font",
                "other",
              ],
              // Apply to third-party domains only
              domainType: "thirdParty",
            },
          },
        ],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error updating declarativeNetRequest rules:",
            chrome.runtime.lastError
          );
        } else {
          console.log("Non-essential cookie blocking rules updated.");
        }
      }
    );

    // Use webRequest listeners to log request and response headers
    chrome.webRequest.onBeforeSendHeaders.addListener(
      logRequestHeaders,
      { urls: ["<all_urls>"] },
      ["requestHeaders"]
    );
    chrome.webRequest.onHeadersReceived.addListener(
      logResponseHeaders,
      { urls: ["<all_urls>"] },
      ["responseHeaders"]
    );
  } else {
    // remove listeners
    chrome.declarativeNetRequest.updateSessionRules(
      { removeRuleIds: nonEssentialCookieRuleIds },
      () => {
        console.log("Non-essential cookie blocking rules removed.");
      }
    );
    chrome.webRequest.onBeforeSendHeaders.removeListener(logRequestHeaders);
    chrome.webRequest.onHeadersReceived.removeListener(logResponseHeaders);
  }
}

function logRequestHeaders(details) {
  console.log(
    "Outgoing request to:",
    details.url,
    "with headers:",
    details.requestHeaders
  );
  return { requestHeaders: details.requestHeaders };
}

function logResponseHeaders(details) {
  console.log(
    "Incoming response from:",
    details.url,
    "with headers:",
    details.responseHeaders
  );
  return { responseHeaders: details.responseHeaders };
}

getCurrentSettings((settings) =>
  updateSettingsBasedOnSafeMode(settings.safeMode)
);

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.safeMode) {
    console.log("Save Mode is changed to " + changes.safeMode.newValue);
    getCurrentSettings((settings) =>
      updateSettingsBasedOnSafeMode(settings.safeMode.newValue)
    );
  }
});
