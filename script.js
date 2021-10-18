// User input-buttons
const btnSubmit = document.getElementById('submit-btn');
const greetBtn = document.getElementById('greet');
const birthdayBtn = document.getElementById('birthday');
const clrAllBtn = document.getElementById('clear-all');

// Elements that communicate with user
const output = document.getElementById('output');
const heroError = document.querySelector('.hero-error');
const fieldsError = document.querySelector('.fields-error');
const labelArr = Array.from(document.querySelectorAll('label'));
const necessaryInputLabel = [];
for (let [i, el] of labelArr.entries()) {
    if(i<3) necessaryInputLabel.push(el);
}
const inputsArr = Array.from(document.querySelectorAll('input'));

let personsDiv = document.createElement('div');
personsDiv.id = 'persons';
output.appendChild(personsDiv);

let greetingsDiv = document.createElement('div');
greetingsDiv.id = 'greetings';
output.appendChild(greetingsDiv);

// Data structur
let printAll = '';
let allGreetings = '';
let personsArray = [];


// class to create objects from
class Person  {
    constructor(id, fname, lname, age) {
        this.id = id,
        this.fname = fname,
        this.lname = lname,
        this.age = age,
        this.legal = this.age >= 18 ? true : false;
    }
    // function that returns presentation of obj
    toString() {
        return `${this.fname} ${this.lname} är ${this.age} år gammal och ${this.legal ? '' : 'inte '}myndig.`;
    }
    // function that updates objs age
    birthday() {
        this.age++;
        this.legalAge(this.age);
    }
    // function that determines if obj is of age
    legalAge(age) {
        this.legal = this.age >= 18 ? true : false;
    }
    // function that returns obj greetin to other obj
    greetings(otherPerson) {
        return `Hej ${otherPerson.fname}, jag heter ${this.fname}!`;
    }
}

// extension of obj person
class SuperHero extends Person {
    constructor(id, fname, lname, age, superheroName) {
        super(id, fname, lname, age); {
            this.superheroName = superheroName
        }
    }
    // function that returns the objs ability to fly
    fly() {
        return `${this.fname}s superhjältenamn är ${this.superheroName} och kan flyga`;
    }
}

//------------------TESTDATA------------------------------------

/* personsArray.push(new Person(0, 'Gladys', 'Gunnarsson', 34));
personsArray.push(new Person(1, 'Simon', 'Svensson', 17));
personsArray.push(new SuperHero(2,'Grodan', 'Boll', 87, 'Grodis'));
personsArray.push(new Person(3,'Mickel', 'Räv', 40));

personsArray.forEach(el => printPerson(el)); */


// initialization-function that clears all data
function init() {
    personsArray = [];
    printAll = '';
    greetingsDiv.innerHTML = '';
    personsDiv.innerHTML = '';
}

// function that notifies user what went wrong when error occurs in adding obj
function errorMess(el, error) {
    if(error) {
        if (el === heroError) {
            el.innerText = 'Fyll i superhjältenamn';
        } else {
            el.innerText = 'Fyll i fälten';
        } 
    }  else {
    el.innerText = '';
    }
}

// function that clears all input-fields
function clrFields() {
    inputsArr.forEach((e) => {
        e.type === 'checkbox' && e.checked === true ? e.checked = false : e.value = '';
    });
}

// function that removes error-message 
function clrErrorLabel() {
    necessaryInputLabel.forEach(el => {
        if(el.classList.contains('label-error')) el.classList.remove('label-error');
    }) 
}

//function that adds new obj to DOM
function printPerson(person) {

    printAll += `<p id="${person.id}">${person.toString()}  <i class="fas fa-times-circle"></i> ${person instanceof SuperHero ? person.fly() : ''}</p>`;

    printEveryone();
}

// function that prints all objs
function printEveryone() { 
    const persdiv = document.getElementById('persons');
    persdiv.innerHTML = printAll;
   
}

// eventlistner that makes all obj greet eachother and prints it
greetBtn.addEventListener('click', function() {
    allGreetings = '';
    for (let i = 0; i < personsArray.length; i++ ) {
        for(let j = 0; j < personsArray.length; j++) {
            if(i === j) {
                continue;
            }
            allGreetings += `<p>${personsArray[i].greetings(personsArray[j])}</p>`;
        }
    }
    
    greetingsDiv.innerHTML = allGreetings;

});



// if birthday button is pressed, objs get one year older and re-printed
birthdayBtn.addEventListener('click', () =>{
    printAll = '';
    for (let person of personsArray) {
        person.birthday();
        printPerson(person);
    }
    printEveryone();
});

// button that resets page
clrAllBtn.addEventListener('click', () => {
    init();
});

// if submit-button is pressed do this
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    // elements for all user-inputs
    let person;
    let fname = inputsArr[0].value;
    let lname = inputsArr[1].value;
    let age = inputsArr[2].value;
    let isSuperhero = inputsArr[3].checked;
    let superheroName = inputsArr[4].value;
    
    // check if neccesary input is added
    if(fname && lname && age) {
        clrErrorLabel();
        errorMess(fieldsError, false);

        // create id for new obj
        let id;
        if(personsArray.length === 0) {
            id = 0;
        } else {
            id = personsArray[personsArray.length - 1].id + 1;
        }
        
        if(isSuperhero) {
            if (superheroName) {
                errorMess(heroError, false)
                person = new SuperHero(id, fname, lname, Number(age), superheroName);
                console.log(person);
            } else {
                errorMess(heroError, true);
                console.log('heroname error');
                return;
            }   
        } else {
            person = new Person(id ,fname, lname, Number(age));
        }

        personsArray.push(person);
        console.log(personsArray);
         
    } else {
        // if not all info is provided, show error message
        errorMess(fieldsError, true);
        
        necessaryInputLabel.forEach(el => {
            if(!el.classList.contains('label-error'))el.classList.add('label-error');
        });
        
        if (personsArray.length > 0) printEveryone();
        return;
    }

    // if new object was created, do this
    printPerson(person);
    clrFields();
    errorMess(heroError, false);
    errorMess(fieldsError, false);
    
});

// if an objs remove-button is clicked in DOM, this deletes that obj
output.addEventListener('click', (e) => {

    const personID = Number(e.target.parentNode.id);
    const person = document.getElementById(personID);

    if(e.target.id === ''){
        if(personID || personID === 0) {
            person.parentNode.removeChild(person);
            let ids = personsArray.map(e => e.id);
            let index = ids.indexOf(personID);
            
            personsArray.splice(index, 1)
        }
    }
});
