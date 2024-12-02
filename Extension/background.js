let isProcessing = false;

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
      termsConditions: true,
      privacyPolicy: true,
      contractAgreement: true,
      cookiePolicy: true,
      subscriptionAgreement: true,
      purchaseTerms: true,
      rentalAgreement: true,
      warrantyPolicy: true,
      liabilityWaiver: true,
      employmentAgreement: true,
      accessPolicy: true,
      disputeResolution: true,
    },
    () => {
      console.log("Settings initialized");
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
    return;
  }

  checkTokenExpirationOnStartup((token) => {
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
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      const validURL = "https://wrapcapstone.com/";

      if (currentTab && currentTab.url && currentTab.url.startsWith(validURL)) {
        const token = message.token;
        console.log("Token received:", token);

        await storeToken(token);

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

    checkTokenExpirationOnStartup((token) => {
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
      "termsConditions",
      "privacyPolicy",
      "contractAgreement",
      "cookiePolicy",
      "subscriptionAgreement",
      "purchaseTerms",
      "rentalAgreement",
      "warrantyPolicy",
      "liabilityWaiver",
      "employmentAgreement",
      "accessPolicy",
      "disputeResolution",
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
        subscriptionAgreement: true,
        purchaseTerms: true,
        rentalAgreement: true,
        warrantyPolicy: true,
        liabilityWaiver: true,
        employmentAgreement: true,
        accessPolicy: true,
        disputeResolution: true,
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
    checkTokenExpirationOnStartup((token) => {
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
        handleRiskAssessmentError("Not logged in");
        reject(new Error("Not logged in"));
        return;
      }

      chrome.storage.local.get(["reportInfo"], (result) => {
        const reportData = result.reportInfo;
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
          "site terms",
          "use agreement",
          "terms of"
        ]
      : [],
    "privacy policy": settings.privacyPolicy
      ? [
          "privacy policy",
          "policy documents",
          "data privacy",
          "gdpr compliance",
          "privacy statement",
          "privacy terms",
          "data protection policy",
          "privacy choices"
        ]
      : [],
    "contract agreement": settings.contractAgreement
      ? [
          "contract agreement",
          "legal agreement",
          "end user license agreement",
          "eula",
          "service agreement",
          "licensing terms",
          "usage agreement",
        ]
      : [],
    "cookie policy": settings.cookiePolicy
      ? [
        "cookie policy",
        "cookie notice",
        "use of cookies",
        "tracking policy",
        "cookie terms",
        "cookie declaration",
        "data usage",
        "data collection",
        "cookies permissions",
        "data permissions"
      ]
      : [],
    "subscription agreement": settings.subscriptionAgreement
      ? [
        "subscription terms",
        "membership agreement",
        "auto-renewal terms",
        "recurring payment terms",
        "subscription service agreement",
      ]
      : [],
    "purchase terms": settings.purchaseTerms
      ? [
        "online purchase terms",
        "refund policy",
        "return policy",
        "purchase agreement",
        "sale terms",
        "installment agreement",
        "layaway terms",
      ]
      : [],
    "rental agreement": settings.rentalAgreement
      ? [
        "rental terms",
        "lease agreement",
        "rental agreement",
        "short-term rental policy",
        "property rental agreement",
      ]
      : [],
    "warranty policy": settings.warrantyPolicy
      ? [
        "warranty terms",
        "service guarantee",
        "product warranty",
        "extended warranty",
      ]
      : [],
    "liability waiver": settings.liabilityWaiver
      ? [
        "liability waiver",
        "indemnity agreement",
        "assumption of risk",
        "liability release",
      ]
      : [],
    "employment agreement": settings.employmentAgreement
      ? [
        "contractor agreement",
        "independent contractor terms",
        "nda",
        "freelance agreement",
      ]
      : [],
    "access policy": settings.accessPolicy
      ? [
        "access terms",
        "api use policy",
        "facility access agreement",
      ]
      : [],
    "dispute resolution": settings.disputeResolution
      ? [
        "arbitration agreement",
        "dispute resolution policy",
        "conflict resolution terms",
      ]
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

async function storeToken(token) {
  const expTime = parseTokenExpiration(token);
  if (!expTime) {
    console.error("Invalid token: cannot parse expiration.");
    return;
  }

  chrome.storage.local.set({ token, tokenExp: expTime }, () => {
    console.log("Token and expiration time stored:", expTime);

    chrome.action.setIcon({ path: "icons/Wrap.png" });
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

    scheduleExpirationNotification(expTime);
  });
}

function parseTokenExpiration(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch (error) {
    console.error("Failed to parse token expiration:", error);
    return null;
  }
}

function scheduleExpirationNotification(expTime) {
  const currentTime = Date.now();
  const notifyBeforeMs = 5 * 60 * 1000;
  const timeUntilNotify = expTime - currentTime - notifyBeforeMs;
  const timeExp = expTime - currentTime;

  if (timeUntilNotify > 0) {
    setTimeout(() => {
      getCurrentSettings(async (settings) => {
        if (settings.showNotification) {
          chrome.notifications.create("tokenExpiring", {
            type: "basic",
            iconUrl: "icons/warning.png",
            title: "Token Expiring Soon",
            message: "Your session token will expire in 5 minutes. Please log in again.",
            priority: 1,
          });
        }
      });
      console.log("Notification scheduled for token expiration.");
    }, timeUntilNotify);

    setTimeout(() => {
      handleTokenExpiration();
    }, timeUntilNotify + notifyBeforeMs);

  }
  else if (timeExp < 0)
  {
    console.warn("Token will expire very soon or already expired. Immediate handling triggered.");
    handleTokenExpiration();
  }
}

function handleTokenExpiration() {

  chrome.storage.local.remove(["token", "tokenExp"], () => {
    console.log("Token and related data removed from storage.");

    chrome.action.setIcon({ path: "icons/Wrap_Red.png" }, () => {
      console.log("Extension icon updated to Wrap_Red.png.");
    });

    getCurrentSettings(async (settings) => {
      if (settings.showNotification) {
        chrome.notifications.create("tokenExpired", {
          type: "basic",
          iconUrl: "icons/error.png",
          title: "Token Expired",
          message: "Your session token has expired. Please log in again.",
          priority: 2,
        });
      }
    });
  });
}

function checkTokenExpirationOnStartup(callback) {
  chrome.storage.local.get(["token", "tokenExp"], (result) => {
    const { token, tokenExp } = result;
    if (!token || !tokenExp) {
      console.log("No token found. Skipping expiration check.");
      callback(null);
      return;
    }

    const currentTime = Date.now();
    if (currentTime >= tokenExp) {
      console.log("Token already expired on startup.");
      handleTokenExpiration();
      callback(null);
    } else {
      console.log("Token is valid on startup. Scheduling expiration check.");
      scheduleExpirationNotification(tokenExp);
      callback(token);
    }
  });
}

