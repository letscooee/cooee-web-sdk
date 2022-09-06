/**
 * Constants used across the SDK.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class Constants {

    static API_URL: string = 'https://api.sdk.letscooee.com';
    static readonly SDK_VERSION: string = require('../package.json').version;
    static SDK_VERSION_CODE: number;
    static SDK_DEBUG: boolean = false;

    static SDK: string = 'WEB';
    static LOG_PREFIX: string = 'CooeeSDK';

    static CANVAS_WIDTH = 1080;
    static CANVAS_HEIGHT = 1920;

    // region Local Storage Keys
    // Do not change the local storage id as this is also being used in Shopify
    static STORAGE_APP_ID: string = 'cooaid';
    static STORAGE_USER_ID: string = 'uid';
    static STORAGE_SDK_TOKEN: string = 'st';
    static STORAGE_DEVICE_UUID: string = 'uuid';
    static STORAGE_SESSION_ID: string = 'sid';
    static STORAGE_SESSION_NUMBER: string = 'sn';
    static STORAGE_SESSION_START_TIME: string = 'sst';
    static STORAGE_SESSION_START_EVENT_SENT: string = 'sses';
    static STORAGE_FIRST_TIME_LAUNCH: string = 'ifl';
    static STORAGE_LAST_ACTIVE: string = 'la';
    static STORAGE_TRIGGER_START_TIME: string = 'tst';
    static STORAGE_ACTIVE_TRIGGER: string = 'at';
    static STORAGE_ACTIVE_TRIGGERS: string = 'ats';
    static STORAGE_SHOPIFY_PAST_ORDERS_DATA_SENT: string = 'spods';
    // endregion

    static IDLE_TIME_IN_SECONDS: number = 30 * 60;

    static IN_APP_CONTAINER_NAME: string = 'cooee-wrapper';

    static {
        const rawCode = Constants.SDK_VERSION.split('.').map((item) => item.padStart(2, '0')).join('');
        Constants.SDK_VERSION_CODE = parseInt(rawCode, 10);
    }

    // region
    static readonly EVENT_SCREEN_VIEW: string = 'CE Screen View';
    static readonly EVENT_APP_INSTALLED: string = 'CE App Installed';
    static readonly EVENT_APP_LAUNCHED: string = 'CE App Launched';
    static readonly EVENT_SESSION_CONCLUDED: string = 'CE Session Concluded';
    static readonly EVENT_APP_FOREGROUND: string = 'CE App Foreground';
    static readonly EVENT_APP_BACKGROUND: string = 'CE App Background';
    static readonly EVENT_TRIGGER_DISPLAYED: string = 'CE Trigger Displayed';
    static readonly EVENT_TRIGGER_CLOSED: string = 'CE Trigger Closed';
    // endregion

    private static BOT_USER_AGENTS_PATTERN: string = '(' +
        'googlebot\/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|' +
        'java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|' +
        'FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|' +
        'ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|' +
        'netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|' +
        'tagoobot|MJ12bot|dotbot|' +
        'woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|' +
        'citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|' +
        'ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|' +
        'ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|' +
        'aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|' +
        'wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|' +
        'gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|' +
        'toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|' +
        'changedetection|' +
        'blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|' +
        'Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|' +
        'binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|' +
        'Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|' +
        'archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|' +
        'Domain Re-Animator Bot|AddThis' +
        ')';

    static BOT_UA_REGEX = new RegExp(this.BOT_USER_AGENTS_PATTERN, 'i');

}
