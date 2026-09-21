x=int(input("Enter a number"))
if x>0:
    print("Absolute value is",x)
elif x<0:
    y=(-1*x)
    print("Absolute value is",y)
elif x==0:
    print("Absolute value is 0")
else:
    print("Error 404")