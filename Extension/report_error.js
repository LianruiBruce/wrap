function reportError() {
  const modalCSS = `
    /* Reset some default styles */
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    /* Style the modal backdrop */
    .report-error {
        display: none; /* Start hidden, toggle this with JavaScript */
        position: fixed;
        z-index: 1001;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Dimmed background */
    }
    
    /* Style the modal content box */
    .modal-content {
        position: relative;
        background-color: #292929; /* Dark background for the modal */
        margin: 10% auto; /* Positioning of the modal */
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 400px; /* Set a max-width for larger screens */
    }
    
    /* Style the form elements */
    .modal-content h2,
    .modal-content label,
    .modal-content input,
    .modal-content textarea,
    .modal-content button {
        color: white; /* Text color */
    }
    
    .modal-content h2 {
        margin-bottom: 20px; /* Space below the header */
    }
    
    .modal-content label {
        display: block;
        margin: 10px 0 5px; /* Spacing around labels */
    }
    
    .modal-content input[type="text"],
    .modal-content input[type="email"],
    .modal-content input[type="file"],
    .modal-content textarea {
        width: 100%;
        margin-bottom: 15px;
        border: 1px solid #555; /* Subtle border */
        background-color: #1a1a1a; /* Slightly lighter background */
        padding: 10px;
        border-radius: 4px;
    }
    
    .modal-content textarea {
        min-height: 100px; /* Minimum height for text area */
        resize: vertical; /* Allow vertical resize only */
    }
    
    /* Styling the file input */
    .modal-content input[type="file"] {
        cursor: pointer;
    }
    
    /* Style the buttons */
    .buttons {
        display: flex;
        justify-content: space-between; /* Space between buttons */
    }
    
    .cancel-btn,
    .submit-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    
    .cancel-btn {
        background-color: #d9534f; /* Bootstrap 'btn-danger' color */
    }
    
    .submit-btn {
        background-color: #5cb85c; /* Bootstrap 'btn-success' color */
    }
    
    /* Hover effect for buttons */
    .cancel-btn:hover,
    .submit-btn:hover {
        opacity: 0.8;
    }
    
    /* Ensure that the modal is scrolled into view if content is long */
    .modal-content {
        overflow-y: auto;
        max-height: 90vh;
    }
    
    /* Optional: Animation for modal appearance */
    .report-error.show {
        animation: fadeInModal 0.5s forwards;
    }
    
    @keyframes fadeInModal {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }    
    `;

  // Insert CSS into the <head>
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(modalCSS));
  document.head.appendChild(styleElement);
  // Create the container for the modal
  const modalContainer = document.createElement("div");
  modalContainer.setAttribute("id", "report-error");
  modalContainer.setAttribute("class", "report-error");
  modalContainer.style.display = "none"; // Start hidden, display it based on certain conditions

  // Modal content
  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modal-content");

  // Adding the title
  const title = document.createElement("h2");
  title.textContent = "Wrap Issue Report";

  // Form
  const form = document.createElement("form");
  form.setAttribute("action", "/submit-issue");
  form.setAttribute("method", "post");
  form.setAttribute("enctype", "multipart/form-data");

  // Issue Description
  const issueDescLabel = document.createElement("label");
  issueDescLabel.setAttribute("for", "issue-description");
  issueDescLabel.textContent = "Issue Description";
  const issueDescTextarea = document.createElement("textarea");
  issueDescTextarea.setAttribute("id", "issue-description");
  issueDescTextarea.setAttribute("name", "issue-description");
  issueDescTextarea.setAttribute(
    "placeholder",
    "Describe your issue in detail..."
  );

  // Issue Image
  const issueImageLabel = document.createElement("label");
  issueImageLabel.setAttribute("for", "issue-image");
  issueImageLabel.textContent = "Issue Showcase";
  const issueImageInput = document.createElement("input");
  issueImageInput.setAttribute("type", "file");
  issueImageInput.setAttribute("id", "issue-image");
  issueImageInput.setAttribute("name", "issue-image");

  // Email Address
  const emailLabel = document.createElement("label");
  emailLabel.setAttribute("for", "email");
  emailLabel.textContent = "Email Address";
  const emailInput = document.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.setAttribute("id", "email");
  emailInput.setAttribute("name", "email");

  // Buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("class", "buttons");
  const cancelButton = document.createElement("button");
  cancelButton.setAttribute("type", "button");
  cancelButton.setAttribute("class", "cancel-btn");
  cancelButton.textContent = "Cancel";
  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("class", "submit-btn");
  submitButton.textContent = "Submit";

  // Appending elements
  buttonsDiv.appendChild(cancelButton);
  buttonsDiv.appendChild(submitButton);

  form.appendChild(issueDescLabel);
  form.appendChild(issueDescTextarea);
  form.appendChild(issueImageLabel);
  form.appendChild(issueImageInput);
  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(buttonsDiv);

  modalContent.appendChild(title);
  modalContent.appendChild(form);

  modalContainer.appendChild(modalContent);

  // Append the modal to the document body
  document.body.appendChild(modalContainer);
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "openModal") {
      modalContainer.style.display = "block"; // Show the modal
      sendResponse({ status: "Modal opened" });
    }
  });

  // Functionality to close the modal
  cancelButton.addEventListener("click", function () {
    modalContainer.style.display = "none";
  });

  // Functionality to submit the form
  submitButton.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);

    // Log form data for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Check if file and other inputs are being logged correctly
    }

    try {
      const response = await fetch("/submit-issue", {
        method: "POST",
        body: formData,
      });

      // Log the response status and check if it's OK (200-299)
      if (response.ok) {
        alert("Issue report submitted successfully!");
        modalContainer.style.display = "none";
      } else {
        const errorText = await response.text(); // Get the error message from the server (if any)
        console.error("Server Error:", response.status, errorText);
        alert(`Failed to submit the issue report. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error); // Log any fetch-specific errors (like network issues)
      alert("Error submitting the issue report. Please try again.");
    }
  });
}

reportError();
