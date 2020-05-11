class Analysis extends HTMLElement {

    static get observedAttributes() {
        return ['events', 'points', 'mode'];
    }

    events = ""
    points = ""
    name = ""

    mode = 'DEVMODE'; // 'INTEGRATED'

    constructor() {
        // Always call super first in constructor
        super();

        console.log('INITIALIZED ACCOUNT VIEW');
        var customElement = this;

        let template = document.getElementById('analysis');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }


   

    getChartData(){
        var data = [
            {
              "category": "Cafe",
              "count": 45
            },
            {
              "category": "Groceries",
              "count": 239
            },
            {
              "category": "Fuel",
              "count": 75
            },
            {
              "category": "Ride Share",
              "count": 35
            },
            {
              "category": "Restaurant",
              "count": 90
            }
        ];

        return data;
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
                    values.push(entry.count)
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
        
        // var dataset = this.getChartData();

        // var labels = [];
        // var values = [];

        // dataset.forEach(function(entry){
        //     labels.push(entry.category);
        //     values.push(entry.count);
        // })

        // var data = {
        //     labels: labels,
        //     datasets: [{
        //         label: 'Spending Breakdown',
        //         data: values,
        //         backgroundColor: [
        //             'rgba(178, 35, 60, 1.0)',
        //             'rgba(229, 45, 78, 1.0)',
        //             'rgba(236, 108, 131, 1.0)',
        //             'rgba(244, 171, 184, 1.0)',
        //             'rgba(252, 234, 237, 1.0)',
        //             'rgba(102, 20, 34, 1.0)'
        //         ]
        //     }]
        // };

        // var myDoughnutChart = new Chart(ctx, {
        //     type: 'doughnut',
        //     data: data
        // });     
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('ACCOUNT ATTRIBUTE CHANGED')

        if (name == 'events') {
            console.log('events changed')
            this.shadowRoot.getElementById('eventsattended').innerHTML = newValue
        } else if (name == 'points') {
            console.log('points changed')
            this.shadowRoot.getElementById('pointearned').innerHTML = newValue
        }
    }
}

try {
    customElements.define('analysis-element', Analysis);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
