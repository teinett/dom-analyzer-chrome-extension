function updateNodeInfo() {
    chrome.devtools.inspectedWindow.eval(
        `(function() {
      let el = $0;
      if (!el) return { elements: 0, info: "None selected", children: [] };

      // Count elements starting from <body>, excluding <body> itself
      let body = document.body;
      function countElements(node) {
        let count = node.nodeType === 1 ? 1 : 0;
        for (let i = 0; i < node.children.length; i++) {
          count += countElements(node.children[i]);
        }
        return count;
      }
      let totalElements = countElements(body) - 1; // Exclude <body> itself

      // Count elements for the selected element (including its children)
      let elements = countElements(el);

      function getElementInfo(node) {
        let tag = node.tagName.toLowerCase();
        let attributes = [];

        if (node.id) attributes.push("id='" + node.id + "'");
        if (node.className) attributes.push("class='" + node.className + "'");

        let dataAttrs = [];
        for (let i = 0; i < node.attributes.length; i++) {
          let attr = node.attributes[i];
          if (attr.name.startsWith("data-")) {
            dataAttrs.push(attr.name + "='" + attr.value + "'");
          }
        }

        attributes = attributes.concat(dataAttrs);

        return attributes.length > 0
          ? "&lt;" + tag + " " + attributes.join(" ") + "&gt;"
          : "&lt;" + tag + "&gt;";
      }

      function getChildren(node) {
        let children = [];
        for (let i = 0; i < node.children.length; i++) {
          children.push({
            info: getElementInfo(node.children[i]),
            children: getChildren(node.children[i]) // Recursively get children
          });
        }
        return children;
      }

      return {
        totalElements,
        elements,
        info: getElementInfo(el),
        children: getChildren(el)
      };
    })()`,
        (result, isException) => {
            if (!isException && result) {
                // Update the total elements count in "Total DOM Information"
                let totalElementsElem =
                    document.getElementById("total-elements");
                totalElementsElem.textContent = result.totalElements;

                if (result.totalElements < 800) {
                    totalElementsElem.textContent += " 🟢 (OK)";
                } else if (result.totalElements < 1400) {
                    totalElementsElem.textContent += " 🟠 (warning)";
                } else {
                    totalElementsElem.textContent += " 🔴 (too large)";
                }

                // Update the selected element's element count in "Selected element (including its children)"
                let elementCountElem = document.getElementById("element-count");
                elementCountElem.textContent = result.elements;

                document.getElementById("element-info").innerHTML = result.info;

                // Update children elements tree
                let childrenList = document.getElementById("children-list");
                childrenList.innerHTML = createChildrenTree(result.children);
            }
        }
    );
}

function createChildrenTree(children) {
    if (children.length === 0) return ""; // Don't show anything for empty nodes

    let html = ""; // Start without wrapping in <ul>
    for (let child of children) {
        if (child.children.length > 0) {
            // Only add <details> if the node has children
            html += `<li><details><summary>${
                child.info
            }</summary><ul>${createChildrenTree(
                child.children
            )}</ul></details></li>`;
        } else {
            // Otherwise, just show a normal <li>
            html += `<li>${child.info}</li>`;
        }
    }
    return html; // Return the list items without wrapping in <ul>
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(updateNodeInfo);
updateNodeInfo();
