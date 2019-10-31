import { Component, h, State, Method, Prop, Watch } from '@stencil/core';
import { CookieNoticeSetting, EnglishCookieSettings, GermanCookieSettings } from './settings'
import Cookie from 'js-cookie';

@Component({
  tag: 'cookie-opt-in',
  styleUrl: 'cookie-opt-in.scss'
})
export class CookieOptIn {
  private defaultLanguage = 'EN';
  private stylePrefix = 'sqr33-coi-';

  // Not defining a type b/c in HTML you can only pass
  // in strings if you add it as an argument in the tag. 
  // It should be an Array of CookieNoticeSettings.
  @Prop() configs;
  private configMap: Object /* as Map<String,CookieNoticeSettings> */ = {
    'EN': new EnglishCookieSettings(),
    'DE': new GermanCookieSettings()
  }

  @Prop() language = this.defaultLanguage;

  @State() private settings: CookieNoticeSetting = this.configMap[this.language];


  private checkboxStatus: Object = {};
  private cookiesToDelete: Object = {};
  private wasConsented: boolean = false;

  @State() detailsVisible = false;
  @State() modalVisible = true;

  @Method() async toggleCookeieOptInModal() {
    this.modalVisible = !this.modalVisible;
  }

  @Watch('config')
  mergeConfig() {
    if (this.configs) { //because of https://medium.com/@gilfink/using-complex-objects-arrays-as-props-in-stencil-components-f2d54b093e85
      if (typeof this.configs === 'string') {
        this.configs = JSON.parse(this.configs);
      }
      for (var config of this.configs) {
        const langauge = config.language ? config.language : this.defaultLanguage;
        const existingConfig = this.configMap[langauge];
        const newConfig = existingConfig ? { ...existingConfig, ...config } : config;
        this.configMap[langauge] = newConfig;
        this.settings = newConfig;
      }

    }
  }

  @Watch('language')
  switchLanguage() {
    this.settings = this.configMap[this.language];
    this.hideModalIfIgnored();
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

  runScripts(scriptClass: string) {
    const elements = document.getElementsByClassName(scriptClass);
    // Elements is an object, not an array
    Array.prototype.forEach.call(elements, (elem) => {
      const source = elem.src;
      if (source) {
        this.runLinkedScript(source);
      } else {
        const scriptToExecute = elem.innerText;
        this.runEmbeddedScript(scriptToExecute);
      }
    });

  }

  runLinkedScript(scriptURL: string) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptURL;
    document.body.appendChild(script);
  }

  runEmbeddedScript(scriptToExecute: string) {
    const script = document.createElement('script');
    const scriptText = document.createTextNode(scriptToExecute);
    script.appendChild(scriptText);
    document.body.appendChild(script);
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
        this.runScripts(checkboxId);
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

  hideModalIfIgnored() {
    let isIgnored = false;
    const path = window.location.pathname;
    this.settings.disabledUrls.forEach((prefix) => {
      if (path.indexOf(prefix) > -1) {
        isIgnored = true;
      }
    }
    );
    if (isIgnored) {
      this.modalVisible = false;
    };
  }


  componentWillLoad() {
    // console.log(JSON.stringify(new EnglishCookieSettings()));
    this.mergeConfig();
    this.switchLanguage();

    const wasConsented: string = Cookie.get('cookieOptInConsent');
    if (wasConsented && wasConsented === 'true') {
      this.wasConsented = true;
      this.modalVisible = false;
    }




  }

  componentDidLoad() {
    this.mergeConfig();
    this.switchLanguage();
    this.hideModalIfIgnored();
    this.settings.categories.map((category) => {
      if (this.wasConsented) {
        const isAllowed = Cookie.get(`cookieOptInConsent-${category.id}`);
        if (isAllowed && isAllowed === 'true') {
          this.setToTicked(category.id);
        }
      }
      this.checkboxStatus[category.id] = false;
      this.cookiesToDelete[category.id] = category.cookies;
    }
    )
    if (this.wasConsented) {
      this.checkWhatToExecute();
    }
  }

  render() {
    return (
      [<div class={`${this.stylePrefix}modal-background ${this.modalVisible ? '' : 'hidden'}`} ></div>,
      <div id={`${this.stylePrefix}cookie-modal`} class={`${this.stylePrefix}cookie-modal ${this.modalVisible ? '' : 'hidden'}`}>
        <div class={`${this.stylePrefix}modal-content`}>
          <div class={`${this.stylePrefix}heading`}>
            {this.settings.heading}
          </div>
          <div class={`${this.stylePrefix}notice`}>
            <p innerHTML={this.settings.notice.replace(/\s+/g, " ")}>
            </p>
          </div>
          <div class={`${this.stylePrefix}checkboxes`}>
            {this.settings.categories.map((category) =>
              <div style={category.necessary ? { 'pointer-events': 'none' } : {}}>
                <label class={`${this.stylePrefix}checkbox-label`}>
                  <input id={category.id} class={`${this.stylePrefix}checkbox`} type="checkbox"
                    checked={category.necessary}
                    disabled={category.necessary}
                  />
                  {category.label}</label>
              </div>

            )}
          </div>
          <div class={`${this.stylePrefix}details-toggle`} >
            <div id="details-toogle-button" onClick={() => this.toggleDetailsVisibility()}>
              {this.detailsVisible ? this.settings.hideDetails : this.settings.showDetails}
            </div>
          </div>

          <div id="details-text" class={`${this.stylePrefix}details-text ${this.detailsVisible ? '' : 'hidden'}`}>
            <ul>
              {this.settings.categories.map((category) =>
                <li>
                  <h4>{category.label}</h4>
                  <p>{category.description}</p>
                </li>
              )}
            </ul>
            <div class={`${this.stylePrefix}details-toggle"`} onClick={() => this.toggleDetailsVisibility()}>
              <div> {this.settings.hideDetails}</div>
            </div>
          </div>
          <div class={`${this.stylePrefix}imprint`}>
            <a target="_blank" href={this.settings.imprintLink}>{this.settings.imprintText}</a>
          </div>
          <div class={`${this.stylePrefix}buttons`}>
            <button class={`${this.stylePrefix}btn-all`} style={this.settings.styles.confirmAllButton} onClick={() => this.checkWhatToExecute(true)}>{this.settings.buttonAll}</button>
            <button class={`${this.stylePrefix}btn-confirm`} onClick={() => this.checkWhatToExecute(false)}>{this.settings.buttonConfirm}</button>
          </div>

        </div>
      </div>,
      ]
    );
  }
}
