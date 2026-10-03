const owner = "nytharshi";
const repo = "Python-Practice";
const branch = "main";

const select = document.getElementById("fileSelect");
const codeBox = document.getElementById("code");
const inputBox = document.getElementById("input");
const outputBox = document.getElementById("output");
const runButton = document.getElementById("run");

let currentCode = "";
let pyodide = null;

// Load Pyodide
async function loadPython() {
    outputBox.textContent = "Loading Python engine...";

    try {
        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js";

        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });

        pyodide = await loadPyodide();

        outputBox.textContent = "Python ready.";

    } catch (error) {
        outputBox.textContent =
            "Could not load Python: " + error;
    }
}


// Load Python files from GitHub
async function loadFiles() {

    try {

        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
        );

        const data = await response.json();

        const pythonFiles = data.tree.filter(
    file =>
        file.type === "blob" &&
        file.path.endsWith(".py") &&
        file.path !== "streamlit_app.py" &&
        file.path !== "api/run.py"
);
        pythonFiles.forEach(file => {

            const option = document.createElement("option");

            option.value = file.path;
            option.textContent = file.path;

            select.appendChild(option);

        });

    } catch (error) {

        outputBox.textContent =
            "Could not load Python files.";

        console.error(error);
    }
}


// Find input() calls and create input boxes
function createInputFields(code) {

    inputBox.innerHTML = "";

    const inputRegex =
        /input\s*\(\s*(?:"([^"]*)"|'([^']*)')?\s*\)/g;

    const matches = [...code.matchAll(inputRegex)];

    if (matches.length === 0) {

        inputBox.style.display = "none";

        return;

    }

    inputBox.style.display = "block";

    matches.forEach((match, index) => {

        const prompt =
            match[1] !== undefined
                ? match[1]
                : match[2] !== undefined
                    ? match[2]
                    : `Input ${index + 1}`;

        const label = document.createElement("label");

        label.textContent = prompt;

        label.style.display = "block";
        label.style.marginBottom = "8px";
        label.style.marginTop = index === 0 ? "0" : "18px";

        const input = document.createElement("input");

        input.type = "text";
        input.className = "python-input";
        input.dataset.index = index;

        input.placeholder = "Enter value...";

        input.style.width = "100%";
        input.style.boxSizing = "border-box";
        input.style.padding = "12px";
        input.style.marginBottom = "5px";
        input.style.borderRadius = "8px";
        input.style.border = "1px solid #555";
        input.style.background = "#11151c";
        input.style.color = "white";
        input.style.fontSize = "16px";

        inputBox.appendChild(label);
        inputBox.appendChild(input);
    });
}


// When a Python file is selected
select.addEventListener("change", async () => {

    const file = select.value;

    if (!file) {

        codeBox.textContent =
            "Select a Python program.";

        inputBox.innerHTML = "";
        inputBox.style.display = "none";

        return;
    }

    try {

        const url =
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURIComponent(file)}`;

        const response = await fetch(url);

        currentCode = await response.text();

        codeBox.textContent = currentCode;

        createInputFields(currentCode);

        outputBox.textContent =
            "Click Run Code to execute the program.";

    } catch (error) {

        outputBox.textContent =
            "Could not load this Python file.";

        console.error(error);
    }
});


// Run Python
runButton.addEventListener("click", async () => {

    if (!currentCode) {

        outputBox.textContent =
            "Please select a Python program.";

        return;
    }

    if (!pyodide) {

        outputBox.textContent =
            "Python is still loading. Please wait.";

        return;
    }

    const inputs = [
        ...document.querySelectorAll(".python-input")
    ];

    const values = inputs.map(input => input.value);

    let inputIndex = 0;

    let output = "";

    runButton.disabled = true;
    runButton.textContent = "Running...";

    outputBox.textContent = "Running...";

    try {

        // Provide input() values to Python
        pyodide.setStdin({
            stdin: () => {

                if (inputIndex < values.length) {

                    return values[inputIndex++];

                }

                return null;
            }
        });

        // Capture print() output
        pyodide.setStdout({
            batched: message => {
                output += message + "\n";
            }
        });

        pyodide.setStderr({
            batched: message => {
                output += message + "\n";
            }
        });

        await pyodide.runPythonAsync(currentCode);

        outputBox.textContent =
            output || "Program finished.";

    } catch (error) {

        outputBox.textContent =
            output + "\nError:\n" + error;

    } finally {

        runButton.disabled = false;
        runButton.textContent = "▶ Run Code";

    }
});


// Start everything
inputBox.style.display = "none";

loadFiles();

loadPython();