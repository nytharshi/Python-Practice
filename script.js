const owner = "nytharshi";
const repo = "Python-Practice";
const branch = "main";

const select = document.getElementById("fileSelect");
const codeBox = document.getElementById("code");
const inputBox = document.getElementById("input");
const outputBox = document.getElementById("output");
const runButton = document.getElementById("run");

let currentCode = "";

async function loadFiles() {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
        );

        const data = await response.json();

        const pythonFiles = data.tree.filter(
            file =>
                file.type === "blob" &&
                file.path.endsWith(".py")
        );

        pythonFiles.forEach(file => {
            const option = document.createElement("option");

            option.value = file.path;
            option.textContent = file.path;

            select.appendChild(option);
        });

    } catch (error) {
        outputBox.textContent = "Could not load Python files.";
        console.error(error);
    }
}

select.addEventListener("change", async () => {
    const file = select.value;

    if (!file) {
        codeBox.textContent = "Select a Python program.";
        return;
    }

    const url =
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURIComponent(file)}`;

    const response = await fetch(url);

    currentCode = await response.text();

    codeBox.textContent = currentCode;

    outputBox.textContent =
        "Click Run Code to execute the program.";
});

runButton.addEventListener("click", async () => {

    if (!currentCode) {
        outputBox.textContent =
            "Please select a Python program.";
        return;
    }

    outputBox.textContent = "Running...";
    runButton.disabled = true;

    try {

        const response = await fetch("/api/run", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                code: currentCode,
                input: inputBox.value
            })
        });

        const data = await response.json();

        outputBox.textContent =
            data.output || "Program finished.";

    } catch (error) {

        outputBox.textContent =
            "Error: " + error;

    }

    runButton.disabled = false;
});

loadFiles();