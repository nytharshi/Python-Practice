import streamlit as st
import subprocess
import sys
import os
import re

st.title("🐍 Python Practice")
st.write("Choose any Python file from the repository and run it.")

# Find all Python files except the Streamlit app itself
files = sorted(
    f for f in os.listdir(".")
    if f.endswith(".py") and f != "streamlit_app.py"
)

if not files:
    st.warning("No Python practice files found.")
    st.stop()

# Choose a program
selected_file = st.selectbox("Choose a program", files)

# Read the selected program
with open(selected_file, "r", encoding="utf-8") as f:
    code = f.read()

# Find input() statements
input_pattern = r'input\(\s*(["\'])(.*?)\1\s*\)'
inputs = re.findall(input_pattern, code)

user_inputs = []

# Create input boxes
for i, (_, prompt) in enumerate(inputs):
    value = st.text_input(prompt, key=f"input_{i}")
    user_inputs.append(value)

# Run button
if st.button("▶ Run Program"):

    # Replace input() calls with the values entered on the website
    modified_code = code

    for value in user_inputs:
        modified_code = re.sub(
            input_pattern,
            lambda match, v=value: repr(v),
            modified_code,
            count=1
        )

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

        if not result.stdout and not result.stderr:
            st.info("Program finished with no output.")

    except subprocess.TimeoutExpired:
        st.error("Program took too long to finish.")

    except Exception as e:
        st.error(f"Something went wrong: {e}")