import streamlit as st
import subprocess
import sys
import os
import re

st.title("🐍 Python Practice")
st.write("Choose a Python program and run it!")

# Find all Python files in this folder
files = [
    f for f in os.listdir(".")
    if f.endswith(".py") and f != "streamlit_app.py"
]

files.sort()

if not files:
    st.warning("No Python practice files found.")
    st.stop()

selected_file = st.selectbox("Choose a program", files)

st.write("### Run:", selected_file)

# Read the selected Python file
with open(selected_file, "r", encoding="utf-8") as f:
    code = f.read()

# Find input() prompts in the Python program
inputs = re.findall(r'input\(\s*["\'](.*?)["\']\s*\)', code)

user_inputs = []

for i, prompt in enumerate(inputs):
    user_inputs.append(
        st.text_input(prompt, key=f"input_{i}")
    )

if st.button("▶ Run Program"):
    # Replace input() calls with the values entered on the website
    modified_code = code

    for value in user_inputs:
        modified_code = re.sub(
            r'input\(\s*["\'].*?["\']\s*\)',
            repr(value),
            modified_code,
            count=1
        )

    # Run the program
    try:
        result = subprocess.run(
            [sys.executable, "-c", modified_code],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.stdout:
            st.success("Output")
            st.code(result.stdout)

        if result.stderr:
            st.error("Error")
            st.code(result.stderr)

    except subprocess.TimeoutExpired:
        st.error("Program took too long to finish.")