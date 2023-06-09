function generateIframe(parameters) {
    const iframe = document.createElement('iframe');
    // iframe.width = '880';
    // iframe.height = '425';
    iframe.frameBorder = '0';
    iframe.classList.add("rounded-md");

    const url = '//unpkg.com/javascript-playgrounds@^1.0.0/public/index.html';
    const encodedParams = encodeURIComponent(JSON.stringify(parameters));
    const hashString = '#data=' + encodedParams;

    iframe.src = url + hashString;

    return {iframe: iframe, iframeString: iframe.outerHTML};
}



function addSiblingButton(element) {
    //
    const siblingButton = document.createElement("button");
    siblingButton.className = "flex ml-auto gap-2";
    // Create the SVG element
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
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
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M3.78 2L3 2.41v12l.78.42 9-6V8l-9-6zM4 13.48V3.35l7.6 5.07L4 13.48");
    path.setAttribute("fill", "#000000");
    
    // Append the path element to the SVG element
    svg.appendChild(path);
    
    // Append the SVG element to the document or any desired container
    siblingButton.appendChild(svg);
    siblingButton.appendChild(document.createTextNode("Run Code"));
    
    
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

            const parameters = {
                code: `${concatenatedText}`,
                preset: "react", // "react","html"
                // styles: {
                //     header: {
                //         backgroundColor: 'red'
                //     }
                // },
                // playground:{enable:true},
                // panes: [
                //     'editor', {
                //         type: 'player',
                //         platform: 'web',
                //         modules: ['moment']
                //     },
                // ]
            };
            
            
            const playgroundIframe = generateIframe(parameters).iframe;
            playgroundIframe.width = "100%";
            playgroundIframe.height = "500px";
            element.closest("pre").insertAdjacentElement("afterend", playgroundIframe);
        }
    });
    element.insertAdjacentElement('beforebegin', siblingButton);
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
        buttonElement.classList.remove("ml-auto");
        buttonElement.style.marginLeft = "5px";
        console.log(buttonElement);
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
