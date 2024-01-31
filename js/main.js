var index = 0;

function handleSubmit(event) {
    event.preventDefault();
    var inputData = document.getElementById('inputValue').value;
    var displayDiv = document.getElementById('typeWriterEffect');
    processHTML(inputData, displayDiv, displayDiv, null, 0, 0);
}

function typeOutText(text, container, callback, typeSpeed = 10) {
    let charIndex = 0;
    let textNode = document.createTextNode("");
    container.appendChild(textNode);

    function typeChar() {
        if (charIndex < text.length) {
            textNode.data += text[charIndex++];
            setTimeout(typeChar, typeSpeed);
        } else if (callback) {
            callback();
        }
    }

    typeChar();
}

function processHTML(html, displayDiv, parentElement = displayDiv, callback, index = 0, level = 0) {
    if (index >= html.length) {
        if (callback) callback();
        return;
    }

    let startTagIndex = html.indexOf('<', index);
    if (startTagIndex !== -1 && startTagIndex > index) {
        let textContent = html.substring(index, startTagIndex);
        typeOutText(textContent, parentElement, () => {
            processTag(html, displayDiv, parentElement, callback, startTagIndex, level);
        });
    } else if (startTagIndex !== -1) {
        processTag(html, displayDiv, parentElement, callback, startTagIndex, level);
    } else {
        let textContent = html.substring(index);
        typeOutText(textContent, parentElement, callback);
    }
}

function processTag(html, displayDiv, parentElement, callback, startTagIndex, level) {
    let endTagIndex = html.indexOf('>', startTagIndex);
    if (endTagIndex === -1) {
        if (callback) callback();
        return;
    }

    let fullTag = html.substring(startTagIndex + 1, endTagIndex).trim();
    let isClosingTag = fullTag.startsWith('/');
    if (isClosingTag) {
        if (callback) callback();
        return;
    }

    let firstSpaceIndex = fullTag.indexOf(' ');
    let tagName = firstSpaceIndex !== -1 ? fullTag.substring(0, firstSpaceIndex) : fullTag;
    let element = document.createElement(tagName);
    parentElement.appendChild(element);

    if (firstSpaceIndex !== -1) {
        let attributesString = fullTag.substring(firstSpaceIndex + 1);
        let attributePattern = /(\w+)(="[^"]*"|='[^']*'|=[^\s>]*)(?=\s|$)/g;
        let match;
        while ((match = attributePattern.exec(attributesString)) !== null) {
            let attrName = match[1];
            let attrValue = match[2].substring(2, match[2].length - 1);
            element.setAttribute(attrName, attrValue);
        }
    }

    let closingTag = `</${tagName}>`;
    let closingTagIndex = html.indexOf(closingTag, endTagIndex);
    if (closingTagIndex !== -1) {
        processHTML(html, displayDiv, element, () => {
            processHTML(html, displayDiv, parentElement, callback, closingTagIndex + closingTag.length, level);
        }, endTagIndex + 1, level + 1);
    } else {
        processHTML(html, displayDiv, parentElement, callback, endTagIndex + 1, level);
    }
}

let form = document.getElementById('html-form');
form.addEventListener('submit', handleSubmit);