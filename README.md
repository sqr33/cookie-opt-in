# Cookie Opt-In by square33
On 01 October 2019 the European Court of Justice (ECJ) decided that websites have to obtain active cookie consent from their users. [Here](https://www.it-recht-kanzlei.de/www.it-recht-kanzlei.de/eugh-cookie-informierte-einwilligung-pflicht.html) is a summary by IT-Recht Kanzlei (in German).
This means that before firing any cookies that are not strictly required due to technical reasons website owners must give people the opportunity to actively choose those cookies - or at least categories of cookies - they are OK with.
This tool creates a configurable dialogue box for this purpose.


## Features
- Dialogue box that greets new users and let them either explicitly opt into certain cookie categories they are fine with or permit all cookies in one go.
- Fully configurable categories that suit your needs (e.g. strictly necessary, personalisation, marketing, comfort, chat support, ...).
- Fires JavaScript that sets cookies for each category separately after consent has been given.
- Easily embeddable both in web frameworks and normal web pages.
- Can delete cookies of certain categories if user decides at a later stage to withdraw permissions granted earlier.


## Demo
Check the [`example.html`](https://github.com/sqr33/cookie-opt-in/blob/master/example.html) in the root directory of the GitHub repo under [github.com/sqr33/cookie-opt-in](https://github.com/sqr33/cookie-opt-in/).
Just download it and run it in your browser.


## Setup
The tool is set up in three steps outlined below. If any questions pop up during the setup, feel free to drop me a note (alex@square33.de) or open an issue. 
I will do my best to help you.

**STEP 1:** Include the following code snippets of the latest version into your HTML (e.g. in the head section)

```
     <script type="module"
        src="https://unpkg.com/@square33/cookie-opt-in/dist/cookie-opt-in/cookie-opt-in.esm.js"></script>
    <script nomodule=""
        src="https://unpkg.com/@square33/cookie-opt-in/dist/cookie-opt-in/cookie-opt-in.js"></script>
```
For frameworks, please check the [Stencil documentation](https://stenciljs.com/docs/distribution#using-your-component-in-a-framework).

**STEP 2:** Define cookie categories that are relevant for your website (see Custom Configuration)

The script comes pre-configured with these four categories
- Necessary(`id`: `category-necessary`): Cookies that are necessary to make your website functional.
- Statistics(`id`: `category-statistics`): There is a debate about whether analytics cookies are functional or need to be consented explicitly, but here it's separate category.
- Chat Support(`id`: `category-chat`): Maybe you want to offer a chat widget for quick access to a service rep.
- Marketing(`id`: `category-marketing`): If you have any other marketing cookies you might want to add a separate category.

**STEP 3:** In order to prevent existing scripts from immediately firing cookies when a user visits your website, you need to add a category and set them to `type="text/plain"`. 

Example: I want that Google Analytics is only downloaded and executed when the user has consented to the 'Statistics' category. To do that just put `class="categoryId" type="text/plain` into the script tag:

First, in order to prevent the download the usual code snippet
```
 <script src="https://www.googletagmanager.com/gtag/js?id=UA-109990725-X"></script>
```
is slightly modified:
```
<script class="category-statistics" type="text/plain"
    src="https://www.googletagmanager.com/gtag/js?id=UA-109990725-X"></script>
```

If you want to prevent direct JS execution, do the same:
```
  <script class="category-statistics" type="text/plain">
    console.log('Necessary Script'); 
    var disableStr = 'ga-disable-UA-109990725-X';
    if ((document.cookie.indexOf(disableStr + '=true') > -1)
      || (decodeURI(window.location.search).indexOf("internal")) > -1) {
      window[disableStr] = true;
    };
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'UA-109990725-X', { 'anonymize_ip': true });
  </script>
```

Then, you can add the new web component somewhere on your page:
```
    <cookie-opt-in></cookie-opt-in>
```


## Reopen Cookie Dialogue
If you want to see the cookie dialogue again or hide it, call the `toggleCookeieOptInModal()` method on the component.
Outside a framework (e.g. in your index.html) you can do the following:
```
document.querySelector('cookie-opt-in').toggleCookeieOptInModal();
```
e.g.
```
 <button onclick="document.querySelector('cookie-opt-in').toggleCookeieOptInModal();">Show Cookie Consent</button>
```

## Switch Language
If you don't need dynamically switch languages or are in a framework, just add the language directly into the element tag:
```
<cookie-opt-in language="DE"></cookie-opt-in>
```

If you need to change the language through HTML, you can do it this way:
```
document.querySelector('cookie-opt-in').language='DE';
e.g.
  <button onclick="document.querySelector('cookie-opt-in').language='EN';">Switch to English</button>
```
You can create custom configurations for each language you like. 


## Custom Configuration
See `example.html` for a full working example.
In most cases you will need a custom configuration of this tool, e.g. to define your own categories and list cookies that need to be deleted when the category is un-ticked by the user later on. 

Currently, this project comes with the German and English configuartions
Here is the full configuration. You can overwrite any part of it.

### German Default Configuration
```
{
    "heading": "Cookie-Einstellungen",
    "notice": "Wir verwenden Cookies, um Ihnen die bestmögliche Webseite anzubieten. Das bedeutet, dass wir Cookies nutzen, um die Seite funktionsfähig zu machen, als auch Cookies, die für eine anonyme statistische Erfassung, unseren Chat-Support und für Marketingzwecke notwendig sind. Ihnen steht es frei, zu entscheiden, welche Kategorien Sie zulassen möchten. Bitte seien Sie Sich bewusst, dass abhängig von Ihrer Auswahl eventuell nicth die volle Webseitenfunktionalität zur Verfügung steht. Weitere Informationen finden Sie in unserer <a target=\"_blank\" href=\"/datenschutz\">Datenschutzerlärung</a>.",
    "buttonAll": "Alle auswählen",
    "buttonConfirm": "Auswahl bestätigen",
    "imprintLink": "#",
    "hideDetails": "Details ausblenden",
    "showDetails": "Details anzeigen",
    "categories": [
        {
            "necessary": true,
            "id": "category-necessary",
            "label": "Notwendig",
            "description": "Diese Cookies sind unbedingt für die Funktionalität der Seite notwendig z.B. Anmeldeinformationen, Sicherheit oder Ihre Cookie-Einstellugen",
            "cookies": []
        },
        {
            "necessary": false,
            "id": "category-statistics",
            "label": "Anonyme Statistiken",
            "description": "Um unsere Webseite besser verstehen zu können und sie in Zukunft für Sie zu verbessern, erheben wir In order to improve our website going forward, we anonymously collect data for statistical and analytical purposes. With these cookies we can, for instance, monitor the number or duration of visits of specific pages of our website helping us in optimising user experience.",
            "cookies": [
                "_g"
            ]
        },
        {
            "necessary": false,
            "id": "category-chat",
            "label": "Chat Unterstützung",
            "description": "Wir möchten es Ihnen So einfach wie möglich mit uns Kontakt aufzunehmen und Unterstützung zu bekommen. Zum Beispiel über unsere Chatbox, die Cookies voraussetzt.",
            "cookies": []
        },
        {
            "necessary": false,
            "id": "category-marketing",
            "label": "Marketing",
            "description": "Diese Cookies helfen uns dabei, unser Marketing zu messen und zu verbessern.",
            "cookies": []
        }
    ],
    "styles": {
        "confirmAllButton": {}
    }
}
```

### English Default Configuration
```
{
    "heading": "Cookie Consent",
    "notice": "We use cookies so that we can offer you the best possible website experience. This includes cookies which are necessary for the operation of the website, as well as other cookies which are used solely for anonymous statistical purposes, for our support chat or for marketing purposes. You are free to decide which categories you would like to permit. Please note that depending on the settings you choose, the full functionality of the website may no longer be available. Further information can be found in our <a href=\"/data-protection\">Privacy Policy</a>.",
    "buttonAll": "Select All",
    "buttonConfirm": "Confirm Selection",
    "imprintLink": "#",
    "hideDetails": "Hide Details",
    "showDetails": "Show Details",
    "categories": [
        {
            "necessary": true,
            "id": "category-necessary",
            "label": "Necessary",
            "description": "These cookies are technically required for our core website to work properly, e.g. security functions or your cookie consent preferences.",
            "cookies": []
        },
        {
            "necessary": false,
            "id": "category-statistics",
            "label": "Statistics",
            "description": "In order to improve our website going forward, we anonymously collect data for statistical and analytical purposes. With these cookies we can, for instance, monitor the number or duration of visits of specific pages of our website helping us in optimising user experience.",
            "cookies": [
                "_g"
            ]
        },
        {
            "necessary": false,
            "id": "category-chat",
            "label": "Chat Support",
            "description": "We want to make it as easy as possible for you to reach our support teams, e.g. via our chat box, which requires certain cookies.",
            "cookies": []
        },
        {
            "necessary": false,
            "id": "category-marketing",
            "label": "Marketing",
            "description": "These cookies help us in measuring and optimising our marketing efforts.",
            "cookies": []
        }
    ],
    "styles": {
        "confirmAllButton": {}
    }
}
    
```

Pay attention that only if you add cookie names or prefixes to the 'categories' items, the script can delete the cookies when consent is revoked.

Also you will most likely need to overwrite the notice element because of the data protection URL (you can add any HTML code in there).

We are currently working on improving these manual tweaks for future releases.

You don't need to overwrite the full configuration but can only overwrite some parts (see example below).
If you are using a framework, just pass it as a parameter to the component:
```
    <cookie-opt-in configs=[myNewFRLanguageConfig, myOverrideEnglishConfig] language="FR">
    </cookie-opt-in>

```

If you are embedding it into plain HTML, the following approach should work (but the tag has to come first!):
```
    <cookie-opt-in></cookie-opt-in>

 var overwriteConfig = {
      "heading": "Cookie Consent Example"
    };

    var cmp = document.querySelector('cookie-opt-in');
    cmp.config = overwriteConfig;
```

## Other Legal Requirements For Your Webpage
- You need to add functionality on your website (e.g. a link or a button) to ensure that people can change their initial cookie choices later on.
- You need to explicitly list the services and cookies you are using somewhere on your website (e.g. in your data protection statement).


## License
Currently you can use this code for non-commercial projects and purposes. If you want to use it for a commercial website, please let me know (alex@square33.de) and we will find a decent solution (I will also support you during setup and offer you an easy creator for your configuration). It's solely your responsibility to ensure your website is legal and compliant, we don't assume any liability if you decide to use our tool for your website.


## Technology
The project is written in [StencilJS](https://stenciljs.com/). 
The module code is in Angular-React (.jsx) and the styling in SCSS.
You can find the main code in `src/components/cookie-opt-in`.
It uses apart from Stencil also the [JS-Cookie library](https://github.com/js-cookie/js-cookie). 
