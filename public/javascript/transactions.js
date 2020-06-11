class Transactions extends HTMLElement {

    balance = 0;
    points = 0;

    constructor() {
        super();

        let template = document.getElementById('transactions');
        let templateContent = template.content;

        console.log('INITIALIZING TRANSACTIONS VIEW')

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    createTransaction(vendor, date, amount, points){
        var transaction = document.createElement('transaction-element');
        transaction.setAttribute('vendor', vendor);
        transaction.setAttribute('date', date);
        if (amount != '-') amount = amount.toFixed(2);
        if (points != '-') points = points.toFixed(2);
        transaction.setAttribute('amount', amount);
        transaction.setAttribute('points',points);
        return transaction;
    }

    connectedCallback() {
        var sr = this.shadowRoot;
        var transactionlist = sr.getElementById('TRANSACTIONLIST');
        var balance = sr.getElementById('BALANCE');
        var points = sr.getElementById('POINTS');
        var transactionComponent = this;

        getTransactions(loyalty.getCookie('access_token'), (err, _transactions) => {
          console.log(_transactions)
          if (err == null) {
            let transactions = _transactions.sort((a,b) => new Date(b.date) -new Date(a.date))
            transactions.forEach(transaction => {
              const date = new Date(transaction.date)
              const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
              const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
              const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
              if (transaction.amount != null || transaction.amount != undefined) transactionComponent.balance += transaction.amount
              if (transaction.pointsEarned != null || transaction.pointsEarned != undefined) transactionComponent.points += transaction.pointsEarned
              if (transaction.amount == null || transaction.amount == undefined) transaction.amount = '-'
              if (transaction.pointsEarned == null || transaction.pointsEarned == undefined) transaction.pointsEarned = '-'
              let transactionElement = transactionComponent.createTransaction(transaction.transactionName, month + " " + day + " " + year, transaction.amount, transaction.pointsEarned)
              transactionlist.appendChild(transactionElement)
            })

            balance.innerHTML = '$' + transactionComponent.balance.toFixed(2);
            points.innerHTML = transactionComponent.points.toFixed(2);
          } else if (err == 'User not registered') {
            let phoneview = document.getElementById("phoneview");
            let mobileview = phoneview.getMobileView();
            mobileview.innerHTML = "";
            let element = document.createElement('loading-spinner-element');
            element.setAttribute("status", "User is marked for deletion...")
            mobileview.appendChild(element)
            phoneview.hideNavigation();

            setTimeout(() => {
                element.setAttribute("status", "Logging out...")
                setTimeout(() => {
                  // clear cookies of tokens
                  document.cookie = "access_token=; Max-Age=0'"
                  document.cookie = "id_token=; Max-Age=0'"

                  // clear local storage
                  localStorage.clear()

                  mobileview.innerHTML = "";
                  var welcome = document.createElement('welcome-element')
                  welcome.setAttribute('mode','INTEGRATED')
                  mobileview.appendChild(welcome)

                }, 2500)
            }, 2000)
          }
        })
    }
}

try {
    customElements.define('transactions-element', Transactions);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
