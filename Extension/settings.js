document.getElementById('back-btn').addEventListener('click', function() {
    chrome.storage.local.get('backpage', (result) => {
        let backpage = result.backpage;
        if (backpage)
        {
            window.location.href = backpage;
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const saveToDatabase = document.getElementById('saveToDatabase');
    const detectLegalDoc = document.getElementById('detectLegalDoc');
    const generateReport = document.getElementById('generateReport');
    const showNotification = document.getElementById('showNotification');
    const safeMode = document.getElementById('safeMode');

    const dropdown = document.getElementById('dropdown');

    // Load saved settings, and if they are not set, default to true
    chrome.storage.sync.get(['saveToDatabase', 'detectLegalDoc', 'generateReport', 'selectedOption', 'showNotification', 'safeMode'], (result) => {
        saveToDatabase.checked = result.saveToDatabase ?? true;
        detectLegalDoc.checked = result.detectLegalDoc ?? true;
        generateReport.checked = result.generateReport ?? true;
        showNotification.checked = result.showNotification ?? true;
        safeMode.checked = result.safeMode ?? true;
        dropdown.value = result.selectedOption || 'all';
    });

    // Save settings on change
    saveToDatabase.addEventListener('change', () => {
        chrome.storage.sync.set({ saveToDatabase: saveToDatabase.checked });
    });
    detectLegalDoc.addEventListener('change', () => {
        chrome.storage.sync.set({ detectLegalDoc: detectLegalDoc.checked });
    });
    generateReport.addEventListener('change', () => {
        chrome.storage.sync.set({ generateReport: generateReport.checked });
    });
    showNotification.addEventListener('change', () => {
        chrome.storage.sync.set({ showNotification: showNotification.checked });
    });
    safeMode.addEventListener('change', () => {
        chrome.storage.sync.set({ safeMode: safeMode.checked });
    });

    dropdown.addEventListener('change', function () {
        const selectedOption = dropdown.value;

        if (selectedOption === "all") {
            Array.from(dropdown.options).forEach(option => {
                chrome.storage.sync.set({ [option.value]: true });
            });
        } else {
            Array.from(dropdown.options).forEach(option => {
                chrome.storage.sync.set({ [option.value]: false });
            });
    
            chrome.storage.sync.set({ [selectedOption]: true });
        }

        chrome.storage.sync.set({ selectedOption: selectedOption });
        console.log("Selected Option is: " + selectedOption);
    });
});
