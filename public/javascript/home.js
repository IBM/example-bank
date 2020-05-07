class Home extends HTMLElement {

    mode = 'DEVMODE';
    // mode = 'INTEGRATED';

    constructor() {
        super();

        console.log('INITIALIZING HOMESCREEN');

        let template = document.getElementById('homescreen');
        let templateContent = template.content;
        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));            
    }

    showNotification(shadowRoot, tile){
        var notifcationArea = shadowRoot.getElementById('notificationarea');
        notifcationArea.innerHTML = '';

        var limit = tile.detail.eventData.limit * 100;
        var base =  tile.detail.eventData.base * 100;

        var charge = Math.floor(Math.random() * (limit - base + 1)) + base;
        charge=charge/100;
        charge=charge.toFixed(2);
      
        var entity = tile.detail.eventData.name.toUpperCase()
      
        console.log('CREATING A CREDIT CARD CHARGE OF $' + charge + ' ON ' + entity );
        
        var message = document.createElement('div');
        message.innerHTML = 'CREDIT CARD $' + charge + ' ON ' + entity ;
        message.className = 'notification';
        notifcationArea.appendChild(message);

        setTimeout(function(){
            notifcationArea.innerHTML = ''; 
        }, 2000);
    }

    connectedCallback() {
       
        var sr = this.shadowRoot;

        var tiles = sr.getElementById('APPTILES');

        var homescreen = this;

        tiles.addEventListener('APPTILE', e => {
            console.log('HOMESCREEN RECIEVED EVENT FROM TILE: ' + e.detail.eventData.name.toLocaleUpperCase());
            
            switch(e.detail.eventData.name){

                case 'bank':
                    sr.host.parentElement.innerHTML = '<welcome-element mode="' + this.mode + '"></welcome-element>';
                    break;

                default:
                    homescreen.showNotification(sr, e);
                    break;
            }
        });
    }
}

try {
    customElements.define('homescreen-element', Home);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
