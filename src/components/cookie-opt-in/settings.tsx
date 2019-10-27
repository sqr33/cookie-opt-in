
export class CookieOptInSettings {
    heading: string = 'Cookie Consent';

    notice: string = `We use cookies so that we can offer you the best possible website experience. This includes cookies which are necessary for the operation of the website, as well as other cookies which are used solely for anonymous statistical purposes, for our support chat or for marketing purposes. You are free to decide which categories you would like to permit. Please note that depending on the settings you choose, the full functionality of the website may no longer be available. Further information can be found in our <a href="/data-protection">Privacy Policy</a>.`

    buttonAll: string = 'Select All'
    buttonConfirm: string = 'Confirm Selection'

    imprintLink: string = '#'

    hideDetails: string = 'Hide Details'
    showDetails: string = 'Show Details'

    details: Array<Details> = [
        new Details(
            'Necessary',
            `These cookies are necessary to run the core functionalities of this website, e.g. security related functions or your cookie-consent preferences.`
        ),
        new Details(
            'Statistics',
            `In order to improve our website and provide the best possible service in the future, we anonymously track data for statistical and analytical purposes. With these cookies we can, for example, track the number of visits or the impact of specific pages of our web presence and therefore optimize our content.`
        ),
        new Details(
            'Chat Support',
            `On order to be able to offer a chat box for you where you can reach our support directly, we need to set cookies.`
        ),
        new Details(
            'Marketing',
            `These cookies are used to display personalized content matching your interests.`
        ),
    ]
    checkboxes: Array<Checkbox> = [
        new Checkbox('checkbox-necessary', 'Necessary', [], true),
        new Checkbox('checkbox-statistics', 'Statistics', ['_g']),
        new Checkbox('checkbox-chat', 'Chat Support'),
        new Checkbox('checkbox-marketing', 'Marketing'),
    ]
}

export class Details {
    heading: string;
    text: string;
    constructor(heading: string, text: string) {
        this.heading = heading;
        this.text = text.replace(/\s+/g, " ");
    }
}

export class Checkbox {
    id: string;
    label: string;
    cookies: Array<string>;
    necessary: boolean = false;
    constructor(id: string, label: string, cookies: Array<string> = [], necessary: boolean = false) {
        this.id = id;
        this.label = label;
        this.cookies = cookies;
        this.necessary = necessary;
    }
}
