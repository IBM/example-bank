class NavigationButton extends HTMLElement {


    SELECTEDSUFFIX = '-selected.svg';
    DESELECTEDSUFFIX = '-deselected.svg'

    static get observedAttributes() {
        return ['imagename','viewname','mode'];
    }

    constructor() {
        super();

        let template = document.getElementById('navigationbutton');
        let templateContent = template.content;

        const shadow = this.attachShadow({
                mode: 'open'
            })
            .appendChild(templateContent.cloneNode(true));
    }

    setMode(mode){
        this.mode = mode;

        var imagestring = this.imagename;

        if(this.mode=='active'){
            imagestring = imagestring + this.SELECTEDSUFFIX;
        }else{
            imagestring = imagestring + this.DESELECTEDSUFFIX;
        }

        this.buttonimage.src = './images/' + imagestring;
    }

    setEnabled(){
        this.setMode('active');
    }

    setDisabled(){
        this.setMode('inactive');
    }

    connectedCallback(){
        var customElement = this;
        var sr = this.shadowRoot;
        this.buttonimage = sr.getElementById('navbuttonimage');
        this.button = sr.getElementById('navbutton');

        // this.mode = customElement.getAttribute('mode');
        this.viewname = customElement.getAttribute('viewname');
        this.imagename = customElement.getAttribute('imagename') 

        this.setMode(customElement.getAttribute('mode'));

        this.button.onclick = function () {
            console.log('CLICKING NAV BUTTON: ' + customElement.viewname.toLocaleUpperCase());
            var customEvent = new CustomEvent( 'NAV', {
                detail: {
                    eventData: {"id":customElement.viewname}
                },
                bubbles: true
            });
            customElement.dispatchEvent(customEvent);            
        }

        console.log('ADDING NAVIGATION BUTTON : ' + this.viewname.toLocaleUpperCase());
    }
}


try {
    customElements.define('navigationbutton-element', NavigationButton);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}