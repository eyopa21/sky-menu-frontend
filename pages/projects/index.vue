<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'

definePageMeta({
  layout: 'dashboard',
})

const options = ref(['list', 'grid'])
const layout = ref('list')

const products = ref([
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
  },
  {
    id: '1001',
    code: 'nvklal433',
    name: 'Black Watch',
    description: 'Product Description',
    image: 'black-watch.jpg',
    price: 72,
    category: 'Accessories',
    quantity: 61,
    inventoryStatus: 'INSTOCK',
    rating: 4,
  },
  {
    id: '1002',
    code: 'zz21cz3c1',
    name: 'Blue Band',
    description: 'Product Description',
    image: 'blue-band.jpg',
    price: 79,
    category: 'Fitness',
    quantity: 2,
    inventoryStatus: 'LOWSTOCK',
    rating: 3,
  },
])

const { $api } = useNuxtApp()

const projectsRepo = projectsRepository($api)

const { data: projects, status, error } = await useAsyncData('users', () => projectsRepo.getMyProjects())

if (error.value) {
  console.log(error.value)
}
</script>

<template>
  <div>
    <div class="card">
      <div class="flex justify-between p-4 px-0">
        <div class="text-xl font-semibold">
          DataView
        </div>
        <DashboardProjectsNewProject />
      </div>
      {{ projects }}
      <DataView :value="products" :layout="layout">
        <template #header>
          <div class="flex justify-end">
            <SelectButton v-model="layout" :options="options" :allow-empty="false">
              <template #option="{ option }">
                <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-table']" />
              </template>
            </SelectButton>
          </div>
        </template>

        <template #list="slotProps">
          <div class="flex flex-col">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <div
                class="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
                :class="{ 'border-t border-surface': index !== 0 }"
              >
                <div class="relative md:w-40">
                  <img
                    class="mx-auto block w-full rounded xl:block"
                    :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`"
                    :alt="item.name"
                  >
                  <Tag
                    value="5 Items"
                    class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"
                  />
                </div>
                <div class="flex flex-1 flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div class="flex flex-row items-start justify-between gap-2 md:flex-col">
                    <div>
                      <span class="text-sm font-medium text-surface-500 dark:text-surface-400">{{
                        item.category }}</span>
                      <div class="mt-2 text-lg font-medium">
                        {{ item.name }}
                      </div>
                    </div>
                    <div class="bg-surface-100 p-1" style="border-radius: 30px">
                      <div
                        class="flex items-center justify-center gap-2 bg-surface-0 px-2 py-1"
                        style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                      >
                        <span class="text-sm font-medium text-surface-900">{{ item.rating
                        }}</span>
                        <i class="pi pi-star-fill text-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-8 md:items-end">
                    <span class="text-xl font-semibold">${{ item.price }}</span>
                    <div class="flex flex-row-reverse gap-2 md:flex-row">
                      <Button icon="pi pi-heart" outlined />
                      <Button
                        icon="pi pi-shopping-cart" label="Buy Now"
                        :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                        class="flex-auto whitespace-nowrap md:flex-initial"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #grid="slotProps">
          <div class="grid grid-cols-12 gap-4">
            <div
              v-for="(item, index) in slotProps.items" :key="index"
              class="col-span-12 p-2 sm:col-span-6 lg:col-span-4"
            >
              <div
                class="flex flex-col rounded border border-surface-200 bg-surface-0 p-6 dark:border-surface-700 dark:bg-surface-900"
              >
                <div class="flex justify-center rounded bg-surface-50 p-4">
                  <div class="relative mx-auto">
                    <img
                      class="w-full rounded"
                      :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`"
                      :alt="item.name" style="max-width: 300px"
                    >
                    <Tag
                      value="6 menus"
                      class="absolute dark:!bg-surface-900" style="left: 4px; top: 4px"
                    />
                  </div>
                </div>
                <div class="pt-6">
                  <div class="flex flex-row items-start justify-between gap-2">
                    <div>
                      <span class="text-sm font-medium text-surface-500 dark:text-surface-400">{{
                        item.category }}</span>
                      <div class="mt-1 text-lg font-medium">
                        {{ item.name }}
                      </div>
                    </div>
                    <div class="bg-surface-100 p-1" style="border-radius: 30px">
                      <div
                        class="flex items-center justify-center gap-2 bg-surface-0 px-2 py-1"
                        style="
                                                    border-radius: 30px;
                                                    box-shadow:
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.04),
                                                        0px 1px 2px 0px rgba(0, 0, 0, 0.06);
                                                "
                      >
                        <span class="text-sm font-medium text-surface-900">{{ item.rating
                        }}</span>
                        <i class="pi pi-star-fill text-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <div class="mt-6 flex flex-col gap-6">
                    <span class="text-2xl font-semibold">${{ item.price }}</span>
                    <div class="flex gap-2">
                      <Button
                        icon="pi pi-shopping-cart" label="Buy Now"
                        :disabled="item.inventoryStatus === 'OUTOFSTOCK'"
                        class="flex-auto whitespace-nowrap"
                      />
                      <Button icon="pi pi-heart" outlined />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>
