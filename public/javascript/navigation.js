class Navigation extends HTMLElement {

    
    RESERVATION = 0
    EVENTS = 1
    ACCOUNT = 2
    
    SELECTEDVIEW = 0;

    clickAccount() {
        console.log('click account');

        var accountimg = this.accountsbutton.childNodes[0];
        accountimg.src = './images/account-selected.svg';

        var resimg = this.transactionsbutton.childNodes[0];
        resimg.src = './images/transactions-deselected.svg';

        var eventimg = this.statsbutton.childNodes[0];
        eventimg.src = './images/statistics-deselected.svg';

        this.SELECTEDVIEW = this.ACCOUNT;

        var event = new Event('build');
        this.dispatchEvent(event);

        var mobileview = this.getMobileView();
        mobileview.innerHTML = "<account-element></account-element>"
    }

    clickTransactions() {

        var accountimg = this.accountsbutton.childNodes[0];
        accountimg.src = './images/account-deselected.svg';

        var resimg = this.transactionsbutton.childNodes[0];
        resimg.src = './images/transactions-selected.svg';

        var eventimg = this.statsbutton.childNodes[0];
        eventimg.src = './images/statistics-deselected.svg';

        console.log('click reservation');

        this.SELECTEDVIEW = this.RESERVATION;

        var mobileview = this.getMobileView();
        mobileview.innerHTML = "<transactions-element></transactions-element>";
    }

    clickStats() {
        console.log('click events');

        var accountimg = this.accountsbutton.childNodes[0];
        accountimg.src = './images/account-deselected.svg';

        var resimg = this.transactionsbutton.childNodes[0];
        resimg.src = './images/transactions-deselected.svg';

        var eventimg = this.statsbutton.childNodes[0];
        eventimg.src = './images/statistics-selected.svg';

        this.SELECTEDVIEW = this.EVENTS;

        var mobileview = this.getMobileView();
        mobileview.innerHTML = "<events-element></events-element>";
    }

    getMobileView(){
        var sr = this.shadowRoot;

         // I don't like this being hard coded, but have stuggled to find a dynamic way for exampe: .childNodes.item("mobileview");

        var mobileview = sr.host.parentElement.childNodes[3]; 
        return mobileview;
    }

    constructor() {
        super();

        let template = document.getElementById('navigationview');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));

        var sr = this.shadowRoot;

        this.accountsbutton = sr.getElementById('accountbutton');
        this.transactionsbutton = sr.getElementById('transactionsbutton');
        this.statsbutton = sr.getElementById('statsbutton');

        this.accountsbutton.addEventListener('click', e => {
            this.clickAccount();
        });

        this.transactionsbutton.addEventListener('click', e => {
            this.clickTransactions();
        });

        this.statsbutton.addEventListener('click', e => {
            this.clickStats();
        });
    }
}

try {
    customElements.define('navigation-element', Navigation);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}