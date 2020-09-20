class Statistics extends HTMLElement {

    events = ""
    points = ""
    name = ""

    constructor() {
        // Always call super first in constructor
        super();

        console.log('INITIALIZED ACCOUNT VIEW');
        var customElement = this;

        let template = document.getElementById('statistics');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    connectedCallback(){

        console.log('INITIALIZING ANALYSIS');

        var sr = this.shadowRoot;
        var ctx = sr.getElementById('myChart');
        getSpending(loyalty.getCookie('access_token'), (err, spending) => {
            if (err == null) {
                console.log(spending)
                let labels = []
                let values = []
                
                spending.forEach(entry => {
                    labels.push(entry.category)
                    values.push(entry.amount)
                })

                let data = {
                    labels: labels,
                    datasets: [{
                        label: 'Spending Breakdown',
                        data: values,
                        backgroundColor: [
                            'rgba(178, 35, 60, 1.0)',
                            'rgba(229, 45, 78, 1.0)',
                            'rgba(236, 108, 131, 1.0)',
                            'rgba(244, 171, 184, 1.0)',
                            'rgba(252, 234, 237, 1.0)',
                            'rgba(102, 20, 34, 1.0)'
                        ]
                    }]
                };

                let myDoughnutChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: data
                });
            }

        })
    }
}

try {
    customElements.define('statistics-element', Statistics);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
