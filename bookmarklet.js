var geval = this.execScript || eval;

function addSiblingButton(element) {
    //
    const siblingButton = document.createElement("button");
    siblingButton.innerText = "Run Code";
    siblingButton.className = "flex ml-auto gap-2"
    // Create the SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("class", "h-4 w-4");
    svg.setAttribute("height", "1em");
    svg.setAttribute("width", "1em");

    // Create the path element
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M3.78 2L3 2.41v12l.78.42 9-6V8l-9-6zM4 13.48V3.35l7.6 5.07L4 13.48");
    path.setAttribute("fill", "#000000");

    // Append the path element to the SVG element
    svg.appendChild(path);

    // Append the SVG element to the document or any desired container
    siblingButton.appendChild(svg);


    siblingButton.addEventListener("click", () => {
        const codeElement = element.closest("pre").querySelector("code");
        if (codeElement) {
            const concatenatedText = Array.from(codeElement.childNodes).map((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    return node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    return node.innerText;
                } else {
                    return "";
                }
            }).join("");

            // Evaluate the concatenated code
            const output = geval(concatenatedText);
            console.log("Output:", output);

            const outputPre = document.createElement("pre");
            outputPre.innerText = "Output: " + output;
            element.closest("pre").insertAdjacentElement("afterend", outputPre);
        }
    });
    element.insertAdjacentElement("afterend", siblingButton);
}

function findPreElements(retries = 0) {
    const preElements = document.getElementsByTagName("pre");
    console.log(preElements);

    if (preElements.length === 0) {
        if (retries < 3) {
            console.log("Retrying in 1 second...");
            setTimeout(() => {
                findPreElements(retries + 1);
            }, 1000);
        } else {
            console.log("Cannot find elements");
        }
        return;
    }

    for (const preElement of preElements) {
        const buttonElement = preElement.querySelector("button");
        if (buttonElement) {
            addSiblingButton(buttonElement);
        }
    }
}

function watchDOM() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.tagName && addedNode.tagName.toLowerCase() === "pre") {
                        let retryCount = 0;

                        const checkButtonElement = () => {
                            const buttonElement = addedNode.querySelector("button");
                            if (buttonElement) {
                                addSiblingButton(buttonElement);
                            } else {
                                if (retryCount < 2) {
                                    console.log("Retrying to find buttonElement in 500ms...");
                                    setTimeout(checkButtonElement, 500);
                                    retryCount++;
                                } else {
                                    console.log("Can't find buttonElement");
                                }
                            }
                        };

                        checkButtonElement();
                    }
                }
            }
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

// Call the functions to start watching the DOM and find initial pre-elements
watchDOM();
findPreElements();


console.log("This prints to the console of the page (injected only if the page URL matches)");
