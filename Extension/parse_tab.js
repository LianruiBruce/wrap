function organizeIntoSections(textTags) {
    const sections = [];
    let currentSection = null;

    textTags.forEach(tagObj => {
        const { tag, content } = tagObj;
        
        // TODO: if h5 or h6, make sure it is trimmed so that len>~7 it is not a header but a subcontent
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
            if (['h5', 'h6'].includes(tag) && currentSection && currentSection.header.split(" ").length > 7) {
                currentSection.content += content.trim() + ' ';
            }
            if (currentSection) {
                sections.push(currentSection);
            }
            currentSection = {
                header: content.trim(),
                content: ''
            };
        } else {
            if (currentSection) {
                currentSection.content += content.trim() + ' ';
            }
        }
    });

    if (currentSection) {
        sections.push(currentSection);
    }

    return sections;
}

function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function cleanSpecialCharacters(text) {
    return text.replace(/\u00A0/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function getCleanMainContent(mainContent) {
    mainContent.querySelectorAll('script, noscript, style, input, textarea, select, button').forEach(el => el.remove());

    return mainContent;
}

function getTagForDiv(node) {
    const classList = node.classList;
    const id = node.id;

    if (classList && [...classList].some(cls => /h[1-6]|p/.test(cls))) {
        return classList.value.match(/h[1-6]|p/)[0];
    }
    if (id && /h[1-6]|p/.test(id)) {
        return id.match(/h[1-6]|p/)[0]; 
    }
    return 'div';
}

function shouldSkipNode(node, tagName, skipTags, skipPatterns) {
    return skipTags.includes(tagName) ||
        skipPatterns.includes(tagName) ||
        node.matches('[class^="header"], [class^="footer"], [id^="header"], [id^="footer"], [class^="navbar"], [class^="sidebar"], [id^="navbar"], [id^="sidebar"]');
}


function shouldSkipDueToStyle(node, style) {
    return style.display === 'none' || style.visibility === 'hidden' || 
        node.getAttribute('aria-hidden') === 'true' || node.hasAttribute('hidden') ||
        parseFloat(style.fontSize) === 0;
}

function hasTooMuchClickableContent(node) {
    let totalText = node && node.innerText ? node.innerText.trim().length : 0;
    if (totalText === 0) return false;
    
    let clickableTextLength = 0;
    const clickableElements = node.querySelectorAll(
        'a, button, [onclick], [role="button"], input[type="button"], input[type="submit"], .cursor-pointer'
    );

    clickableElements.forEach(clickable => {
        const style = window.getComputedStyle(clickable);
        if (!shouldSkipDueToStyle(clickable, style)) {
            clickableTextLength += getVisibleTextLength(clickable);
        }
    });

    return clickableTextLength / totalText > 0.25;
}

function getVisibleTextLength(node) {
    let visibleTextLength = 0;

    if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.nodeValue.trim();
        if (textContent.length > 0) {
            visibleTextLength += textContent.length;
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const style = window.getComputedStyle(node);
        if (!shouldSkipDueToStyle(node, style)) {
            node.childNodes.forEach(child => {
                visibleTextLength += getVisibleTextLength(child);
            });
        }
    }

    return visibleTextLength;
}

function createNewBlockTag(textTags, tagName, content = '') {
    textTags.push({ tag: tagName, content });
}

function traverseNode(node, insideBlock, result, textTags, inlineTags, blockTags, skipTags, skipPatterns) {
    if (!node) return { result, textTags };

    let tagName = node.nodeType === Node.ELEMENT_NODE ? node.tagName.toLowerCase() : '';
    if (tagName === 'div') {
        tagName = getTagForDiv(node);
    }

    if (node.nodeType === Node.ELEMENT_NODE && shouldSkipNode(node, tagName, skipTags, skipPatterns)) {
        return { result, textTags };
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
        const style = window.getComputedStyle(node);
        if (shouldSkipDueToStyle(node, style) || hasTooMuchClickableContent(node)) {
            return { result, textTags };
        }
    }

    if (node.nodeType === Node.ELEMENT_NODE && tagName === 'a') {
        const href = node.getAttribute('href');
        if (href && href.startsWith('#')) {
            return { result, textTags };
        }
    }

    if (node.nodeType === Node.ELEMENT_NODE && blockTags.includes(tagName)) {
        if (!insideBlock) {
            result += '\n';
        }
        insideBlock = true;

        createNewBlockTag(textTags, tagName);
    }

    if (tagName === 'br') {
        result += '\n';

        createNewBlockTag(textTags, 'p', '');
        return { result, textTags }; 
    }

    if (node.nodeType === Node.TEXT_NODE) {
        let textContent = node.nodeValue.trim();
        if (textContent && textContent.length > 4) {
            textContent = cleanSpecialCharacters(textContent);
            result += textContent + ' ';

            if (textTags.length > 0) {
                textTags[textTags.length - 1].content += textContent + ' ';
            } else {
                createNewBlockTag(textTags, 'p', textContent + ' ');
            }
        }
    }

    node.childNodes.forEach(child => {
        ({ result, textTags } = traverseNode(child, insideBlock, result, textTags, inlineTags, blockTags, skipTags, skipPatterns));
    });

    if (node.nodeType === Node.ELEMENT_NODE && blockTags.includes(tagName)) {
        result = result.trim() + '\n'; 
        textTags[textTags.length - 1].content = textTags[textTags.length - 1].content.trim();
        if (!textTags[textTags.length - 1].content) {
            textTags.pop();
        }
    }

    return { result, textTags };
}

function findMainContent(doc) {
    let mainContent = doc.querySelector('main') ||
        doc.querySelector('div[class="main-content"], div[id="main-content"], div[class="main"], div[id="main"]') ||
        doc.body;

    const inlineTags = ['b', 'i', 'strong', 'em', 'u', 'span', 'a', 'small', 'sup', 'sub'];
    const blockTags = ['p', 'li', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'section', 'table'];
    const skipTags = ['script', 'noscript', 'iframe', 'style', 'button', 'img', 'video', 'svg', 'object', 'embed', 'input', 'textarea', 'select'];
    const skipPatterns = ['header', 'footer', 'nav', 'navbar', 'sidebar', 'nav-bar', 'side-bar'];

    let result = '';
    let textTags = [];

    ({ result, textTags } = traverseNode(mainContent, false, result, textTags, inlineTags, blockTags, skipTags, skipPatterns));

    let filteredTags = textTags.filter(tt => tt.content !== '');

    let sections = organizeIntoSections(filteredTags);

    json_tags = JSON.stringify(filteredTags);
    json_sections = JSON.stringify(sections);

    return { content: result, tags: json_tags, sections: json_sections };
}

function getFooterText(doc) {
    let footer = doc.querySelector('footer, div#footer, div.footer');
    
    let footerText = "";
    if (footer) {
        footerText = extractCompanyName(footer.innerText || ""); 
    } else {
        const divs = doc.querySelectorAll('div');
        for (let div of divs) {
            const text = div.innerText.toLowerCase();
            if (text.includes('contact') || text.includes('©') || text.includes('rights reserved')) {
                footerText = extractCompanyName(div.innerText);
                break;
            }
        }
    }
    
    return footerText ? cleanText(footerText) : "";
}

function extractCompanyName(text) {
    // Pattern to match © or Copyright statements and extract the company name

    const pattern = /(?:©|Copyright|Copyright\s*©?)\s*[\d\s-]*\s*([A-Za-z0-9\s\.,&\-'’]+?)(?:\s*(?:All\s*Rights\s*Reserved|All\s*rights\s*reserved|LLC|Ltd|Inc|Co\.|Technologies|Company|Corporation|Corp|Limited|L\.?P\.?|LLP|Pty\.? Ltd\.?|[A-Za-z]+\.|Terms\s*of\s*Service|Privacy|Legal|Cookies\s*Settings)\s*|$)/i;    
    let match = pattern.exec(text);
    if (match) {
        return match[1].trim();
    }

    return "";
}

if (!window.isListenerRegistered) {
    window.isListenerRegistered = true;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(`Received message: ${JSON.stringify(request)} from ${sender.tab ? `tab ${sender.tab.id}` : 'background'}`);

        if (request.action === "parseURL" && request.html) {
            console.log("Handling 'parseURL' message.");
            const parser = new DOMParser();
            const doc = parser.parseFromString(request.html, "text/html");

            let main = findMainContent(doc);

            let data = {
                tags: main.tags,
                text: main.content,
                sections: main.sections,
                url: request.url,
                title: doc.title,
                headers: cleanText(doc.querySelector('h1') ? doc.querySelector('h1').textContent : ''),
                footer: getFooterText(doc)
            };

            chrome.runtime.sendMessage({ type: 'extracted-data', data: data });
        }

        if (request.action === "parseTab") {
            console.log("Handling 'parseTab' message.");
            if (window === window.top) {
                let main = findMainContent(document);

                let data = {
                    tags: main.tags,
                    text: main.content,
                    sections: main.sections,
                    url: window.location.href,
                    title: document.title,
                    headers: cleanText(document.querySelector('h1') ? document.querySelector('h1').textContent : ''),
                    footer: getFooterText(document)
                };

                console.log(data.text);
                console.log(data.tags);
                console.log(data.sections);

                chrome.runtime.sendMessage({ type: 'extracted-data', data: data });
            }
        }
    });

    console.log("Message listener registered.");
} else {
    console.log("Message listener already registered, skipping.");
}
