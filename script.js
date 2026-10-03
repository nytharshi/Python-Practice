const files = [
    "To calculate 10% hike every year.py",
    "To calculate average investment cost per share.py",
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
const code = document.getElementById("code");

files.forEach(file => {
    const option = document.createElement("option");
    option.value = file;
    option.textContent = file;
    select.appendChild(option);
});

select.addEventListener("change", async () => {
    if (!select.value) {
        code.textContent = "Select a Python program to view its code.";
        return;
    }

    const url =
        "https://raw.githubusercontent.com/nytharshi/Python-Practice/main/" +
        encodeURIComponent(select.value);

    const response = await fetch(url);
    const text = await response.text();

    code.textContent = text;
});