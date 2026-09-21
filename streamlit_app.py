import streamlit as st

st.title("🐍 Python Practice")
st.write("Try my Python programs!")

program = st.selectbox(
    "Choose a program",
    [
        "Even or Odd",
        "Positive, Negative or Zero",
        "Voting Eligibility",
        "Absolute Value",
        "Greater of Two Numbers",
    ],
)

if program == "Even or Odd":
    x = st.number_input("Enter a number", step=1)
    if st.button("Run"):
        st.write(f"{x:g} is {'even' if x % 2 == 0 else 'odd'}")

elif program == "Positive, Negative or Zero":
    x = st.number_input("Enter a number", step=1)
    if st.button("Run"):
        if x > 0:
            st.write("It is positive")
        elif x < 0:
            st.write("It is negative")
        else:
            st.write("It is zero")

elif program == "Voting Eligibility":
    age = st.number_input("Enter your age", min_value=0, step=1)
    if st.button("Run"):
        st.write("You are eligible to vote" if age >= 18 else "You are not eligible to vote")

elif program == "Absolute Value":
    x = st.number_input("Enter a number")
    if st.button("Run"):
        st.write(f"Absolute value is {abs(x):g}")

elif program == "Greater of Two Numbers":
    x = st.number_input("Enter first number")
    y = st.number_input("Enter second number")
    if st.button("Run"):
        if x > y:
            st.write(f"{x:g} is greater than {y:g}")
        elif y > x:
            st.write(f"{y:g} is greater than {x:g}")
        else:
            st.write("Both numbers are equal")