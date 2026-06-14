codelevel = 0
alfabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m",
           "n","o","p","q","r","s","t","u","v","w","x","y","z"]
tekst = input("enter your text:")
result = ""
for i in tekst:
    codelevel += 1
    if i not in alfabet:
        result += i
        continue
    result += alfabet[(alfabet.index(i) + codelevel) % len(alfabet)]
print(result)