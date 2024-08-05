// import data from 'books.JSON' assert { type: 'json' };
// console.log(data);

let version ='1.0.1';

const loginButton = document.querySelector('.login');
const cardNumberInput = document.getElementById("cardNumberInput");
var user;
let books = [];
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
                <img class="bookCover" width="151" height="225" alt="Book cover for ${books[b].title}" src="Book images/${books[b].title.toLowerCase()}.jpg">
                <h2>${books[b].title}</h2>
                <button value="${books[b].title}">Learn more →</button>
            </div>`;
            browseTabPanel.querySelector('.cards').insertAdjacentHTML('beforeend', code);
        }
    }
    //const bookCovers = document.querySelectorAll('.bookCover');
    /*bookCovers.forEach(function() {
        // check if it has a src and it is loaded
        // if not set it to the image not found
    });*/
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


class userClass {
    /**
     * Creates a user based on provided arguments or the defaults.
     * @param  {String} name Name of the user
     * @param  {Number} num The users card number
     * @param  {Array} current An array of the books the user currently has checked out
     * @param  {Array} past An array of the books the user has previously checked out
     * @param  {Array} holds An array of the books the user currently has a hold on
     * @param  {Boolean} admin Is the user an admin or not
    */
    constructor(name, num = Math.random() * 100000, current = [], past = [], holds = [], admin = false) {
        // Use if statements to create constructors with different number
        // of params, have some defaults
        this.name = name;
        this.num = num;
        this.current = current;
        this.past = past;
        this.holds = holds;
        this.admin = admin;
    }
    /**
     * Sets the users current, past and holds to nothing but not null
     * @returns Weather or not it was successful
     */
    reset(){
        this.current = [];
        this.past = [];
        this.holds = [];
        if(this.current == [] && this.past == [] && this.holds == []){
            setUserTab();
            return true;
        }
        setUserTab();
        return false;
    }
    /**
     * Puts the user's information into a string
     * @returns String representation of the user
     */
    toString() {
        return `Name: ${this.name}
            Currently Checkedout: ${this.current}
            History: ${this.past}
            Holds: ${this.holds}
            Admin: ${this.admin}
        `;
    }
    /**
     * Generates the HTML for the user's account page
     * @returns HTML for account page
     */
    toHTML() {
        return `
        <p>Name: ${this.name} </p>
        <p>Currently Checkedout: ${this.current}</p>
        <p>History: ${this.past}</p>
        <p>Holds: ${this.holds}</p>
        `;
    }

    //Getter methods
    /**
     * Getter method for user name
     * @returns The user's name
     */
    getName() {
        return this.name;
    }
    /**
     * Getter method for card number
     * @returns The user's card number
     */
    getCardNum() {
        return this.num;
    }
    /**
     * Getter method for books currently checked out to them
     * @returns The books they currently have checked out
     */
    getCurrent() {
        return this.current;
    }
    /**
     * Getter method for books previously checked out
     * @returns The books the they previously checked out
     */
    getPast() {
        return this.past;
    }
    /**
     * Getter method for holds
     * @returns The books they have holds on
     */
    getHolds() {
        return this.holds;
    }
    /**
     * Getter method for admin variable
     * @returns If they are an admin or not.
     */
    isAdmin() {
        return this.admin;
    }

    //ones to edit it?
}


// User variables
var users = [];

var adaClass = new userClass('Ada', 7635185, JSON.parse(localStorage.getItem('adaCurrent')), JSON.parse(localStorage.getItem('adaPast')), JSON.parse(localStorage.getItem('adaHolds')));
users.push(adaClass);

var kamiClass = new userClass('Kami', 6386624, JSON.parse(localStorage.getItem('kamiCurrent')), JSON.parse(localStorage.getItem('kamiPast')), JSON.parse(localStorage.getItem('kamiHolds')));
users.push(kamiClass);

var jackClass = new userClass('Jack', 6145835, JSON.parse(localStorage.getItem('jackCurrent')), JSON.parse(localStorage.getItem('jackPast')), JSON.parse(localStorage.getItem('jackHolds')));
users.push(jackClass);

var karlaClass = new userClass('Karla', 7281600006567, JSON.parse(localStorage.getItem('karlaCurrent')), JSON.parse(localStorage.getItem('karlaPast')), JSON.parse(localStorage.getItem('karlaHolds')));
users.push(karlaClass);

var oliverClass = new userClass('Oliver', 1973, JSON.parse(localStorage.getItem('oliverCurrent')), JSON.parse(localStorage.getItem('oliverPast')), JSON.parse(localStorage.getItem('oliverHolds')), true);
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
        genresString += "'" + array[a] + "', ";
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

    //localStorage.setItem('version', version);

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
    console.log(`books.push({
        title: '${title}',
        author: '${author}',
        genre: ${arrayToArrayString(genres)},
        publication: ${publication},
        available: true,
    });`);
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
function findUser(num) {
    for(let u = 0; u < users.length; u++){
        if(num == users[u].getCardNum()){
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
    setUpBooks();
    //sortArray(books);
    /*books.sort(function(a,b){
        const aTitle = a.title;
        const bTitle = b.title
        return (aTitle).compare(bTitle); //not working
    });*/
    console.log(`Welcome ${user.getName()}`);
    console.log(deviceType);

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
    
    // !IMPORTANT! These next lines are only for school computer with no saved user data
    adaClass.reset();
    karlaClass.reset();
    jackClass.reset();
    kamiClass.reset();
    oliverClass.reset();
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
        findUser(cardNumberInput.value);
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
            findUser(cardNumberInput.value);
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
    }
    else if (e.key === 'Escape') {
        closeModal();
    }
    else if(e.key === "Tab"){
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
    }
    else if(e.code === "Space"){
        e.preventDefault();
        deviceType = 'Mobile'; //Temp
        if(deviceType === 'Mobile'){
            //sidePanel.hidden = !sidePanel.hidden;
            setMobile();
        }
    }
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
});

/**
 * Creates all the book objects
 */
function setUpBooks() {
    books.push({
        title: 'The One and Only Ivan',
        author: 'Katherine Applegate',
        genre: ['Fiction', 'Fantasy'],
        publication: 2012,
        available: true,
    });
    books.push({
        title: 'Finding Orion',
        author: 'John David Anderson',
        genre: ['Mystery', 'Adventure'],
        publication: 2019,
        available: true,
    });
    books.push({
        title: 'Tuck Everlasting',
        author: 'Natalie Babbitt',
        genre: ['Fantasy', 'Romance'],
        publication: 1975,
        available: true,
    });
    books.push({
        title: 'Shadow and Bone',
        author: 'Leigh Bardugo',
        genre: ['Fantasy', 'Adventure'],
        publication: 2012,
        available: true,
    });
    books.push({
        title: 'Siege and Storm',
        author: 'Leigh Bardugo',
        genre: ['Fantasy', 'Adventure'],
        publication: 2013,
        available: true,
    });
    books.push({
        title: 'Ruin and Rising',
        author: 'Leigh Bardugo',
        genre: ['Fantasy', 'Adventure'],
        publication: 2014,
        available: true,
    });
    books.push({
        title: 'The Six of Crows',
        author: 'Leigh Bardugo',
        genre: ['Fantasy', 'Adventure'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'The Crooked Kingdom',
        author: 'Leigh Bardugo',
        genre: ['Fantasy', 'Adventure'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'King of Scars',
        author: 'Leigh Bardugo',
        genre: ['Fantasy', 'Adventure'],
        publication: 2019,
        available: true,
    });
    books.push({
        title: 'Rule of Wolves',
        author: 'Leigh Bardugo',
        genre: ['Fantasy', 'Adventure'],
        publication: 2021,
        available: true,
    });
    books.push({
        title: 'Serafina and the Black Cloak',
        author: 'Robert Beatty',
        genre: ['Mystery', 'Fantasy'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'Serafina and the Twisted Staff',
        author: 'Robert Beatty',
        genre: ['Mystery', 'Fantasy'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'The Iron Trial',
        author: 'Holly Black',
        genre: ['Fantasy', 'Adventure'],
        publication: 2014,
        available: true,
    });
    books.push({
        title: 'The Copper Gauntlet',
        author: 'Holly Black',
        genre: ['Fantasy', 'Adventure'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'The Bronze Key',
        author: 'Holly Black',
        genre: ['Fantasy', 'Adventure'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'The Silver Mask',
        author: 'Holly Black',
        genre: ['Fantasy', 'Adventure'],
        publication: 2017,
        available: true,
    });
    books.push({
        title: 'The Golden Tower',
        author: 'Holly Black',
        genre: ['Fantasy', 'Adventure'],
        publication: 2018,
        available: true,
    });
    books.push({
        title: 'Henry Huggins',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fiction'],
        publication: 1950,
        available: true,
    });
    books.push({
        title: 'Ramona the Pest',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fiction'],
        publication: 1968,
        available: true,
    });
    books.push({
        title: 'Ramona and Her Father',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fiction'],
        publication: 1977,
        available: true,
    });
    books.push({
        title: 'Ramona and Her Mother',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fiction'],
        publication: 1979,
        available: true,
    });
    books.push({
        title: 'Ramona Forever',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fiction'],
        publication: 1984,
        available: true,
    });
    books.push({
        title: 'Ramona Quimby Age 8',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fiction'],
        publication: 1981,
        available: true,
    });
    books.push({
        title: 'The Mouse and the Motorcycle',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1965,
        available: true,
    });
    books.push({
        title: 'Runaway Ralph',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1970,
        available: true,
    });
    books.push({
        title: 'Ralph S. Mouse',
        author: 'Beverly Cleary',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1982,
        available: true,
    });
    books.push({
        title: 'The Ballad of Songbirds and Snakes',
        author: 'Suzanne Collins',
        genre: ['Science Fiction', 'Fantasy'],
        publication: 2020,
        available: true,
    });
    books.push({
        title: 'The Hunger Games',
        author: 'Suzanne Collins',
        genre: ['Science Fiction', 'Adventure'],
        publication: 2008,
        available: true,
    });
    books.push({
        title: 'Catching Fire',
        author: 'Suzanne Collins',
        genre: ['Science Fiction', 'Adventure'],
        publication: 2009,
        available: true,
    });
    books.push({
        title: 'Mockingjay',
        author: 'Suzanne Collins',
        genre: ['Science Fiction', 'Adventure'],
        publication: 2010,
        available: true,
    });
    books.push({
        title: 'Gregor the Overlander',
        author: 'Suzanne Collins',
        genre: ['Fantasy', 'Adventure'],
        publication: 2003,
        available: true,
    });
    books.push({
        title: 'Gregor and the Prophecy of Bane',
        author: 'Suzanne Collins',
        genre: ['Fantasy', 'Adventure'],
        publication: 2004,
        available: true,
    });
    books.push({
        title: 'Gregor and the Curse of the Warmbloods',
        author: 'Suzanne Collins',
        genre: ['Fantasy', 'Adventure'],
        publication: 2005,
        available: true,
    });
    books.push({
        title: 'Gregor and the Marks of Secret',
        author: 'Suzanne Collins',
        genre: ['Fantasy', 'Adventure'],
        publication: 2006,
        available: true,
    });
    books.push({
        title: 'Gregor and the Code of Claw',
        author: 'Suzanne Collins',
        genre: ['Fantasy', 'Adventure'],
        publication: 2007,
        available: true,
    });
    books.push({
        title: 'The Wizards of Once',
        author: 'Cressida Cowell',
        genre: ['Fantasy', 'Adventure'],
        publication: 2017,
        available: true,
    });
    books.push({
        title: 'Twice Magic',
        author: 'Cressida Cowell',
        genre: ['Fantasy', 'Adventure'],
        publication: 2018,
        available: true,
    });
    books.push({
        title: 'Jurassic Park',
        author: 'Michael Crichton',
        genre: ['Science Fiction', 'Thriller'],
        publication: 1990,
        available: true,
    });
    books.push({
        title: 'A Winter\'s Promise',
        author: 'Christelle Dabos',
        genre: ['Fantasy', 'Adventure'],
        publication: 2013,
        available: true,
    });
    books.push({
        title: 'Matilda',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1988,
        available: true,
    });
    books.push({
        title: 'The BFG',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1982,
        available: true,
    });
    books.push({
        title: 'Charlie and the Chocolate Factory',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1964,
        available: true,
    });
    books.push({
        title: 'Fantastic Mr. Fox',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fiction'],
        publication: 1970,
        available: true,
    });
    books.push({
        title: 'George\'s Marvelous Medicine',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1981,
        available: true,
    });
    books.push({
        title: 'James and the Giant Peach',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1961,
        available: true,
    });
    books.push({
        title: 'The Magic Finger',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1966,
        available: true,
    });
    books.push({
        title: 'The Twits',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fiction'],
        publication: 1980,
        available: true,
    });
    books.push({
        title: 'The Witches',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1983,
        available: true,
    });
    books.push({
        title: 'Flora & Ulysses',
        author: 'Kate DiCamillo',
        genre: ['Children\'s', 'Adventure'],
        publication: 2013,
        available: true,
    });
    books.push({
        title: 'The Lifters',
        author: 'Dave Eggers',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2018,
        available: true,
    });
    books.push({
        title: 'Ivory and Bone',
        author: 'Julie Eshbaugh',
        genre: ['Young Adult', 'Historical'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'Obsidian and Stars',
        author: 'Julie Eshbaugh',
        genre: ['Young Adult', 'Historical'],
        publication: 2017,
        available: true,
    });
    books.push({
        title: 'The List',
        author: 'Patricia Forde',
        genre: ['Young Adult', 'Science Fiction'],
        publication: 2017,
        available: true,
    });
    books.push({
        title: 'The Honest Truth',
        author: 'Dan Gemeinhart',
        genre: ['Children\'s', 'Adventure'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'Escape from Mr. Lemoncello\'s Library',
        author: 'Chris Grabenstein',
        genre: ['Children\'s', 'Mystery'],
        publication: 2013,
        available: true,
    });
    books.push({
        title: 'Looking for Alaska',
        author: 'John Green',
        genre: ['Young Adult', 'Fiction'],
        publication: 2005,
        available: true,
    });
    books.push({
        title: 'The Glass Sentence',
        author: 'S.E. Grove',
        genre: ['Young Adult', 'Fantasy'],
        publication: 2014,
        available: true,
    });
    books.push({
        title: 'The Magic Misfits',
        author: 'Neil Patrick Harris',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2017,
        available: true,
    });
    books.push({
        title: 'Sal & Gabi Break the Universe',
        author: 'Carlos Hernandez',
        genre: ['Children\'s', 'Science Fiction'],
        publication: 2019,
        available: true,
    });
    books.push({
        title: 'Redwall',
        author: 'Brian Jacques',
        genre: ['Fantasy', 'Adventure'],
        publication: 1986,
        available: true,
    });
    books.push({
        title: 'The Phantom Tollbooth',
        author: 'Norton Juster',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1961,
        available: true,
    });
    books.push({
        title: 'Restart',
        author: 'Gordon Korman',
        genre: ['Children\'s', 'Fiction'],
        publication: 2017,
        available: true,
    });
    books.push({
        title: 'The Capture',
        author: 'Kathryn Lasky',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2003,
        available: true,
    });
    books.push({
        title: 'The Lion the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        genre: ['Fantasy', 'Adventure'],
        publication: 1950,
        available: true,
    });
    books.push({
        title: 'Prince Caspian',
        author: 'C.S. Lewis',
        genre: ['Fantasy', 'Adventure'],
        publication: 1951,
        available: true,
    });
    books.push({
        title: 'The Voyage of the Dawn Treader',
        author: 'C.S. Lewis',
        genre: ['Fantasy', 'Adventure'],
        publication: 1952,
        available: true,
    });
    books.push({
        title: 'The Silver Chair',
        author: 'C.S. Lewis',
        genre: ['Fantasy', 'Adventure'],
        publication: 1953,
        available: true,
    });
    books.push({
        title: 'The Horse and His Boy',
        author: 'C.S. Lewis',
        genre: ['Fantasy', 'Adventure'],
        publication: 1954,
        available: true,
    });
    books.push({
        title: 'The Magician\'s Nephew',
        author: 'C.S. Lewis',
        genre: ['Fantasy', 'Adventure'],
        publication: 1955,
        available: true,
    });
    books.push({
        title: 'The Last Battle',
        author: 'C.S. Lewis',
        genre: ['Fantasy', 'Adventure'],
        publication: 1956,
        available: true,
    });
    books.push({
        title: 'The Call of the Wild',
        author: 'Jack London',
        genre: ['Adventure', 'Fiction'],
        publication: 1903,
        available: true,
    });
    books.push({
        title: 'The Bicycle Spy',
        author: 'Yona Zeldis McDonough',
        genre: ['Children\'s', 'Historical'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'Winnie the Pooh',
        author: 'A.A. Milne',
        genre: ['Children\'s', 'Fantasy'],
        publication: 1926,
        available: true,
    });
    books.push({
        title: 'The Stars Did Wander Darkling',
        author: 'John D. Nesbitt',
        genre: ['Science Fiction', 'Short Stories'],
        publication: 1978,
        available: true,
    });
    books.push({
        title: 'Legacy',
        author: 'Shannon Messenger',
        genre: ['Young Adult', 'Fantasy'],
        publication: 2019,
        available: true,
    });
    books.push({
        title: 'Impyrium',
        author: 'Henry H. Neff',
        genre: ['Young Adult', 'Fantasy'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'Island of the Blue Dolphins',
        author: 'Scott O\'Dell',
        genre: ['Children\'s', 'Adventure'],
        publication: 1960,
        available: true,
    });
    books.push({
        title: 'Auggie & Me',
        author: 'R.J. Palacio',
        genre: ['Children\'s', 'Fiction'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'Eragon',
        author: 'Christopher Paolini',
        genre: ['Fantasy', 'Adventure'],
        publication: 2002,
        available: true,
    });
    books.push({
        title: 'Bridge to Terabithia',
        author: 'Katherine Paterson',
        genre: ['Children\'s', 'Fiction'],
        publication: 1977,
        available: true,
    });
    books.push({
        title: 'I Funny',
        author: 'James Patterson and Chris Grabenstein',
        genre: ['Children\'s', 'Humor'],
        publication: 2012,
        available: true,
    });
    books.push({
        title: 'The Golden Compass',
        author: 'Philip Pullman',
        genre: ['Fantasy', 'Adventure'],
        publication: 1995,
        available: true,
    });
    books.push({
        title: 'The Subtle Knife',
        author: 'Philip Pullman',
        genre: ['Fantasy', 'Adventure'],
        publication: 1997,
        available: true,
    });
    books.push({
        title: 'The Amber Spyglass',
        author: 'Philip Pullman',
        genre: ['Fantasy', 'Adventure'],
        publication: 2000,
        available: true,
    });
    books.push({
        title: 'S.M. Puppy',
        author: 'Oliver Quessenberry',
        genre: ['Short Story', 'Fantasy'],
        publication: 2018,
        available: true,
    });
    books.push({
        title: 'The Revenge of Magic',
        author: 'James Riley',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2019,
        available: true,
    });
    books.push({
        title: 'The Lightning Thief',
        author: 'Rick Riordan',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2005,
        available: true,
    });
    books.push({
        title: 'The Sea of Monsters',
        author: 'Rick Riordan',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2006,
        available: true,
    });
    books.push({
        title: 'The Titan\'s Curse',
        author: 'Rick Riordan',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2007,
        available: true,
    });
    books.push({
        title: 'The Battle of the Labyrinth',
        author: 'Rick Riordan',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2008,
        available: true,
    });
    books.push({
        title: 'The Last Olympian',
        author: 'Rick Riordan',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2009,
        available: true,
    });
    books.push({
        title: 'The Hidden Oracle',
        author: 'Rick Riordan',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'Fantastic Beasts and Where to Find Them',
        author: 'J.K. Rowling',
        genre: ['Fantasy', 'Adventure'],
        publication: 2001,
        available: true,
    });
    books.push({
        title: 'The Crimes of Grindelwald',
        author: 'J.K. Rowling',
        genre: ['Fantasy', 'Adventure'],
        publication: 2008,
        available: true,
    });
    books.push({
        title: 'Holes',
        author: 'Louis Sachar',
        genre: ['Children\'s', 'Adventure'],
        publication: 1998,
        available: true,
    });
    books.push({
        title: 'Here Be Monsters!',
        author: 'Alan Snow',
        genre: ['Children\'s', 'Fantasy'],
        publication: 2005,
        available: true,
    });
    books.push({
        title: 'Smells Like Dog',
        author: 'Suzanne Selfors',
        genre: ['Children\'s', 'Adventure'],
        publication: 2010,
        available: true,
    });
    books.push({
        title: 'Smells Like Treasure',
        author: 'Suzanne Selfors',
        genre: ['Children\'s', 'Adventure'],
        publication: 2011,
        available: true,
    });
    books.push({
        title: 'Smells Like Pirates',
        author: 'Suzanne Selfors',
        genre: ['Children\'s', 'Adventure'],
        publication: 2012,
        available: true,
    });
    books.push({
        title: 'Appleblossom the Possum',
        author: 'Holly Goldberg Sloan',
        genre: ['Children\'s', 'Fiction'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'Treasure Island',
        author: 'Robert Louis Stevenson',
        genre: ['Adventure', 'Fiction'],
        publication: 1883,
        available: true,
    });
    books.push({
        title: 'The Swiss Family Robinson',
        author: 'Johann David Wyss',
        genre: ['Adventure', 'Fiction'],
        publication: 1812,
        available: true,
    });
    books.push({
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: ['Fantasy', 'Adventure'],
        publication: 1937,
        available: true,
    });
    books.push({
        title: 'The Fellowship of the Ring',
        author: 'J.R.R. Tolkien',
        genre: ['Fantasy', 'Adventure'],
        publication: 1954,
        available: true,
    });
    books.push({
        title: 'The Two Towers',
        author: 'J.R.R. Tolkien',
        genre: ['Fantasy', 'Adventure'],
        publication: 1954,
        available: true,
    });
    books.push({
        title: 'The Return of the King',
        author: 'J.R.R. Tolkien',
        genre: ['Fantasy', 'Adventure'],
        publication: 1955,
        available: true,
    });
    books.push({
        title: 'Charlotte\'s Web',
        author: 'E.B. White',
        genre: ['Children\'s', 'Fiction'],
        publication: 1952,
        available: true,
    });
    books.push({
        title: 'Stuart Little',
        author: 'E.B. White',
        genre: ['Children\'s', 'Fiction'],
        publication: 1945,
        available: true,
    });
    books.push({
        title: 'I am the Messenger',
        author: 'Markus Zusak',
        genre: ['Young Adult', 'Fiction'],
        publication: 2002,
        available: true,
    });
    books.push({
        title: 'Wonder',
        author: 'R.J. Palacio',
        genre: ['Children\'s', 'Fiction'],
        publication: 2012,
        available: true,
    });
    books.push({
        title: 'The Wonderful Story of Henry Sugar and Six More',
        author: 'Roald Dahl',
        genre: ['Children\'s', 'Short Stories'],
        publication: 1977,
        available: true,
    });
    books.push({
        title: 'The Matchstick Castle',
        author: 'Keir Graff',
        genre: ['Children\'s', 'Adventure'],
        publication: 2017,
        available: true,
    });
    books.push({
        title: 'An Ember in the Ashes',
        author: 'Sabaa Tahir',
        genre: ['Young Adult', 'Fantasy'],
        publication: 2015,
        available: true,
    });  
    books.push({
        title: 'Children of Time',
        author: 'Adrian Tchaikovsky',
        genre: ['Science Fiction', 'Space Opera','Novel'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'Look Out for the Little Guy',
        author: 'Scott Lang',
        genre: ['Humor', 'Fiction', 'Superhero', 'Autobiography'],
        publication: 2023,
        available: true,
    });
    books.push({
        title: 'The Rise of Riverstone',
        author: 'Mandy Schimelpfenig',
        genre: ['Medieval Historical Fantasy'],
        publication: 2021,
        available: true,
    });
    books.push({
        title: 'A Torch Against the Night',
        author: 'Sabaa Tahir',
        genre: ['Young Adult Literature', 'Fantasy Fiction'],
        publication: 2016,
        available: true,
    });
    books.push({
        title: 'A Reaper at the Gates',
        author: 'Sabaa Tahir',
        genre: ['Young Adult Literature', 'Fantasy Fiction'],
        publication: 2018,
        available: true,
    });
    books.push({
        title: 'A Sky Beyond the Storm',
        author: 'Sabaa Tahir',
        genre: ['Young Adult Literature', 'Fantasy Fiction'],
        publication: 2020,
        available: true,
    });
    books.push({
        title: 'The Three-Body Problem',
        author: 'Cixin Liu',
        genre: ['Science Fiction', 'Novel', 'Speculative Fiction', 'Chinese Science Fiction'],
        publication: 2008,
        available: true,
    });
    books.push({
        title: 'The Dark Forest',
        author: 'Cixin Liu',
        genre: ['Science Fiction', 'Novel', 'Hard Science Fiction'],
        publication: 2008,
        available: true,
    });
    books.push({
        title: 'Death\'s End',
        author: 'Cixin Liu',
        genre: ['Science Fiction', 'Hard Science Fiction'],
        publication: 2010,
        available: true,
    });
    books.push({
        title: 'Emperor of the Universe',
        author: 'David Lubar',
        genre: ['Humor', 'Science Fiction', 'Fiction'],
        publication: 2019,
        available: true,
    });
    books.push({
        title: 'The Force Awakens',
        author: 'Michael Kogge',
        genre: ['Science Fiction', 'Fiction', 'Fantasy', 'Space Opera', 'Adventure', 'Novel', 'Star Wars'],
        publication: 2015,
        available: true,
    });
    books.push({
        title: 'The Star Shepherd',
        author: 'Dan Haring and MarcyKate Connolly',
        genre: ['Fantasy', 'Fiction', 'Adventure', 'Science Fiction', 'Young Adult'],
        publication: 2019,
        available: true,
    });
    books.push({
        title: 'Starling House',
        author: 'Alix E. Harrow',
        genre: ['Fantasy Fiction', 'Gothic Fiction', 'Dark Fantasy', 'Contemporary Fantasy'],
        publication: 2023,
        available: true,
    });

    sortBooks();  
}
