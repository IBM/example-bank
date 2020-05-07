class Tile extends HTMLElement {

    static get observedAttributes() {
        return ['tileimage', 'tiletext', 'limit', 'base'];
    }

    constructor() {
        super();

        let template = document.getElementById('tile');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    connectedCallback(){
        var customElement = this;
        var sr = this.shadowRoot;
        this.tileimage = sr.getElementById('buttonImage');
        this.tileimage.src = customElement.getAttribute('tileimage');
        this.tiletext = customElement.getAttribute('tiletext');
        this.limit=customElement.getAttribute('ceiling');
        this.base=customElement.getAttribute('base');
        this.button = sr.getElementById('tileButton');
        this.button.onclick = function () {
            console.log('CLICKING TILE: ' + customElement.tiletext.toLocaleUpperCase());
            var customEvent = new CustomEvent( 'APPTILE', {
                detail: {
                    eventData: {"name":customElement.tiletext,"limit":customElement.limit,"base":customElement.base}
                },
                bubbles: true
            });
            customElement.dispatchEvent(customEvent);
            
        }

        console.log('ADDING TILE : ' + this.tiletext.toLocaleUpperCase());
    }
}

try {
    customElements.define('tile-element', Tile);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}