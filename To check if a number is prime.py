x=int(input("Enter your number"))
y=0
if x<=1:
    print("Invalid")
else:

    for i in range (2,(x//2)+1):
     if x%i==0:
        y+=1 
        break
    if y>0:
     print("The number is a not a prime")
    else:
     print("The number is a prime number")
