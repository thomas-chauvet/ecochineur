export const VINTED_HOSTNAMES: ReadonlySet<string> = new Set([
  // Western & Central Europe
  'www.vinted.at',
  'www.vinted.be',
  'www.vinted.fr',
  'www.vinted.de',
  'www.vinted.lu',
  'www.vinted.nl',
  // Southern Europe
  'www.vinted.gr',
  'www.vinted.it',
  'www.vinted.pt',
  'www.vinted.es',
  // Northern & Baltic Europe
  'www.vinted.dk',
  'www.vinted.ee',
  'www.vinted.fi',
  'www.vinted.lv',
  'www.vinted.lt',
  'www.vinted.se',
  // Eastern Europe
  'www.vinted.hr',
  'www.vinted.cz',
  'www.vinted.hu',
  'www.vinted.pl',
  'www.vinted.ro',
  'www.vinted.sk',
  'www.vinted.si',
  // English-speaking & non-EU
  'www.vinted.ie',
  'www.vinted.co.uk',
  'www.vinted.com',
]);

/** True for `/catalog` and `/catalog/<category>` pages on a Vinted domain. */
export function isVintedCatalogUrl(url: string | undefined): url is string {
  if (!url || !URL.canParse(url)) {
    return false;
  }

  const { protocol, hostname, pathname } = new URL(url);

  return (
    protocol === 'https:' &&
    VINTED_HOSTNAMES.has(hostname) &&
    (pathname === '/catalog' || pathname.startsWith('/catalog/'))
  );
}
