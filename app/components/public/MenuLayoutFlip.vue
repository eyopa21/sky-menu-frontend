<script setup lang="ts">
import { PageFlip } from 'page-flip'
import type { Project } from '~/repositories/projects/response/projects'
import type { MenuItem } from '~/repositories/menu-items/response/menu-items'
import type { Category } from '~/repositories/categories/response/categories'

const props = defineProps<{
  project: Project
  categories: Category[]
  menuItemsByCategory: Record<number, MenuItem[]>
}>()

const emit = defineEmits<{
  (e: 'openItemDetail', item: MenuItem): void
}>()

// ── Page building ──────────────────────────────────────────────
interface Row {
  type: 'category' | 'item'
  category?: Category
  item?: MenuItem
}

const CAT_UNITS = 2.2
const ITEM_UNITS = 1
const ITEM_TALL_UNITS = 1.8
const PAGE_UNITS = 12

const pages = computed(() => {
  const allRows: Row[] = []

  props.categories?.forEach(cat => {
    const items = props.menuItemsByCategory[cat.id] || []
    if (items.length === 0) return
    allRows.push({ type: 'category', category: cat })
    items.forEach(item => allRows.push({ type: 'item', item }))
  })

  const result: Row[][] = []
  let current: Row[] = []
  let units = 0

  for (const row of allRows) {
    const u = row.type === 'category'
      ? CAT_UNITS
      : (row.item?.description && row.item.description.length > 60 ? ITEM_TALL_UNITS : ITEM_UNITS)

    if (units + u > PAGE_UNITS && current.length > 0) {
      result.push(current)
      current = []
      units = 0
    }
    current.push(row)
    units += u
  }
  if (current.length > 0) result.push(current)

  return result
})

const totalPages = computed(() => pages.value.length)

// ── Flipbook init ──────────────────────────────────────────────
const bookContainer = ref<HTMLElement | null>(null)
let flipbook: any = null
const currentPage = ref(0)

const updatePage = () => {
  if (flipbook) currentPage.value = flipbook.getCurrentPageIndex()
}

onMounted(async () => {
  if (!import.meta.client || !bookContainer.value) return
  await nextTick()

  const pageW = Math.floor(window.innerWidth / 2)
  const pageH = Math.floor(window.innerHeight)

  flipbook = new PageFlip(bookContainer.value, {
    width: pageW,
    height: pageH,
    size: 'fixed',
    maxShadowOpacity: 0.4,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: false,
    startPage: 0,
    flippingTime: 800,
    drawShadow: true,
    useMouseEvents: true,
  })

  flipbook.loadFromHTML(document.querySelectorAll('.fp-page'))
  flipbook.on('flip', updatePage)
})

onUnmounted(() => {
  if (flipbook) flipbook.destroy()
})

const flipNext = () => { flipbook?.flipNext(); updatePage() }
const flipPrev = () => { flipbook?.flipPrev(); updatePage() }

const formatPrice = (price: any) => {
  const n = Number(price)
  return isNaN(n) ? price : n.toFixed(2)
}
</script>

<template>
  <!-- Fullscreen host -->
  <div class="fs-host">

    <!-- Left nav arrow -->
    <button class="nav-arrow nav-arrow--left" aria-label="Previous page" @click="flipPrev">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>

    <!-- PageFlip mount point -->
    <div ref="bookContainer" class="flipbook-wrap">

      <!-- ══ COVER PAGE ══ -->
      <div class="fp-page fp-cover" data-density="hard">
        <div class="cover-inner">
          <div class="cover-brand">
            <div v-if="project.logo" class="cover-logo">
              <img :src="project.logo" alt="logo" class="cover-logo-img" />
            </div>
            <h1 class="cover-title">{{ project.title }}</h1>
            <div class="cover-rule" />
            <p class="cover-tagline">Menu</p>
          </div>
          <div class="cover-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cover-hint-icon"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <span>Flip to browse</span>
          </div>
        </div>
      </div>

      <!-- ══ CONTENT PAGES ══ -->
      <div
        v-for="(page, pageIdx) in pages"
        :key="pageIdx"
        class="fp-page fp-content"
      >
        <div class="page-body">
          <div v-for="(row, rowIdx) in page" :key="rowIdx">

            <!-- Category header bar -->
            <div v-if="row.type === 'category'" class="cat-header">
              <span class="cat-name">{{ row.category!.name }}</span>
            </div>

            <!-- Menu item row -->
            <div
              v-else
              class="menu-item"
              @click="emit('openItemDetail', row.item!)"
            >
              <div class="menu-item__title-row">
                <span class="menu-item__name">{{ row.item!.name }}</span>
                <span class="menu-item__dots" />
                <span class="menu-item__currency">{{ project.currency }}</span>
                <span class="menu-item__price">{{ formatPrice(row.item!.price) }}</span>
              </div>
              <p v-if="row.item!.description" class="menu-item__desc">
                {{ row.item!.description }}
              </p>
              <span v-if="!row.item!.isAvailable" class="menu-item__soldout">Sold Out</span>
            </div>

          </div>
        </div>

        <!-- Per-page footer -->
        <footer class="page-footer">
          <p class="page-footer__note">
            All prices are inclusive of applicable taxes and subject to product availability.
          </p>
          <div class="page-footer__icons">
            <span v-for="n in 10" :key="n" class="page-footer__icon" />
          </div>
          <div class="page-footer__meta">
            <span class="page-footer__restaurant">{{ project.title }}</span>
            <template v-if="project.address">
              <span class="page-footer__sep">·</span>
              <span class="page-footer__detail">{{ project.address }}</span>
            </template>
            <template v-if="project.phone">
              <span class="page-footer__sep">·</span>
              <span class="page-footer__detail">{{ project.phone }}</span>
            </template>
            <span class="page-footer__pagenum">{{ pageIdx + 1 }} / {{ totalPages }}</span>
          </div>
        </footer>
      </div>

      <!-- ══ BACK COVER ══ -->
      <div class="fp-page fp-cover fp-cover--back" data-density="hard">
        <div class="cover-inner">
          <div class="cover-brand">
            <div v-if="project.logo" class="cover-logo">
              <img :src="project.logo" alt="logo" class="cover-logo-img cover-logo-img--dim" />
            </div>
            <h2 class="cover-title cover-title--sm">Thank You</h2>
            <div class="cover-rule" />
            <p class="cover-tagline--sm">{{ project.title }}</p>
            <p v-if="project.address" class="cover-address">{{ project.address }}</p>
            <p v-if="project.phone" class="cover-address">{{ project.phone }}</p>
          </div>
        </div>
      </div>

    </div><!-- /flipbook-wrap -->

    <!-- Right nav arrow -->
    <button class="nav-arrow nav-arrow--right" aria-label="Next page" @click="flipNext">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

  </div>
</template>

<style scoped>
/* ── Fullscreen host ───────────────────────────────────────── */
.fs-host {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #2e2a24;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 0;
}

/* ── Flipbook wrapper ──────────────────────────────────────── */
.flipbook-wrap {
  position: relative;
}

/* ── Navigation arrows ─────────────────────────────────────── */
.nav-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: background 0.2s, color 0.2s;
}
.nav-arrow:hover {
  background: rgba(200,169,110,0.2);
  color: #c8a96e;
}
.nav-arrow svg { width: 20px; height: 20px; }
.nav-arrow--left  { left: 10px; }
.nav-arrow--right { right: 10px; }

/* ── Shared page shell ─────────────────────────────────────── */
.fp-page {
  background: #faf8f3;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Paper texture */
.fp-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
}

/* Binding shadow */
.fp-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.05) 0%,
    rgba(0,0,0,0) 6%,
    rgba(0,0,0,0) 94%,
    rgba(0,0,0,0.05) 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* ── Cover page ────────────────────────────────────────────── */
.fp-cover {
  background: #1a1814 !important;
}
.fp-cover::before { opacity: 0.04; }

.cover-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  gap: 20px;
}

.cover-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.cover-logo {
  width: 88px;
  height: 88px;
  border-radius: 18px;
  overflow: hidden;
  border: 2px solid rgba(200,169,110,0.2);
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
}
.cover-logo-img       { width: 100%; height: 100%; object-fit: cover; }
.cover-logo-img--dim  { filter: grayscale(70%) opacity(0.45); }

.cover-title {
  font-family: 'Georgia', serif;
  font-size: clamp(26px, 3.8vw, 50px);
  font-weight: 700;
  color: #f0e8d8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  line-height: 1.1;
}
.cover-title--sm { font-size: clamp(18px, 2.4vw, 30px); }

.cover-rule {
  width: 44px;
  height: 2px;
  background: #c8a96e;
  border-radius: 2px;
}

.cover-tagline {
  font-family: 'Arial', sans-serif;
  font-size: 10px;
  letter-spacing: 0.38em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  margin: 0;
}
.cover-tagline--sm {
  font-family: 'Arial', sans-serif;
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}
.cover-address {
  font-size: 11.5px;
  color: rgba(255,255,255,0.28);
  margin: 0;
  font-family: 'Georgia', serif;
}

.cover-hint {
  position: absolute;
  bottom: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(200,169,110,0.3);
  font-size: 9px;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  animation: hint-pulse 2.6s ease-in-out infinite;
}
.cover-hint-icon { width: 14px; height: 14px; }

@keyframes hint-pulse {
  0%, 100% { opacity: 0.35; transform: translateX(0); }
  50%       { opacity: 0.75; transform: translateX(5px); }
}

/* ── Content page ──────────────────────────────────────────── */
.fp-content {
  display: flex;
  flex-direction: column;
}

.page-body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 36px 44px 12px;
  overflow: hidden;
}

/* ── Category header bar ───────────────────────────────────── */
.cat-header {
  background: #1e1b16;
  border-left: 4px solid #c8a96e;
  padding: 10px 16px;
  margin-top: 22px;
  margin-bottom: 0;
}
.cat-header:first-child { margin-top: 0; }

.cat-name {
  font-family: 'Arial Black', 'Arial', sans-serif;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ffffff;
}

/* ── Menu item ─────────────────────────────────────────────── */
.menu-item {
  padding: 10px 4px 9px;
  border-bottom: 1px solid #e8e4da;
  cursor: pointer;
  transition: background 0.12s;
}
.menu-item:hover { background: rgba(200,169,110,0.05); }

.menu-item__title-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.menu-item__name {
  font-family: 'Georgia', serif;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  color: #1a1a1a;
}

.menu-item__dots {
  flex: 1;
  border-bottom: 1.5px dotted #b8ae9e;
  position: relative;
  top: -3px;
  margin: 0 6px;
  min-width: 20px;
}

.menu-item__currency {
  font-family: 'Arial', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #7a7060;
  white-space: nowrap;
  flex-shrink: 0;
}

.menu-item__price {
  font-family: 'Arial', sans-serif;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 50px;
  text-align: right;
  color: #1a1a1a;
}

.menu-item__desc {
  font-family: 'Georgia', serif;
  font-size: 10.5px;
  color: #6b6154;
  font-style: italic;
  margin: 3px 0 0;
  line-height: 1.5;
}

.menu-item__soldout {
  display: inline-block;
  margin-top: 4px;
  font-size: 8px;
  font-weight: 900;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: #b91c1c;
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
}

/* ── Per-page footer ───────────────────────────────────────── */
.page-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid #d4ccbe;
  padding: 8px 44px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.page-footer__note {
  font-family: 'Georgia', serif;
  font-size: 9px;
  color: #7a7060;
  font-style: italic;
  margin: 0;
  line-height: 1.5;
}

.page-footer__icons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.page-footer__icon {
  width: 19px;
  height: 19px;
  border-radius: 50%;
  border: 1px solid #c8bba8;
  background: linear-gradient(135deg, #ebe6dc 0%, #d6cfc2 100%);
  display: inline-block;
  opacity: 0.55;
  flex-shrink: 0;
}

.page-footer__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.page-footer__restaurant {
  font-family: 'Arial', sans-serif;
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #2b2520;
  white-space: nowrap;
}

.page-footer__sep {
  font-size: 9.5px;
  color: #b8ae9e;
}

.page-footer__detail {
  font-family: 'Georgia', serif;
  font-size: 9.5px;
  color: #7a7060;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.page-footer__pagenum {
  margin-left: auto;
  font-family: 'Arial', sans-serif;
  font-size: 9.5px;
  font-weight: 700;
  color: #b8ae9e;
  white-space: nowrap;
  letter-spacing: 0.05em;
}
</style>
