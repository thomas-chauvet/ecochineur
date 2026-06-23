import brandsDatabase from '../data/brands.json';
import materialsDatabase from '../data/material-ids.json';
import {
  countByCategory,
  getMatchingBrandIds,
  getMatchingBrands,
} from '../lib/brand-filter';
import { createTranslator, resolveLanguage } from '../lib/i18n';
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
} from '../lib/storage';
import { VINTED_HOSTNAMES } from '../lib/vinted-domains';
import { mergeFilters, resetFilters } from '../lib/url-merge';
import type {
  Brand,
  BrandCategory,
  NaturalMaterial,
  UISelection,
  UserPreferences,
} from '../types';

import './popup.css';

const SUGGEST_FORM_URL = 'https://docs.google.com/forms/d/e/TODO/viewform';

const CATEGORIES: Array<{
  id: UISelection;
  icon: string;
  labelKey:
    | 'category_france'
    | 'category_europe'
    | 'category_mixed'
    | 'category_eco';
  tooltipKey:
    | 'tooltip_france'
    | 'tooltip_europe'
    | 'tooltip_mixed'
    | 'tooltip_eco';
}> = [
  {
    id: 'france',
    icon: '🇫🇷',
    labelKey: 'category_france',
    tooltipKey: 'tooltip_france',
  },
  {
    id: 'europe',
    icon: '🇪🇺',
    labelKey: 'category_europe',
    tooltipKey: 'tooltip_europe',
  },
  {
    id: 'mixed',
    icon: '🌍',
    labelKey: 'category_mixed',
    tooltipKey: 'tooltip_mixed',
  },
  {
    id: 'eco',
    icon: '♻️',
    labelKey: 'category_eco',
    tooltipKey: 'tooltip_eco',
  },
];

const brands = brandsDatabase.brands as Brand[];
const materials = materialsDatabase.natural_materials as NaturalMaterial[];
const counts = countByCategory(brands);

let preferences: UserPreferences = { ...DEFAULT_PREFERENCES };
let language = resolveLanguage(navigator.language);
let t = createTranslator(language);
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
const suggestButton = byId<HTMLButtonElement>('suggest-button');

void init();

async function init(): Promise<void> {
  preferences = await loadPreferences();
  language = resolveLanguage(preferences.language ?? navigator.language);
  t = createTranslator(language);
  languageSelect.value = language;

  languageSelect.addEventListener('change', () => {
    language = resolveLanguage(languageSelect.value);
    t = createTranslator(language);
    preferences.language = language;
    void persist();
    render();
  });

  applyButton.addEventListener('click', () => void applyFilters());
  resetButton.addEventListener('click', () => void resetVintedFilters());
  suggestButton.addEventListener(
    'click',
    () => void chrome.tabs.create({ url: SUGGEST_FORM_URL }),
  );
  toggleBrandsButton.addEventListener('click', () => {
    brandsVisible = !brandsVisible;
    renderBrandBrowser();
  });
  brandSearch.addEventListener('input', renderBrandList);

  render();
}

function render(): void {
  document.documentElement.lang = language;
  renderStaticLabels();
  renderCategoryOptions();
  renderMaterialOptions();
  renderBrandBrowser();
  updateApplyButton();
}

function renderStaticLabels(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (key) {
      element.textContent = t(key as Parameters<typeof t>[0]);
    }
  });

  brandSearch.placeholder = t('brand_search_placeholder');
  languageSelect.setAttribute('aria-label', t('language_label'));
  applyButton.textContent = t('apply_filters');
  resetButton.textContent = t('reset_filters');
}

function renderCategoryOptions(): void {
  categoryOptions.replaceChildren(
    ...CATEGORIES.map((category) => {
      const checked = preferences.selectedCategories.includes(category.id);
      const row = document.createElement('label');
      row.className = 'check-row';
      row.innerHTML = `
        <input type="checkbox" value="${category.id}" ${checked ? 'checked' : ''} />
        <span class="label">${category.icon} ${t(category.labelKey)}</span>
        <span class="counter">(${counts[category.id]})</span>
        <span class="info" title="${t(category.tooltipKey)}">i</span>
      `;
      row.querySelector('input')?.addEventListener('change', (event) => {
        const input = event.currentTarget as HTMLInputElement;
        updateSelectedCategories(category.id, input.checked);
      });

      return row;
    }),
  );
}

function renderMaterialOptions(): void {
  materialOptions.replaceChildren(
    ...materials.map((material) => {
      const checked = preferences.selectedMaterialIds.includes(
        material.vinted_id,
      );
      const row = document.createElement('label');
      row.className = 'check-row';
      row.innerHTML = `
        <input type="checkbox" value="${material.vinted_id}" ${checked ? 'checked' : ''} />
        <span class="label">${materialName(material)}</span>
      `;
      row.querySelector('input')?.addEventListener('change', (event) => {
        const input = event.currentTarget as HTMLInputElement;
        updateSelectedMaterials(Number(input.value), input.checked);
      });

      return row;
    }),
  );
}

function renderBrandBrowser(): void {
  toggleBrandsButton.textContent = brandsVisible
    ? t('hide_brands')
    : t('show_brands');
  brandBrowser.classList.toggle('hidden', !brandsVisible);
  renderBrandList();
}

function renderBrandList(): void {
  if (!brandsVisible) {
    return;
  }

  const selected = preferences.selectedCategories;
  const sourceBrands =
    selected.length > 0 ? getMatchingBrands(brands, selected) : brands;
  const search = brandSearch.value.trim().toLowerCase();
  const visibleBrands = sourceBrands.filter((brand) =>
    brand.name.toLowerCase().includes(search),
  );

  if (visibleBrands.length === 0) {
    const item = document.createElement('li');
    item.className = 'brand-card';
    item.textContent = t('no_matching_brands');
    brandList.replaceChildren(item);
    return;
  }

  brandList.replaceChildren(
    ...visibleBrands.map((brand) => {
      const item = document.createElement('li');
      item.className = 'brand-card';
      const description =
        language === 'en' ? brand.description_en : brand.description_fr;
      const badges = [
        `<span class="badge">${categoryLabel(brand.category)}</span>`,
        brand.eco ? `<span class="badge">${t('eco_badge')}</span>` : '',
      ].join('');

      item.innerHTML = `
        <div class="brand-card-header">
          <span class="brand-name">${brand.name}</span>
          <span class="badges">${badges}</span>
        </div>
        <p class="brand-description">${description}</p>
      `;

      return item;
    }),
  );
}

async function applyFilters(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab.id || !isVintedCatalogUrl(tab.url)) {
    showMessage(t('error_not_on_catalog'));
    return;
  }

  const brandIds = getMatchingBrandIds(brands, preferences.selectedCategories);
  const materialIds = preferences.selectedMaterialIds.filter((id) => id > 0);

  if (preferences.selectedCategories.length === 0 && materialIds.length === 0) {
    showMessage(t('error_no_selection'));
    return;
  }

  if (brandIds.length === 0 && materialIds.length === 0) {
    showMessage(t('error_no_valid_ids'));
    return;
  }

  const newUrl = mergeFilters({
    currentUrl: tab.url,
    brandIdsToAdd: brandIds,
    materialIdsToAdd: materialIds,
  });

  await chrome.tabs.update(tab.id, { url: newUrl });
  window.close();
}

async function resetVintedFilters(): Promise<void> {
  const tab = await getActiveTab();
  if (!tab.id || !isVintedCatalogUrl(tab.url)) {
    showMessage(t('error_not_on_catalog'));
    return;
  }

  if (!window.confirm(t('reset_confirm'))) {
    return;
  }

  await chrome.tabs.update(tab.id, { url: resetFilters(tab.url) });
  showMessage(t('filters_reset'));
}

function updateSelectedCategories(
  category: UISelection,
  checked: boolean,
): void {
  preferences.selectedCategories = checked
    ? [...new Set([...preferences.selectedCategories, category])]
    : preferences.selectedCategories.filter((value) => value !== category);

  void persist();
  updateApplyButton();
  renderBrandList();
}

function updateSelectedMaterials(materialId: number, checked: boolean): void {
  preferences.selectedMaterialIds = checked
    ? [...new Set([...preferences.selectedMaterialIds, materialId])]
    : preferences.selectedMaterialIds.filter((value) => value !== materialId);

  void persist();
  updateApplyButton();
}

function updateApplyButton(): void {
  applyButton.disabled =
    preferences.selectedCategories.length === 0 &&
    preferences.selectedMaterialIds.length === 0;
}

async function persist(): Promise<void> {
  await savePreferences(preferences);
}

async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function isVintedCatalogUrl(url: string | undefined): url is string {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return (
      VINTED_HOSTNAMES.has(parsed.hostname) &&
      parsed.pathname.startsWith('/catalog')
    );
  } catch {
    return false;
  }
}

function materialName(material: NaturalMaterial): string {
  return language === 'en' ? material.name_en : material.name_fr;
}

function categoryLabel(category: BrandCategory): string {
  const keyByCategory: Record<BrandCategory, Parameters<typeof t>[0]> = {
    france: 'category_france',
    europe: 'category_europe',
    mixed: 'category_mixed',
    eco: 'category_eco',
  };

  return t(keyByCategory[category]);
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
