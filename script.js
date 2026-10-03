let pyodide = null;

const files = [
    "To calculate average investment cost per share.py",
    "To calculate 10% hike every year.py",
    "To check if a number is prime.py",
    "To get gross profit, net profit and net profit percentage.py",
    "To swap two numbers using third variable.py",
    "Write a program to check whether a number is divisible by 5 and 11.py",
    "Write a program to check whether a number is even or odd.py",
    "Write a program to check whether a number is positive, negative, or zero.py",
    "Write a program to check whether a person is eligible to vote or not.py",
    "Write a program to find the absolute value of a number.py",
    "Write a program to find the greater of two numbers entered by the user.py"
];

const select = document.getElementById("fileSelect");
const codeBox = document.getElementById("code");
const outputBox = document.getElementById("output");
const runButton = document.getElementById("runButton");

files.forEach(file => {
    const option = document.createElement("option");
    option.value = file;
    option.textContent = file;
    select.appendChild(option);
});

select.addEventListener("change", async () => {

    if (!select.value) {
        codeBox.textContent = "Select a Python program to view its code.";
        return;
    }

    const url =
        "https://raw.githubusercontent.com/nytharshi/Python-Practice/main/" +
        encodeURIComponent(select.value);

    const response = await fetch(url);
    const text = await response.text();

    codeBox.textContent = text;
    outputBox.textContent = "Click 'Run Code' to execute this program.";
});

async function loadPython() {

    outputBox.textContent = "Loading Python...";

    pyodide = await loadPyodide();

    outputBox.textContent = "Python is ready! Select a program and click Run Code.";
}

runButton.addEventListener("click", async () => {

    if (!select.value) {
        outputBox.textContent = "Please select a Python program first.";
        return;
    }

    if (!pyodide) {
        outputBox.textContent = "Python is still loading. Please wait.";
        return;
    }

    runButton.disabled = true;
    outputBox.textContent = "Running...";

    try {

        const code = codeBox.textContent;

        let output = "";

        pyodide.setStdout({
            batched: (text) => {
                output += text;
            }
        });

        pyodide.setStderr({
            batched: (text) => {
                output += text;
            }
        });

        await pyodide.runPythonAsync(code);

        if (output === "") {
            output = "Program finished successfully.";
        }

        outputBox.textContent = output;

    } catch (error) {

        outputBox.textContent = error;

    }

    runButton.disabled = false;
});

loadPython();