import { brands, materials } from '../data';
import {
  countByCategory,
  getMatchingBrandIds,
  getMatchingBrands,
} from '../lib/brand-filter';
import {
  createTranslator,
  resolveLanguage,
  type MessageKey,
  type Translator,
} from '../lib/i18n';
import { loadPreferences, savePreferences } from '../lib/storage';
import { mergeFilters, resetFilters } from '../lib/url-merge';
import { isVintedCatalogUrl } from '../lib/vinted-domains';
import {
  BRAND_CATEGORIES,
  type Brand,
  type BrandCategory,
  type Language,
  type UserPreferences,
} from '../types';

import './popup.css';

const CATEGORY_ICONS: Record<BrandCategory, string> = {
  france: '🇫🇷',
  'france-ofg': '🏅',
  europe: '🇪🇺',
  'france-europe': '🇫🇷🇪🇺',
  eco: '♻️',
};

const counts = countByCategory(brands);
const knownMaterialIds = new Set(
  materials.map((material) => material.vinted_id),
);

let preferences: UserPreferences;
let language: Language;
let t: Translator;
let brandsVisible = false;

const categoryOptions = byId('category-options');
const materialOptions = byId('material-options');
const applyButton = byId<HTMLButtonElement>('apply-button');
const resetButton = byId<HTMLButtonElement>('reset-button');
const languageSelect = byId<HTMLSelectElement>('language-select');
const toggleBrandsButton = byId<HTMLButtonElement>('toggle-brands');
const brandBrowser = byId('brand-browser');
const brandSearch = byId<HTMLInputElement>('brand-search');
const brandList = byId<HTMLUListElement>('brand-list');
const statusMessage = byId('status-message');

void init();

async function init(): Promise<void> {
  preferences = await loadPreferences();
  setLanguage(resolveLanguage(preferences.language ?? navigator.language));

  languageSelect.addEventListener('change', () => {
    setLanguage(resolveLanguage(languageSelect.value));
    updatePreferences({ language });
    render();
  });
  applyButton.addEventListener('click', () => void applyFilters());
  resetButton.addEventListener('click', () => void resetVintedFilters());
  toggleBrandsButton.addEventListener('click', () => {
    brandsVisible = !brandsVisible;
    renderBrandBrowser();
  });
  brandSearch.addEventListener('input', renderBrandList);

  render();
}

function setLanguage(next: Language): void {
  language = next;
  t = createTranslator(next);
  languageSelect.value = next;
  document.documentElement.lang = next;
}

function updatePreferences(patch: Partial<UserPreferences>): void {
  preferences = { ...preferences, ...patch };
  void savePreferences(preferences);
  applyButton.disabled =
    preferences.selectedCategories.length === 0 &&
    preferences.selectedMaterialIds.length === 0;
}

// Rendering

function render(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n as MessageKey);
  });
  brandSearch.placeholder = t('brand_search_placeholder');
  languageSelect.setAttribute('aria-label', t('language_label'));

  renderCategoryOptions();
  renderMaterialOptions();
  renderBrandBrowser();
  updatePreferences({});
}

function renderCategoryOptions(): void {
  categoryOptions.replaceChildren(
    ...BRAND_CATEGORIES.map((category) => {
      const checked = preferences.selectedCategories.includes(category);

      return checkRow({
        label: `${CATEGORY_ICONS[category]} ${t(`category_${category}`)}`,
        checked,
        // An empty category would only produce an error; keep it uncheckable
        // unless a stored preference already selected it.
        disabled: counts[category] === 0 && !checked,
        extra: [
          h('span', {
            className: 'counter',
            textContent: `(${counts[category]})`,
          }),
          h('span', {
            className: 'info',
            title: t(`tooltip_${category}`),
            textContent: 'i',
          }),
        ],
        onChange: (isChecked) => {
          updatePreferences({
            selectedCategories: toggle(
              preferences.selectedCategories,
              category,
              isChecked,
            ),
          });
          renderBrandList();
        },
      });
    }),
  );
}

function renderMaterialOptions(): void {
  materialOptions.replaceChildren(
    ...materials.map((material) =>
      checkRow({
        label: language === 'en' ? material.name_en : material.name_fr,
        checked: preferences.selectedMaterialIds.includes(material.vinted_id),
        onChange: (isChecked) =>
          updatePreferences({
            selectedMaterialIds: toggle(
              preferences.selectedMaterialIds,
              material.vinted_id,
              isChecked,
            ),
          }),
      }),
    ),
  );
}

function renderBrandBrowser(): void {
  toggleBrandsButton.textContent = t(
    brandsVisible ? 'hide_brands' : 'show_brands',
  );
  brandBrowser.hidden = !brandsVisible;
  renderBrandList();
}

function renderBrandList(): void {
  if (!brandsVisible) {
    return;
  }

  const selected = preferences.selectedCategories;
  const search = brandSearch.value.trim().toLowerCase();
  const visibleBrands = (
    selected.length > 0 ? getMatchingBrands(brands, selected) : brands
  ).filter((brand) => brand.name.toLowerCase().includes(search));

  brandList.replaceChildren(
    ...(visibleBrands.length > 0
      ? visibleBrands.map(brandCard)
      : [
          h('li', {
            className: 'brand-card',
            textContent: t('no_matching_brands'),
          }),
        ]),
  );
}

function brandCard(brand: Brand): HTMLLIElement {
  const badges = [t(`category_${brand.category}`)];
  if (brand.eco) {
    badges.push(t('eco_badge'));
  }

  return h('li', { className: 'brand-card' }, [
    h('div', { className: 'brand-card-header' }, [
      h('span', { className: 'brand-name', textContent: brand.name }),
      h(
        'span',
        { className: 'badges' },
        badges.map((badge) =>
          h('span', { className: 'badge', textContent: badge }),
        ),
      ),
    ]),
    h('p', {
      className: 'brand-description',
      textContent:
        language === 'en' ? brand.description_en : brand.description_fr,
    }),
  ]);
}

// Actions

async function applyFilters(): Promise<void> {
  const tab = await getCatalogTab();
  if (!tab) {
    showMessage(t('error_not_on_catalog'));
    return;
  }

  const brandIds = getMatchingBrandIds(brands, preferences.selectedCategories);
  // Ignore stored IDs of materials that were removed from the database.
  const materialIds = preferences.selectedMaterialIds.filter((id) =>
    knownMaterialIds.has(id),
  );

  if (brandIds.length === 0 && materialIds.length === 0) {
    showMessage(t('error_no_brands'));
    return;
  }

  await chrome.tabs.update(tab.id, {
    url: mergeFilters({
      currentUrl: tab.url,
      brandIdsToAdd: brandIds,
      materialIdsToAdd: materialIds,
    }),
  });
  window.close();
}

/** Unchecks every option and, on a catalog page, removes the URL filters. */
async function resetVintedFilters(): Promise<void> {
  if (!window.confirm(t('reset_confirm'))) {
    return;
  }

  updatePreferences({ selectedCategories: [], selectedMaterialIds: [] });
  renderCategoryOptions();
  renderMaterialOptions();
  renderBrandList();

  const tab = await getCatalogTab();
  if (tab) {
    await chrome.tabs.update(tab.id, { url: resetFilters(tab.url) });
  }
  showMessage(t('filters_reset'));
}

async function getCatalogTab(): Promise<{ id: number; url: string } | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return tab?.id !== undefined && isVintedCatalogUrl(tab.url)
    ? { id: tab.id, url: tab.url }
    : null;
}

// DOM helpers

function checkRow(options: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  extra?: Node[];
  onChange: (checked: boolean) => void;
}): HTMLLabelElement {
  const input = h('input', {
    type: 'checkbox',
    checked: options.checked,
    disabled: options.disabled ?? false,
  });
  input.addEventListener('change', () => options.onChange(input.checked));

  return h('label', { className: 'check-row' }, [
    input,
    h('span', { className: 'label', textContent: options.label }),
    ...(options.extra ?? []),
  ]);
}

/** Creates an element; text goes through `textContent`, never `innerHTML`. */
function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  children: Node[] = [],
): HTMLElementTagNameMap[K] {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
}

function toggle<T>(values: T[], value: T, checked: boolean): T[] {
  return checked
    ? [...new Set([...values, value])]
    : values.filter((item) => item !== value);
}

function showMessage(message: string): void {
  statusMessage.textContent = message;
}

function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing element #${id}`);
  }

  return element as T;
}
