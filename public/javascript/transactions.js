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
        this.testdata.forEach(function(item){
            transactionComponent.balance = transactionComponent.balance + item.amount;
            transactionComponent.points = transactionComponent.points + item.pointsEarned;
            var transaction = transactionComponent.createTransaction(item.transactionName, '01 MAY 2020', '$' + item.amount, item.pointsEarned);
            transactionlist.appendChild(transaction);
        })
        balance.innerHTML = '$' + transactionComponent.balance;
        points.innerHTML = transactionComponent.points;
    }


    testdata = [{
        "amount": 20,
        "category": "Cafe",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 20,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Starbucks",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 15,
        "category": "Carshare",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned":15,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Uber",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 70,
        "category": "Gas",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 100,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Esso",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 20,
        "category": "Meals",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned":20,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Sweetgreen",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },,
      {
        "amount": 127,
        "category": "Groceries",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 200,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Whole Foods",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 34,
        "category": "Meals",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned":34,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Shake Shack",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      ,
      {
        "amount": 20,
        "category": "Meals",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned":20,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Sweetgreen",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },,
      {
        "amount": 127,
        "category": "Groceries",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned": 200,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Whole Foods",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      },
      {
        "amount": 5.75,
        "category": "Cafe",
        "date": "2020-04-27T22:09:39.183Z",
        "pointsEarned":34,
        "processed": true,
        "transactionId": "c2eb0fb9-2af0-43a3-820d-fa210203f698",
        "transactionName": "Starbucks",
        "userId": "60e67c81-1a27-4423-a890-db653941822a"
      }
    ]
}

try {
    customElements.define('transactions-element', Transactions);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}