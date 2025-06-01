// import data from 'books.JSON' assert { type: 'json' };
// console.log(data);

//FIXME: browse tab doesnt have new books
import { User } from './User.js';
let version ='1.0.1';

const loginButton = document.querySelector('.login');
const cardNumberInput = document.getElementById("cardNumberInput");
const nameInput = document.getElementById("nameInput");
var user;
let books = [];
var users = [];
const librarian = ["The Three-Body Problem", "Finding Orion", "The Six of Crows", "The Star Shepherd", "The Lifters", "Ivory and Bone", "The List", "Looking for Alaska", "Look Out for the Little Guy", "The Bicycle Spy", "An Ember in the Ashes", "Children of Time", "I am the Messenger", "Starling House", "The Wonderful Story of Henry Sugar and Six More"]; 
const div = document.querySelector('.wrapper');
const tabs = document.querySelector('.tabs');
const tabButtons = tabs.querySelectorAll('[role="tab"]');
//Tab panels
const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
const accountTabPanel = tabPanels.find(
    (panel) => panel.getAttribute('aria-labelledby') === 'account',
  );
const searchTabPanel = tabPanels.find(
    (panel) => panel.getAttribute('aria-labelledby') === 'search',
);
const returnTabPanel = tabPanels.find(
    (panel) => panel.getAttribute('aria-labelledby') === 'return',
);
const browseTabPanel = tabPanels.find(
    (panel) => panel.getAttribute('aria-labelledby') === 'browse',
);

let deviceType = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile': 'Desktop'; //should be const
//let deviceType = 'Mobile';

const searchBar = document.querySelector('.bookSearch');
searchBar.style.display = "none";
const searchButtonImage = document.querySelector('.searchImageButton');
const searchForm = document.querySelector('.searchForm');
const stackButton = document.querySelector('.stackImageButton');
//account panel
const nameP = document.querySelector('.name');
let deviceP = document.querySelector('.device');
const checkedoutP = document.querySelector('.checkedout');
const historyP = document.querySelector('.history');
const holdsP = document.querySelector('.holds');
const exitButton = document.querySelector('.exit');

//Add new book
const addBookButton = document.querySelector('.addBook');

//Add new user
const addUserButton = document.querySelector('.addUser');

const cardButtons = document.querySelectorAll('.card button');
const modalOuter = document.querySelector('.modal-outer');
const modalInner = document.querySelector('.modal-inner');

//Mobile
const sidePanel = document.querySelector('.sidePanel');

/*function checkImage(imageSrc) {
    let result;
    let img = new Image();
    img.src = imageSrc;
    img.onload = function() {
        result = imageSrc;
        // sconsole.log(`%c ${imageSrc} found`, "color:green;");
    }; 
    img.onerror = function() {
        result = './image not found.png';
        console.error(`${imageSrc} not found`);
    };
    return result;
}*/

/**
 * Sorts the books in the array based on authors last name
 */
function sortBooks() {
    let sorted = [];
    let first;
    for(let i = books.length-1; i >= 0; i--){
        first = books[i];
        for(let b = i-1; b > 0; b--){
            let author = books[b].author.split(' ');
            let author2 = first.author.split(' ');
            // console.log(`Author 1: ${author[author.length-1]}   Old author: ${author2[author2.length-1]}`);
            if(author[author.length-1] > author2[author2.length-1]){
                first = books[b];
                // console.log(`Evaluated to author 1 being smaller: ${author}`);
            }
        }
        //Splits the array around the selected element and reforms it with out the element
        let temp1 = books.slice(0, books.indexOf(first)+1);
        temp1.pop();
        let temp2 = books.slice(books.indexOf(first)+1);
        books = temp1.concat(temp2);
        sorted.push(first);
    }
    sorted.reverse();
    books = sorted;
}

function setMobile() {
    //tab and search do not work while in mobile mode - tab does not nessisarilly need to work
    alert('Mobile use is still under development. For the best view and function it is recommended to use on desktop');
    tabButtons.forEach(function(tabButton){
        tabButton.role ='tabMobile';
        sidePanel.appendChild(tabButton);  
    })
    stackButton.hidden = false;
}


// half done
function generateRecomended(){
    let recomended = [];
    // create array of objects that is the genres and times they have checked out
    let genres = [];
    let past = user.getPast();
    for(let i = 0; i < past.length; i++){// switch to for each
        //for each genre on that book increment that genre or create if its the first     refere to sarcastic genorator maybe 
        let booksGenres = findBook(past[i]).genres
        for(let g = 0; g < booksGenres.length; g++){
            // does it exist
            let genreObject;
            genres.forEach(function(genreF) {
                if(genreF.name === booksGenres[g]){
                    genreObject = genreF;
                    //break; // exit for each
                }
            });
            if(genres.find((g) => g.name === booksGenres[g])){

            }else {
                //create it
                genres.push({name: booksGenres[g], num: 1});
            }
        }
    }
    //.map?? or filter would be better

    //for top 1/3 of thier genres find other books that share that genre and they havent checked out
    //display those books
}


/**
 * Sets up the account tab with the user's information
 */
function setUserTab() {
    // Sets HTML paragraphs to display on the account page
    nameP.textContent = `Name: ${user.getName()}`;
    deviceP.textContent = `Device: ${deviceType}`;
    checkedoutP.textContent = `Currently Checkedout: ${arrayToString(user.getCurrent())}`;
    historyP.textContent = `History: ${arrayToString(user.getPast())}`;
    holdsP.textContent = `Holds: ${arrayToString(user.getHolds())}`;
}
/**
 * Sets up the browse tab with a card for each book that is not currently checked out
 */
function setBrowseTab(){
    console.log("browse tab set");// did not trigger at start 
    // Clears browse tab panel
    browseTabPanel.querySelector('.cards').innerHTML = '';
    // Sets browse tab panel
    for(let b = 0; b < books.length; b++ ){
        if(books[b].available === true){
            //check if image exists
            let code = `<div class="card">`;
            if(librarianCheck(books[b].title)){
                code += `<div class="cornnerBanner">Librarian Pick</div>`;
            }
            code += `
                <img class="bookCover" width="151" height="225" alt="Book cover for ${books[b].title}" src="./resources/Book images/${books[b].title.toLowerCase()}.jpg">
                <h2>${books[b].title}</h2>
                <button value="${books[b].title}">Learn more →</button>
            </div>`;
            browseTabPanel.querySelector('.cards').insertAdjacentHTML('beforeend', code);
        }
    }
}
/**
 * Sets up the return tab with buttons for books checked out to the current user
 * or a paragraph that says "You currently have no books checked out."
 */
function setReturnTab(){
    // Sets up the return tab panel
    returnTabPanel.innerHTML = '';
    returnTabPanel.insertAdjacentHTML('beforeend', '<p>What book would you like to return?</p>'); // increase font size for this
    if (user.getCurrent() !== null && user.getCurrent().length !== 0) {
        if(user.getCurrent().length !== 0){
            for (let i = 0; i < user.getCurrent().length; i++) {
                const bookTitle = user.getCurrent()[i];
                //Need to add padding or margins to these buttons
                returnTabPanel.insertAdjacentHTML('beforeend', `<button class="${user.getCurrent()[i].replace(/\s+/g, '_')}">${user.getCurrent()[i]}</button>`);
            }
            
            // Add event listeners for all book buttons
            const bookButtons = returnTabPanel.querySelectorAll('button');
            bookButtons.forEach(book => {
                book.addEventListener('click', function() {
                    returnBook(book.textContent);
                });
            });
        }
    } else {
        returnTabPanel.insertAdjacentHTML('beforeend', '<p>You currently have no books checked out.</p>');
    }
}
/**
 * Called when the current user is not an admin and then removes
 * the "users" and "add new book" tabs
 */
function notAdmin(){
    document.querySelector('#users').remove();
    document.querySelector('#addNewBook').remove();
}

/**
 * Checks if the passed in book is in the librarian recomeneded array
 * @param {String} title the title of the book being checked
 * @returns Bool of where it is a recommended book
 */
function librarianCheck(title){
    for(let i = 0; i < librarian.length; i++){
        if(title === librarian[i]){
            return true
        }
    }
    return false
}



// User variables

//var adaClass = new User('Ada', 7635185, JSON.parse(localStorage.getItem('adaCurrent')) || [], JSON.parse(localStorage.getItem('adaPast')) || [], JSON.parse(localStorage.getItem('adaHolds')) || []);
users.push(new User('Ada', 7635185, JSON.parse(localStorage.getItem('adaCurrent')) || [], JSON.parse(localStorage.getItem('adaPast')) || [], JSON.parse(localStorage.getItem('adaHolds')) || []));

var kamiClass = new User('Kami', 6386624, JSON.parse(localStorage.getItem('kamiCurrent')) || [], JSON.parse(localStorage.getItem('kamiPast')) || [], JSON.parse(localStorage.getItem('kamiHolds')) || []);
users.push(kamiClass);

var jackClass = new User('Jack', 6145835, JSON.parse(localStorage.getItem('jackCurrent')) || [], JSON.parse(localStorage.getItem('jackPast')) || [], JSON.parse(localStorage.getItem('jackHolds')) || []);
users.push(jackClass);

var karlaClass = new User('Karla', 7281600006567, JSON.parse(localStorage.getItem('karlaCurrent')) || [], JSON.parse(localStorage.getItem('karlaPast')) || [], JSON.parse(localStorage.getItem('karlaHolds')) || []);
users.push(karlaClass);

var oliverClass = new User('Oliver', 1973, JSON.parse(localStorage.getItem('oliverCurrent')) || [], JSON.parse(localStorage.getItem('oliverPast')) || [], JSON.parse(localStorage.getItem('oliverHolds')) || [], true);
users.push(oliverClass);

// add admin actions
//show users



/**
 * Converts an array to a string with each item seperated by ", "
 * @param {Array} array An array of Strings
 * @returns A string of the array
 */
function arrayToString(array){
    let genresString = "";
    if(array == null){
        return "";
    }
    for(let a = 0; a < array.length; a++){
        genresString += array[a] + ", ";
    }
    genresString = genresString.substring(0,genresString.length - 2);
    return genresString;
}

function arrayToArrayString(array){
    let genresString = "[";
    if(array == null){
        return "";
    }
    for(let a = 0; a < array.length; a++){
        genresString += `"` + array[a] + `", `;
    }
    genresString = genresString.substring(0,genresString.length - 2);
    genresString += "]"
    return genresString;
}

/**
 * Saves each user's information to the browsers local storage
 */
function saveUserData() {
    function stringifySafe(value) {
        // Check for null or undefined before stringifying
        return value !== null && value !== undefined ? JSON.stringify(value) : null;
    }

    // Save data for each user
    localStorage.setItem('adaCurrent', stringifySafe(adaClass.getCurrent()));
    localStorage.setItem('adaPast', stringifySafe(adaClass.getPast()));
    localStorage.setItem('adaHolds', stringifySafe(adaClass.getHolds()));

    localStorage.setItem('kamiCurrent', stringifySafe(kamiClass.getCurrent()));
    localStorage.setItem('kamiPast', stringifySafe(kamiClass.getPast()));
    localStorage.setItem('kamiHolds', stringifySafe(kamiClass.getHolds()));

    localStorage.setItem('jackCurrent', stringifySafe(jackClass.getCurrent()));
    localStorage.setItem('jackPast', stringifySafe(jackClass.getPast()));
    localStorage.setItem('jackHolds', stringifySafe(jackClass.getHolds()));

    localStorage.setItem('karlaCurrent', stringifySafe(karlaClass.getCurrent()));
    localStorage.setItem('karlaPast', stringifySafe(karlaClass.getPast()));
    localStorage.setItem('karlaHolds', stringifySafe(karlaClass.getHolds()));

    localStorage.setItem('oliverCurrent', stringifySafe(oliverClass.getCurrent()));
    localStorage.setItem('oliverPast', stringifySafe(oliverClass.getPast()));
    localStorage.setItem('oliverHolds', stringifySafe(oliverClass.getHolds()));

    localStorage.setItem('version', version);

    console.log('User data saved.');
}

// Action Functions
/**
 * Checks out book to the current user
 * @param {String} book The title of the book that is being checked out
 */
function checkout(book) {
    if(books[findBook(book)].available === true && user.getCurrent().length < 4){
        books[findBook(book)].available = false;
        user.getCurrent().push(book);
        console.log(`${book} has been checkedout to ${user.getName()}`);
        setUserTab();
        setBrowseTab();
        setReturnTab();
        closeModal();
        alert(books[findBook(book)].title + getDueDate());
    }
    else{
        if(books[findBook(book)].available === false){
            console.log('You cant checkout this book, it is already checkedout.');
            alert('You cant checkout this book, it is already checkedout.');
        }
        else if(user.getCurrent().length >= 4){
            console.log('You cant checkout anymore books');
            alert('You cant checkout any more books');
        }
        else{
            alert(`programing error: Avilability: ${books[findBook(book)].available}  Checkedout:${user.getCurrent().length}`);
        }
    }
}
/**
 * Returns the book
 * @param {String} bookTitle The title of the book
 */
function returnBook(bookTitle) {
    // Removes the book from being checked out
    var position = user.getCurrent().indexOf(bookTitle);
    user.getCurrent().splice(position, 1);

    // Adds book to checkout history
    user.getPast().push(bookTitle);

    // Updates users account panel
    setUserTab();

    console.log(`${bookTitle} has been returned`);
    books[findBook(bookTitle)].available = true;

    // Remove the clicked button from the DOM
    const buttonToRemove = returnTabPanel.querySelector(`button.${bookTitle.replace(/\s+/g, '_')}`);
    if (buttonToRemove) {
        buttonToRemove.remove();
    }
    setBrowseTab();

    if(user.getCurrent().length === 0){
        returnTabPanel.insertAdjacentHTML('beforeend', '<p>You currently have no books checked out.</p>');
    }
}
/**
 * Creates the code for a new book based on parameters
 */
function newBook(title, author, genres, publication){
    books.push({
        title: title,
        author: author,
        genre: genres,
        publication: publication,
        available: true,
    });
    console.log(`{
        "title": "${title}",
        "author": "${author}",
        "genre": ${arrayToArrayString(genres)},
        "publication": "${publication}",
        "available": "true"
    }`);
    document.getElementById('bookTitle').value = "";
    document.getElementById('bookAuthor').value = "";
    document.getElementById('bookGenre').value = "";
    document.getElementById('bookPublication').value = "";
}
/**
 * 
 * @param {*} name 
 * @param {*} num 
 */
function newUser(name, num=Math.random()*10000){
    var user = new userClass(name, num);
    users.push(user);

}
/**
 * Finds all books that fit with the search bar input and then creates a card form them
 * then displays the cards on the search tab
 */
function search(e){
    const searchString = searchBar.value;
    const searchDiv = searchTabPanel.querySelector('.cards');
    searchDiv.innerHTML = '';
    const results = searchTabPanel.querySelector('h2');
    e.preventDefault();

    // sets search page
    results.innerHTML = `<h2>Results for: ${searchString}</h2>`;
    for(let b = 0; b < books.length; b++ ){
        if(books[b].title.toLowerCase().includes(searchString.toLowerCase())){
            // Add book images
            let code = `<div class="card">`;
            if(librarianCheck(books[b].title)){
                code += `<div class="cornnerBanner">Librarian Pick</div>`;
            }
            code += `
                <img class="bookCover" width="151" height="225" alt="Book cover for ${books[b].title}" src="Book images/${books[b].title.toLowerCase()}.jpg">
                <h2>${books[b].title}</h2>
                <button value="${books[b].title}">Learn more →</button>
            </div>`;
            searchDiv.insertAdjacentHTML('beforeend', code);
        }
    }


    // Selects the search page
    // hide all tab panels
    tabPanels.forEach((panel) => {
        panel.hidden = true;
    });
    // mark all tabs as unselected
    tabButtons.forEach((tab) => {
        tab.setAttribute('aria-selected', false);
    });
    // mark the clicked tab as selected
    const searchTab = Array.from(tabs.querySelectorAll('[role="tab"]')).find(
        (tab) => tab.getAttribute('id') === 'search'
    );
    searchTab.setAttribute('aria-selected', true);
    // find the associated tabpanel and show it
    searchTabPanel.hidden = false;
}


/**
 * Finds a user based on their card number
 * @param {Number} num The user's card number
 */
function findUser(num, userInputName) {
    for(let u = 0; u < users.length; u++){
        //to lowercase has ruined it
        if(num == users[u].getCardNum() && userInputName.toLowerCase() == users[u].getName().toLowerCase()){
            user = users[u];
        }
    }
}

/**
 * Finds a book based on its title
 * @param {String} bookTitle Title of the book being looked for
 * @returns returns the position of the book in the array of books
 */
function findBook(bookTitle){
    for( let i = 0; i < books.length; i++){
        if(books[i].title == bookTitle){
            // console.log(`${books[i].title} has been found`);
            return i;
        }
    }
    console.log(`${bookTitle} not found`);
    return -1;
}
/**
 * Maths out the due date of the book
 * @param {Boolean} renew Is the book being renewed
 * @returns A string with the date the book is due
 */
function getDueDate(renew){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    month++;

    if(renew){
        day += 14;
    }
    else{
        day += 28;
    }
    if(month == 2)
    {
        //Current month if february and return date is next month
        day -= 28;
        month ++;
        //console.log("Its febuary");
    }
    else if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10) && day > 31)
    {
        //console.log("the current month has 31 days");
        month ++;
        day -= 31;
    }
    else if((month == 4 || month == 6 || month == 9 || month == 11) && day > 30)
    {
        //checks months with 30 days
        month ++;
        day -= 30;
        //console.log("this month has 30 days");
    }
    else if(month == 12 && day >= 31)
    {
        //console.log("its december and book is due in the new year");
        month = 1;
        day -= 31;
        year ++;
    }

    return " is due: " + month + "/" + day + "/" + year;
}
function sortArray(arrayToSort){
    arrayToSort.sort();
}

/**
 * Sets up and activates the modal
 * @param {String} title The title of the book on the same card as the button that was clicked
 */
function handleCardButtonClick(title) {
    let availability = "Out";
    if(books[findBook(title)].available){
        availability = 'Available';
    }
    // populate the modal with the new info
    modalInner.innerHTML = `
        <h1>${title}</h1>
        <h2>By: ${books[findBook(title)].author}</h2>
        <h2>Published in ${books[findBook(title)].publication}</h2>
        <h2>Genres: ${arrayToString(books[findBook(title)].genre)}</h2>
        <h2>${availability}</h2>
        <button class="checkoutButton">Checkout</button>
    `;
    const checkoutButton = document.querySelector(`.checkoutButton`);
    checkoutButton.addEventListener('click', function(){
        checkout(title);
    });
    // show the modal
    modalOuter.classList.add('open');
}
/**
 * Changes the tab and tab panel when tabs a clicked
 * @param {Event} event The click of a button 
 */
function handleTabClick(event) {
    // hide all tab panels
    tabPanels.forEach((panel) => {
      panel.hidden = true;
    });
    // mark all tabs as unselected
    tabButtons.forEach((tab) => {
      tab.setAttribute('aria-selected', false);
    });
    // mark the clicked tab as selected
    event.currentTarget.setAttribute('aria-selected', true);
    // find the associated tabpanel and show it
    const { id } = event.currentTarget;
  
    // Method 2 - find in the array of tabPanels
    const tabPanel = tabPanels.find(
      (panel) => panel.getAttribute('aria-labelledby') === id,
    );
    tabPanel.hidden = false;

    //for mobile
    sidePanel.hidden = true;
    //sidePanel.classList.remove('open');
}

/**
 * Closes the modal
 */
function closeModal() {
    modalOuter.classList.remove('open');
}


/**
 * The main function, called on start of program, gets current user
 * sets up the tab panels, adds books to the array, and a bunch of other stuff
 */
function setUp(){
    setUpBooks(); // It is unable to read in the books before looking through them
    
    console.log(`Welcome ${user.getName()}`);
    console.log(deviceType);
    nameInput.style.display = "none";
    cardNumberInput.style.display = "none"; 
    loginButton.hidden = true;
    div.hidden = false;

    searchBar.style.display = "inline";
    searchButtonImage.hidden = false;
    
    // Sets what books are checkedout
    for( let u = 0; u < users.length; u++){
        if(users[u].current !== null){
            for(let c = 0 ; c < users[u].current.length; c++){
                books[findBook(users[u].current[c])].available = false;
            }
        }
    }

    // Sets up the tabs
    if(!user.isAdmin()){
        notAdmin();
    }
    setUserTab();
    setReturnTab();
    setBrowseTab();

    if(deviceType === 'Mobile'){
        setMobile();
    }

    if(localStorage.getItem('version') !== version){
        console.log('changes have been made since last opened');
        modalInner.innerHTML = `
            <h1>Version: ${version} changes</h1>
            <ul>
                <li>Added a few new books</li>
                <li>Switched Checkout to Browse</li>
                <li>Minor changes to the layout of the top banner</li>
                <li>Added this update information and got it some what usable on mobile</li>
                <li>Changed the way the "Learn more" buttons handle clicks, so they all ways work</li>
                <li>Set up a check to see what type of device user is using</li>
                <li>Started on the beta version of mobile layout</li>
                <li>Started working on custom recommendations based on books previously read</li>
            </ul>
            <h3>More changes can be found <a href="https://github.com/Oliver-Qberry/olivers-library.github.io">here</a> under the version_changes.txt file</h3>
        `;
        
        modalInner.style.minWidth = "200px";
        modalInner.style.maxWidth = "350px";
        modalInner.style.maxHeight = "400px";
        modalInner.style.marginBottom = "100px";

        // show the modal
        modalOuter.classList.add('open');
        //console.log(`width: ${modalInner.getBoundingClientRect().width} height:${modalInner.getBoundingClientRect().height}`);
    }
}



// Adding Event Listeners
// Login the user if vaild number
loginButton.addEventListener('click', (e) => {
    //Make this a log in function
    if(user === undefined){
        findUser(cardNumberInput.value, nameInput.value);
        if(user !== undefined){
            setUp();
        }
        else{
            console.log('An invaild card number was entered, access was denied.');
            console.log(`Number: ${cardNumberInput.value}`);
            alert('Invalid number');
        }
    }
});
// Keys that open and close things - logingin and closing modal
window.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        if(user === undefined){
            findUser(cardNumberInput.value, nameInput.value);
            if(user !== undefined){
                setUp();
            }
            else{
                console.log('An invaild card number was entered, access was denied.');
                console.log(`Number: ${cardNumberInput.value}`);
                alert('Invalid number');
            }
        }
        /*else{
            search();
        }*/
        return;
    }
    else if (e.key === 'Escape' && user !== undefined) {
        closeModal();
        return;
    }
    else if(e.key === "Tab" && user !== undefined){
        e.preventDefault();
        let selectedTab; //Selected tab's id
        tabButtons.forEach((tab) => {
            if(tab.getAttribute('aria-selected') == "true"){ //Get the id
                selectedTab = tab.getAttribute("id");
            }
        });

        //changes based on admin tabs
        if(!user.admin){//is this right?
            //create an array of the ids in order
            const tabIds = ["account", "return", "browse", "search"]; //others?
            //find id for next one
            let idnum = 0;
            for(let t = 0; t<tabIds.length; t++){
                if(selectedTab === tabIds[t]){//never returning true
                    idnum = t;
                    break;
                }
            }
            idnum ++;
            if(idnum > 3){
                idnum = 0;
            }
            //deselect all
            tabPanels.forEach((panel) => {
                panel.hidden = true;
            });
            tabButtons.forEach((tab) => {
                tab.setAttribute('aria-selected', false);
            });
            // mark the clicked tab as selected
            const selectedtab = Array.from(tabs.querySelectorAll('[role="tab"]')).find(
                (tab) => tab.getAttribute('id') === tabIds[idnum]
            );
            selectedtab.setAttribute('aria-selected', true);
            // find the associated tabpanel and show it
            tabPanels.forEach((panel) => {
                if(panel.getAttribute('aria-labelledby') == tabIds[idnum]){
                    panel.hidden = false;
                    //console.log("panel found");
                }
            });
        }
        else{
            //create an array of the ids in order
            const tabIds = ["account", "return", "browse", "users", "addNewBook", "search"]; //others?
            //find id for next one
            let idnum = 0;
            for(let t = 0; t<tabIds.length; t++){
                if(selectedTab === tabIds[t]){//never returning true
                    idnum = t;
                    break;
                }
            }
            idnum ++;
            if(idnum > 5){
                idnum = 0;
            }
            //deselect all
            tabPanels.forEach((panel) => {
                panel.hidden = true;
            });
            tabButtons.forEach((tab) => {
                tab.setAttribute('aria-selected', false);
            });
            // mark the clicked tab as selected
            const selectedtab = Array.from(tabs.querySelectorAll('[role="tab"]')).find(
                (tab) => tab.getAttribute('id') === tabIds[idnum]
            );
            selectedtab.setAttribute('aria-selected', true);
            // find the associated tabpanel and show it
            tabPanels.forEach((panel) => {
                if(panel.getAttribute('aria-labelledby') == tabIds[idnum]){
                    panel.hidden = false;
                    //console.log("panel found");
                }
            });
        }
        return;
    }
    /*else if(e.code === "Space"){
        e.preventDefault();
        deviceType = 'Mobile'; //Temp
        if(deviceType === 'Mobile'){
            //sidePanel.hidden = !sidePanel.hidden;
            setMobile();
        }
        return;
    }*/
});
// When image clicked search
searchButtonImage.addEventListener('click', search);
// When exiting save user information
exitButton.addEventListener('click', saveUserData);
// Exit modal by clicking oustside of it
modalOuter.addEventListener('click', (event) => {
    const isOutside = !event.target.closest('.modal-inner');
    if (isOutside) {
      closeModal();
    }
}); 

// Switch between tabs
tabButtons.forEach((button) =>
  button.addEventListener('click', handleTabClick),
);

// work for custom cursor, not currently in use
document.addEventListener("DOMContentLoaded", function() {
    const customCursor = document.querySelector(".custom-cursor");
  
    document.addEventListener("mousemove", function(e) {
      customCursor.style.left = e.clientX + "px";
      customCursor.style.top = e.clientY + "px";
    });
});
// New book button on new book tab
addBookButton.addEventListener('click', function(){
    newBook(document.getElementById('bookTitle').value, document.getElementById('bookAuthor').value, document.getElementById('bookGenre').value.split(", "), document.getElementById('bookPublication').value);
});
// New user button on new user tab
addUserButton.addEventListener('click', function(){
    newUser(document.getElementById('newUserName').value, document.getElementById('newUserNumber').value);
});


window.addEventListener('beforeunload', function (e) {
    saveUserData();
    //Possible can remove next line to just save and then close
    //e.preventDefault();
    e.returnValue = '';
    return;
});

searchTabPanel.addEventListener('click', function(event) {
    if(event.target.matches('button')){
        handleCardButtonClick(event.target.value);
    }
});
browseTabPanel.addEventListener('click', function(event) {
    if(event.target.matches('button')){
        handleCardButtonClick(event.target.value);
    }
});

searchForm.addEventListener('submit', search);

stackButton.addEventListener('click', function(e) {
    sidePanel.hidden = !sidePanel.hidden;
    console.log("button pressed");
    //sidePanel.classList.add('open'); // trying to animate it
});

function formatArrayOutput(array){
    let arrayOutput = "";
    for(let a = 0; a < array.length; a++){
        arrayOutput += `"${array[a]}",`;
    }
    return arrayOutput.slice(0, arrayOutput.length-1);
}

function formatBooks(){
    let output = "";
    for(let b = 0; b < books.length; b++){
        output += `{"title": "${books[b].title}", "author": "${books[b].author}", "genres": [${formatArrayOutput(books[b].genre)}], "publication": ${books[b].publication}, "available": true },`;
    }
    console.log(output.slice(0, output.length-1));
    navigator.clipboard.writeText(output.slice(0, output.length-1));

}

/**
 * Creates all the book objects
 */
/*function setUpBooks() {
    fetch('./books.json').then(response => {
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data =>{
       books = [...data];
    }).catch(error => {
        console.error(`error fetching or parsing Json: `, error)
    });
    sortBooks();  
}*/

let readFilePromise = new Promise(async function(myResolve, myReject) {
    const response = await fetch('./books.json');
    if (!response.ok) {
        //throw new Error(`HTTP error! status: ${response.status}`);
        //error
    }
    else{
        books = [...await (response.json())];  // Waits until books.json is fully loaded
    }
});

readFilePromise.then(
    function(value){sortBooks();},
    function(error){console.log(error);}
);

async function setUpBooks() {
    try {
        const response = await fetch('./books.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        books = [...await (response.json())];  // Waits until books.json is fully loaded
        sortBooks();  // Now it runs after books is populated
    } catch (error) {
        console.error("Error fetching or parsing JSON:", error);
    }
}

