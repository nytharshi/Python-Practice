x=int(input("Enter the Total cost of shares"))
y=int(input("Enter the number of shares"))
p=x/y
print("1.Dollar\n2.Rupees")
z=int(input("Enter your choice in Serial number"))
if z==1:
    print("The average share price is $",p,("per share"))
elif z==2:
    print("The average share price is ₹",p,("per share"))
else:
    print("Put validable Currency")