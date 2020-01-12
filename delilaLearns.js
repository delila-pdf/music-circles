let x = 1;
x += 1; // gleich wie x = x + 1

let y = 2;
y *= 2; // 4

// literals ``
let name = "Del
ila ";
"STRING"

`LITERAL
<html>bla bla </html>
jsdjfsdjfoisdj SOME JS: ${greet("Deli")} ${jscode} ifjosdijfios
sjdfjosidjfoisjdofi
fdjgijdfg
`

function greet(name) {
    console.log(`Heyho, ${name}`);
}

const greetMe = (name1, name2) => {
    console.log("hi", name, "and", name2);
}

// increments
let number = 2;
let numberTwo = number++;
// numberTwo = 2 aber number = 3

let numberThree = ++numberTwo; // numberThree = 3 = numberTwo


// Callback function

// [1,2,3] ist eine Liste (Array)
// {attribut : "irgendwas" , nochEins : "was andrers"} ist ein Objekt 

let delila = { name: "Delila", gender: "f" };
let delilalsName = delila.name;

let ppl = [delila, { name: "Tim", gender: "m" }];

// Problem: print all names (all ppl)

// 1. for loop

for (let i = 0; i < ppl.length; i++) {
    console.log(ppl[i].name);
}

// forEach with normal function

ppl.forEach(function(person) {
    console.log(person.gender);
});

// arrow function

ppl.forEach(person => { console.log(person.name) });









array.forEach();