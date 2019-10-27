# Cookie-Opt-In by square33

On the first of October 2019 the Court of Justice of the European Union decided that you need to have active cookie consent.
This means that before firing cookies that are not strictly required one must give people an option to actively chose and tick the options they are OK with.
This tool creates such a configurable dialog box.

## Features
- Dialog box that greets new users and let's them either pick all options or set explicit ticks they like.
- Fully configurable categories that suit your needs (e.g. strictly necessary, personalization, marketing, comfort, support chat, ...)
- Fires JavaScript that sets cookies for each category separately after consent given.
- Easy embeddable both in web frameworks as well as in normal web-pages
- Can delete Cookies on opt-out of a category. 

## Demo
Check the [`example.html`](https://github.com/sqr33/cookie-opt-in/blob/master/example.html) in the root directory of the github repo under [github.com/sqr33/cookie-opt-in](https://github.com/sqr33/cookie-opt-in/example.html).
Just download it and run it in your browser.

## Setup
If you have any questions for the setup, feel free to reach out to me on on ... or open an issue. 
I will do my best to help you.

In order to integrate it into your HTML-page, you have to include script (e.g. in the head) of the newest version:
```
     <script type="module"
        src="https://unpkg.com/@square33/cookie-opt-in/dist/cookie-opt-in/cookie-opt-in.esm.js"></script>
    <script nomodule=""
        src="https://unpkg.com/@square33/cookie-opt-in/dist/cookie-opt-in/cookie-opt-in.js"></script>
```

For frameworks, check the [Stencil documentation](https://stenciljs.com/docs/distribution#using-your-component-in-a-framework).

Next step you have to think about which categories you want (see Custom Configuration)

The script comes pre-configured with four categories
- Necessary(`id`: `checkbox-necessary`): Cookies that are necessary to make the website functional.
- Statistics(`id`: `checkbox-statistics`): There is a debate about whether analytics cookies are functional or need to be consentend explicitely, but here it's separate category.
- Chat Support(`id`: `checkbox-chat`): Maybe you want to offer a chat widget to grant quick chat-access to you.
- Marketing(`id`: `marketing`): If you have any other marketing cookies e.g. ad-sense you might want to add a separate category.

In order to now prevent existing scripts from immediately firing when someone comes onto your page, you need to add a category to them and set them to `type="text/plain". 

Example: I want that Google analytics is only downloaded and executed when the user has consented to the Statistics category.

First, I need to prevent the download:
```
 <script src="https://www.googletagmanager.com/gtag/js?id=UA-109990725-X"></script>
```
becomes
```
<script class="checkbox-statistics-script-link" type="text/plain"
    src="https://www.googletagmanager.com/gtag/js?id=UA-109990725-X"></script>
```
So to put it into the `checkbox-statistics` category (see the id you defined for the category in the settings) being an external link I also append `-script-link`.

When you want to prevent direct JS-execution, just put `class="categoryId" type="text/plain` in the script tag.   
```
  <script class="checkbox-statistics" type="text/plain">
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


Then, you can add the new web-component somewhere on your page:
```
    <cookie-opt-in></cookie-opt-in>
```

## Reopen Cookie-Dialog
If you want to see the cookie dialog again or hide it, call the `toggleCookeieOptInModal()` method on the component.
Outside a framework (e.g. in your index.html) you can do this:
```
document.querySelector('cookie-opt-in').toggleCookeieOptInModal();
e.g.

 <button onclick="document.querySelector('cookie-opt-in').toggleCookeieOptInModal();">Show Cookie Consent</button>
```


## Custom Configuration
See `example.html` for a full working example.

In almost all cases you will need a custom configuration for your own categories and the cookies that need to be deleted when the category is un-ticked again. 
Also you will probably customize the categories to your business.
I will be happy to help you with it, just let me know.

Here is the full configuration:
```
    var cookieCompleteSettings = {
      "heading": "Cookie Consent",
      "notice": "We use cookies so that we can offer you the best possible website experience. This includes cookies which are necessary for the operation of the website, as well as other cookies which are used solely for anonymous statistical purposes, for our support chat or for marketing purposes. You are free to decide which categories you would like to permit. Please note that depending on the settings you choose, the full functionality of the website may no longer be available. Further information can be found in our <a href=\"/data-protection\">Privacy Policy</a>.",
      "buttonAll": "Select All",
      "buttonConfirm": "Confirm Selection",
      "imprintLink": "#",
      "hideDetails": "Hide Details",
      "showDetails": "Show Details",
      "details": [
        {
          "heading": "Necessary",
          "text": "These cookies are necessary to run the core functionalities of this website, e.g. security related functions or your cookie-consent preferences."
        },
        {
          "heading": "Statistics",
          "text": "In order to improve our website and provide the best possible service in the future, we anonymously track data for statistical and analytical purposes. With these cookies we can, for example, track the number of visits or the impact of specific pages of our web presence and therefore optimize our content."
        },
        {
          "heading": "Chat Support",
          "text": "On order to be able to offer a chat box for you where you can reach our support directly, we need to set cookies."
        },
        {
          "heading": "Marketing",
          "text": "These cookies are used to display personalized content matching your interests."
        }
      ],
      "checkboxes": [
        {
          "necessary": true,
          "id": "checkbox-necessary",
          "label": "Necessary",
          "cookies": []
        },
        {
          "necessary": false,
          "id": "checkbox-statistics",
          "label": "Statistics",
          "cookies": [
            "_g"
          ]
        },
        {
          "necessary": false,
          "id": "checkbox-chat",
          "label": "Chat Support",
          "cookies": []
        },
        {
          "necessary": false,
          "id": "checkbox-marketing",
          "label": "Marketing",
          "cookies": []
        }
      ]
    };
```
Pay attention that only if you add in the "checkboxes" items the cookie-names or prefixes, the script can delete them when consent is revoked.
Also you will most likely need to overwrite the notice element because of the data-protection URL (you can add any HTML code in there).
This will all be improved in the future.

You don't need to overwrite the full configuraton but can also only overwrite some parts (see example below).
If you are using a framework, just pass it as a parameter to the component:
```
    <cookie-opt-in></cookie-opt-in>

```

If you are embedding it into plain HTML, this works (you have to put it afte the tag):
```
    <cookie-opt-in></cookie-opt-in

 var overwriteConfig = {
      "heading": "Cookie Consent Example"
    };

    var cmp = document.querySelector('cookie-opt-in');
    cmp.config = overwriteConfig;
```

## Other Legal Requirements
- You need to add somewhere a link or button that people can change their choice
- You need to list somewhere the categories and which services / cookies you are using expicitely on a separate page (e.g. the data protection page).

## License
Currenty you can use this code all you want for non-commercial settings. If you want to use it for your company or shop, talk to me and we will find a good solution and I will support you setting it up and offer you an easy creator for the configuration.

## Next Steps
- Language switching option
- Better config
- making `-linked-script` tags unnecessary
- ...


## Technology
The project is written in [StencilJS](https://stenciljs.com/). 
The module code is in Angular-React (.jsx) and the styling in SCSS.
It uses apart from Stencil also the [JS-Cookie library](https://github.com/js-cookie/js-cookie). 
