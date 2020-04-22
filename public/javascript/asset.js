class Asset extends HTMLElement {

    static get observedAttributes() {
        return ['assetimage', 'text', 'link'];
    }

    constructor(details) {
        // Always call super first in constructor
        super();

        let template = document.getElementById('assetlink');
        let templateContent = template.content;

        this.details = details;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    connectedCallback(){
        var customElement = this;
        var sr = this.shadowRoot;
        this.assetimage = sr.getElementById('assetimage');
        this.assetimage.src = customElement.getAttribute('assetimage');
        this.assettext = sr.getElementById('text');
        this.assettext.innerHTML = customElement.getAttribute('text');

        let link = customElement.getAttribute('link')
        if (link) {
            this.assettext.addEventListener("click", e => {
                window.location = link
            })
        }
    }
}

try {
    customElements.define('asset-element', Asset);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}