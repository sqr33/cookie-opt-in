export interface CookieNoticeSetting {
    language: string;
    heading: string;
    notice: string;
    buttonAll: string;
    buttonConfirm: string;
    imprintText: string;
    imprintLink: string;
    hideDetails: string;
    showDetails: string;
    categories: Array<Category>;
    styles: StyleConfig;
}

export class EnglishCookieSettings implements CookieNoticeSetting {
    language = 'EN'
    heading = 'Cookie Consent'

    notice = `We use cookies so that we can offer you the best possible website experience. This includes cookies which are necessary for the operation of the website, as well as other cookies which are used solely for anonymous statistical purposes, for our support chat or for marketing purposes. You are free to decide which categories you would like to permit. Please note that depending on the settings you choose, the full functionality of the website may no longer be available. Further information can be found in our <a href="/data-protection">Privacy Policy</a>.`

    buttonAll = 'Select All'
    buttonConfirm = 'Confirm Selection'

    imprintText = 'Imprint'
    imprintLink = '#'

    hideDetails = 'Hide Details'
    showDetails = 'Show Details'

    categories: Array<Category> = [
        new Category(
            'category-necessary',
            'Necessary',
            'These cookies are technically required for our core website to work properly, e.g. security functions or your cookie consent preferences.',
            [],
            true),
        new Category(
            'category-statistics',
            'Statistics',
            'In order to improve our website going forward, we anonymously collect data for statistical and analytical purposes. With these cookies we can, for instance, monitor the number or duration of visits of specific pages of our website helping us in optimising user experience.',
            ['_g']),
        new Category(
            'category-chat',
            'Chat Support',
            'We want to make it as easy as possible for you to reach our support teams, e.g. via our chat box, which requires certain cookies.'),
        new Category(
            'category-marketing',
            'Marketing',
            'These cookies help us in measuring and optimising our marketing efforts.'),
    ];
    styles = new StyleConfig({});
}

export class GermanCookieSettings implements CookieNoticeSetting {
    language = "DE";
    heading = 'Cookie-Einstellungen';

    notice = `Wir verwenden Cookies, um Ihnen die bestmögliche Webseite anzubieten. Das bedeutet, dass wir Cookies nutzen, um die Seite funktionsfähig zu machen, als auch Cookies, die für eine anonyme statistische Erfassung, unseren Chat-Support und für Marketingzwecke notwendig sind. Ihnen steht es frei, zu entscheiden, welche Kategorien Sie zulassen möchten. Bitte seien Sie Sich bewusst, dass abhängig von Ihrer Auswahl eventuell nicth die volle Webseitenfunktionalität zur Verfügung steht. Weitere Informationen finden Sie in unserer <a target="_blank" href="/datenschutz">Datenschutzerlärung</a>.`

    buttonAll = 'Alle auswählen'
    buttonConfirm = 'Auswahl bestätigen'

    imprintText = "Impressum"
    imprintLink = '#'

    hideDetails = 'Details ausblenden'
    showDetails = 'Details anzeigen'

    categories: Array<Category> = [
        new Category(
            'category-necessary',
            'Notwendig',
            'Diese Cookies sind unbedingt für die Funktionalität der Seite notwendig z.B. Anmeldeinformationen, Sicherheit oder Ihre Cookie-Einstellugen',
            [],
            true),
        new Category(
            'category-statistics',
            'Anonyme Statistiken',
            'Um unsere Webseite besser verstehen zu können und sie in Zukunft für Sie zu verbessern, erheben wir In order to improve our website going forward, we anonymously collect data for statistical and analytical purposes. With these cookies we can, for instance, monitor the number or duration of visits of specific pages of our website helping us in optimising user experience.',
            ['_g']),
        new Category(
            'category-chat',
            'Chat Unterstützung',
            'Wir möchten es Ihnen So einfach wie möglich mit uns Kontakt aufzunehmen und Unterstützung zu bekommen. Zum Beispiel über unsere Chatbox, die Cookies voraussetzt.'),
        new Category(
            'category-marketing',
            'Marketing',
            'Diese Cookies helfen uns dabei, unser Marketing zu messen und zu verbessern.'),
    ];
    styles = new StyleConfig({});

}

export class Category {
    id: string;
    label: string;
    description: string;
    cookies: Array<string>;
    necessary: boolean = false;
    constructor(id: string,
        label: string,
        description: string,
        cookies: Array<string> = [],
        necessary: boolean = false
    ) {
        this.id = id;
        this.label = label;
        this.description = description.replace(/\s+/g, " ");
        this.cookies = cookies;
        this.necessary = necessary;
    }
}

export class StyleConfig {
    confirmAllButton: any;
    constructor(confirmAllButton: any) {
        this.confirmAllButton = confirmAllButton;
    }
}
