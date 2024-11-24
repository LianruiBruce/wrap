let isProcessing = false;
// This is rule IDs for non-essential cookies -- Lianrui

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
      // safeMode: true,
      termsConditions: true,
      privacyPolicy: true,
      contractAgreement: true,
      cookiePolicy: true,
    },
    () => {
      console.log("Default settings saved.");
    }
  );

  chrome.storage.local.remove(
    ["token", "reportInfo", "riskInfo", "riskStatus"],
    () => {
      chrome.action.setIcon({ path: "icons/Wrap_Red.png" });
      console.log("Token and report data removed from storage");
    }
  );
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
  if (tab.url && tab.url.startsWith("https://wrapcapstone.com")) {
    console.log("Skipping legal document detection for localhost:3000");
    return; // Don't execute further if the URL matches localhost:3000
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
    if (message.data.url == "https://wrapcapstone.com/mainpage") {
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
        message.data.headers2,
        message.data.title,
        message.data.url
      )
    ).valueOf();
    console.log("Is legal document: ", isLegalDoc);

    if (isLegalDoc) {
      chrome.storage.local.remove(
        ["reportInfo", "riskInfo", "riskStatus", "documentID"],
        () => {
          console.log("Token and report data removed from storage");
        }
      );

      keepAlive(true);

      chrome.action.setIcon({ path: "icons/Wrap_Yellow.png" });

      let reportData = await sendDataToServer(message.data);

      if (reportData && reportData != "") {
        if (!(reportData.company && reportData.category)) {
          chrome.action.setIcon({ path: "icons/Wrap.png" });
          chrome.action.setPopup({ popup: "extension_frontend/wrap.html" });
          await sendNoResultToPopup();
          isProcessing = false;
          keepAlive(false);
          return true;
        }

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
                "A legal document has been detected, but there was an error showing the report!",
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const validURL = "https://wrapcapstone.com/";

      if (currentTab && currentTab.url && currentTab.url.startsWith(validURL)) {
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
                message: "You have logged into the extension successfully!",
                priority: 1,
              });
            }
          });
        });

        sendResponse({ success: true });
      } else {
        console.error(
          "Login attempt from unauthorized source:",
          currentTab?.url
        );
        sendResponse({ success: false, error: "Unauthorized source" });
      }
    });

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
            message: "You have logged out of the extension successfully!",
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
        sendResponse({ success: false, message: "User not logged in." });
        return true;
      }

      keepAlive(true);

      fetch(`https://wrapcapstone.com/get-report-by-documentID`, {
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
    console.log("Home button clicked");
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
      // "safeMode",
      "termsConditions",
      "privacyPolicy",
      "contractAgreement",
      "cookiePolicy",
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
    const response = await fetch("https://wrapcapstone.com/process-webpage", {
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
      console.log("Process data successful: ", responseData.data);
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

      fetch("https://wrapcapstone.com/generate-report", {
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
          reject(error);
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

async function isLegalDocument(header, headers2, title, url) {
  console.log(header, headers2);
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
          "services agreement",
          "agreement of service",
          "user conditions",
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

  const content = [header, headers2, title, url]
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

// const MAX_DYNAMIC_RULES = 30000; // Theoretical max for dynamic rules
// const BATCH_SIZE = 5000; // Adjusted batch size for loading rules
// let currentBatchIndex = 0;

// // Function to update settings based on Safe Mode
// function updateSettingsBasedOnSafeMode(safeMode) {
//   const ruleFilePath = chrome.runtime.getURL("rules/ad_block_rules.json");

//   if (safeMode) {
//     // Clear all existing dynamic rules before loading new ones
//     clearAllDynamicRules().then(() => {
//       fetch(ruleFilePath)
//         .then((response) => response.json())
//         .then((rules) => {
//           const limitedRules = rules.slice(0, MAX_DYNAMIC_RULES);
//           currentBatchIndex = 0;
//           loadRulesInBatches(limitedRules);
//         })
//         .catch((error) => console.error("Failed to load rules from JSON:", error));
//     });
//   } else {
//     clearAllDynamicRules().then(() => {
//       console.log("All dynamic rules cleared upon exiting Safe Mode.");
//       reloadActiveTab();
//     });
//   }
// }

// // Helper function to load rules in batches
// function loadRulesInBatches(rules) {
//   const totalBatches = Math.ceil(rules.length / BATCH_SIZE);

//   const batchInterval = setInterval(() => {
//     if (currentBatchIndex >= totalBatches) {
//       clearInterval(batchInterval);
//       console.log("All batches loaded successfully.");
//       return;
//     }

//     const start = currentBatchIndex * BATCH_SIZE;
//     const batch = rules.slice(start, start + BATCH_SIZE);

//     chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
//       const currentRuleCount = existingRules.length;
//       const remainingCapacity = MAX_DYNAMIC_RULES - currentRuleCount;

//       if (remainingCapacity <= 0) {
//         console.warn("Cannot add more rules, dynamic rule limit reached.");
//         clearInterval(batchInterval);
//         return;
//       }

//       const adjustedBatch = batch.slice(0, remainingCapacity);

//       chrome.declarativeNetRequest.updateDynamicRules(
//         {
//           removeRuleIds: [],
//           addRules: adjustedBatch,
//         },
//         () => {
//           if (chrome.runtime.lastError) {
//             console.error("Error adding dynamic rules:", chrome.runtime.lastError);
//             clearInterval(batchInterval); // Stop if an error occurs
//           } else {
//             console.log(`Batch ${currentBatchIndex + 1} added with ${adjustedBatch.length} rules.`);
//             currentBatchIndex++;
//           }
//         }
//       );
//     });
//   }, 1000); // Adjust interval time if necessary
// }

// // Clear all dynamic rules
// function clearAllDynamicRules() {
//   return new Promise((resolve) => {
//     chrome.declarativeNetRequest.getDynamicRules((rules) => {
//       const ruleIds = rules.map((rule) => rule.id);
//       chrome.declarativeNetRequest.updateDynamicRules(
//         { removeRuleIds: ruleIds },
//         () => {
//           if (chrome.runtime.lastError) {
//             console.error("Error clearing dynamic rules:", chrome.runtime.lastError);
//           } else {
//             console.log("All dynamic rules cleared.");
//           }
//           resolve();
//         }
//       );
//     });
//   });
// }

// // Helper function to reload the active tab
// function reloadActiveTab() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     if (tabs.length > 0) {
//       chrome.tabs.reload(tabs[0].id);
//     }
//   });
// }

// // Initialize settings based on Safe Mode
// getCurrentSettings((settings) =>
//   updateSettingsBasedOnSafeMode(settings.safeMode)
// );

// // Listen for storage changes
// chrome.storage.onChanged.addListener((changes, area) => {
//   if (area === "sync" && changes.safeMode) {
//     console.log("Safe Mode is changed to " + changes.safeMode.newValue);
//     updateSettingsBasedOnSafeMode(changes.safeMode.newValue);
//   }
// });
