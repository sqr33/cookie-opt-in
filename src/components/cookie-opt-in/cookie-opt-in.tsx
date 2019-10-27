import { Component, h, State, Method, Prop, Watch } from '@stencil/core';
import { CookieOptInSettings } from './settings'
import Cookie from 'js-cookie';

@Component({
  tag: 'cookie-opt-in',
  styleUrl: 'cookie-opt-in.scss'
})
export class CookieOptIn {

  @Prop() config;

  @State() private settings: CookieOptInSettings = new CookieOptInSettings();


  private checkboxStatus: Object = {};
  private cookiesToDelete: Object = {};
  private wasConsented: boolean = false;

  @State() detailsVisible = false;
  @State() modalVisible = true;

  @Method() async toggleCookeieOptInModal() {
    this.modalVisible = !this.modalVisible;
  }

  deleteCookiesWithPrefix(prefix: string) {
    const cookies = Cookie.get();
    for (let cookieName in cookies) {
      if (cookieName.startsWith(prefix)) {
        Cookie.remove(cookieName);
        Cookie.remove(cookieName, { path: '/', domain: `.${window.location.host}` });

      }
    }
  }

  toggleDetailsVisibility() {
    this.detailsVisible = !this.detailsVisible;
  }

  runLinkedScripts(scriptClass: string) {
    const elements = document.getElementsByClassName(scriptClass);
    Array.prototype.forEach.call(elements, (elem) => {
      const source = elem.src;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = source;
      document.body.appendChild(script);
    })
  }

  runEmbeddedScripts(scriptClass: string) {
    const elements = document.getElementsByClassName(scriptClass);
    Array.prototype.forEach.call(elements, (elem) => {
      const scriptToExecute = elem.innerText;
      const script = document.createElement('script');
      const scriptText = document.createTextNode(scriptToExecute);
      script.appendChild(scriptText);
      document.body.appendChild(script);
    })
  }

  checkIfTicked(checkboxId: string): boolean {
    const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    return checkbox.checked
  }

  setAllToTicked() {
    for (let checkboxId in this.checkboxStatus) {
      const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
      checkbox.checked = true;
    }
  }

  setToTicked(checkboxId: string) {
    const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    checkbox.checked = true;
  }

  setCookies() {
    Cookie.set('cookieOptInConsent', true, { expires: 365 });
    for (let checkboxId in this.checkboxStatus) {
      const currentState = this.checkboxStatus[checkboxId];
      Cookie.set(`cookieOptInConsent-${checkboxId}`, currentState, { expires: 365 });
    }
  }

  checkWhatToExecute(all: boolean = false) {
    if (all) {
      this.setAllToTicked();
    }

    let reload = false;
    for (let checkboxId in this.checkboxStatus) {
      const previousState = this.checkboxStatus[checkboxId];
      if (previousState === false && this.checkIfTicked(checkboxId)) {
        this.runLinkedScripts(`${checkboxId}-script-link`);
        this.runEmbeddedScripts(checkboxId);
        this.checkboxStatus[checkboxId] = true;
      }

      if (previousState === true && !this.checkIfTicked(checkboxId)) {
        console.log(`Running Opt Out Scripts for ${checkboxId}`);
        const cookiesToDelete = this.cookiesToDelete[checkboxId];
        console.log(cookiesToDelete);
        cookiesToDelete.forEach(cookiePrefix => {
          this.deleteCookiesWithPrefix(cookiePrefix);
        });
        this.checkboxStatus[checkboxId] = false;
        reload = true;
      }
    }
    this.setCookies();

    if (reload) {
      location.reload();
    }

    this.modalVisible = false;
  }

  @Watch('config')
  mergeConfig() {
    if (this.config) { //because of https://medium.com/@gilfink/using-complex-objects-arrays-as-props-in-stencil-components-f2d54b093e85
      if (typeof this.config === 'string') {
        this.config = JSON.parse(this.config);
      }
      this.settings = { ...this.settings, ...this.config };
    }
  }

  componentWillLoad() {
    this.mergeConfig();
    const wasConsented: string = Cookie.get('cookieOptInConsent');
    if (wasConsented && wasConsented === 'true') {
      this.wasConsented = true;
      this.modalVisible = false;
    }

  }

  componentDidLoad() {
    //console.log(JSON.stringify(this.settings));
    this.settings.checkboxes.map((checkbox) => {
      if (this.wasConsented) {
        const isAllowed = Cookie.get(`cookieOptInConsent-${checkbox.id}`);
        if (isAllowed && isAllowed === 'true') {
          this.setToTicked(checkbox.id);
        }
      }
      this.checkboxStatus[checkbox.id] = false;
      this.cookiesToDelete[checkbox.id] = checkbox.cookies;
    }
    )
    if (this.wasConsented) {
      this.checkWhatToExecute();

    }
  }

  render() {
    return (
      [<div id="cookie-modal" class={`cookie-modal ${this.modalVisible ? '' : 'hidden'}`}>
        <div class="modal-content">
          <div class="heading">
            {this.settings.heading}
          </div>
          <div class="notice">
            <p innerHTML={this.settings.notice.replace(/\s+/g, " ")}>
            </p>
          </div>
          <div class="checkboxes">
            {this.settings.checkboxes.map((checkbox) =>
              <div style={checkbox.necessary ? { 'pointer-events': 'none' } : {}}>
                <label class="checkbox-label" >
                  <input id={checkbox.id} class="checkbox" type="checkbox"
                    checked={checkbox.necessary}
                    disabled={checkbox.necessary}
                  />
                  {checkbox.label}</label>
              </div>

            )}
          </div>
          <div class="details-toggle" >
            <div id="details-toogle-button" onClick={() => this.toggleDetailsVisibility()}>
              {this.detailsVisible ? this.settings.hideDetails : this.settings.showDetails}
            </div>
          </div>

          <div id="details-text" class={`details-text ${this.detailsVisible ? '' : 'hidden'}`}>
            <ul>
              {this.settings.details.map((detail) =>
                <li>
                  <h4>{detail.heading}</h4>
                  <p>{detail.text}</p>
                </li>
              )}
            </ul>
            <div class="details-toggle" onClick={() => this.toggleDetailsVisibility()}>
              <div> {this.settings.hideDetails}</div>
            </div>
          </div>
          <div class="imprint">
            <a href={this.settings.imprintLink}>Imprint</a>
          </div>
          <div class="buttons">
            <button class="btn-all" onClick={() => this.checkWhatToExecute(true)}>{this.settings.buttonAll}</button>
            <button class="btn-confirm" onClick={() => this.checkWhatToExecute(false)}>{this.settings.buttonConfirm}</button>
          </div>

        </div>
      </div>,
      ]
    );
  }
}
