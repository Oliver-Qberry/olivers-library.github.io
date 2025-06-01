export class User {
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