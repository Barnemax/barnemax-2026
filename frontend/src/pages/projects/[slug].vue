<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const { locale, t } = useI18n()
const { getProjectBySlug } = useWordPress()
const localePath = useLocalePath()
const { getProjectUrl } = useRouteHelpers()
const { setProjectSchema } = useSchema()

const currentSlug = computed(() => String(route.params.slug))
const currentLocale = computed(() => locale.value.toUpperCase())

const { data, pending, error } = useAsyncData(
  `project-${route.params.slug}-${locale.value}`,
  () => getProjectBySlug(currentSlug.value, currentLocale.value),
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    watch: [() => locale.value, () => route.params.slug],
  },
)

const projectData = computed(() => data.value?.project)
const otherProject = computed(() => data.value?.otherProject)

if (error.value || (!pending.value && !projectData.value)) {
  throw createError({
    data: {
      redirect: {
        text: t('error.goProjects'),
        to: localePath({ name: 'projects' }),
      },
    },
    statusCode: 404,
    statusMessage: t('error.projectNotFound'),
  })
}

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  return [
    {
      label: t('menu.projects'),
      to: localePath({ name: 'projects' }),
    },
    {
      label: projectData.value?.title ?? '',
      to: '',
    },
  ]
})

watch(projectData, (project) => {
  if (project?.seo) {
    useSeo({
      fallbackTitle: project.title,
      seoData: project.seo,
    })
    setProjectSchema(project)
  }
}, { immediate: true })
</script>

<template>
  <div v-if="pending" key="skeleton">
    <!-- Title skeleton -->
    <USkeleton class="h-16 w-2/3 mb-8" />

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Sidebar skeleton -->
      <div class="lg:col-span-1 space-y-3">
        <!-- Breadcrumb -->
        <USkeleton class="h-5 w-40" />
        <!-- Term badges -->
        <div class="flex flex-wrap gap-2">
          <USkeleton class="h-8 w-20 rounded-full" />
          <USkeleton class="h-8 w-24 rounded-full" />
          <USkeleton class="h-8 w-16 rounded-full" />
        </div>
        <!-- Metadata (year, collaboration, designer, siteUrl) -->
        <div class="space-y-2">
          <USkeleton class="h-5 w-24" />
          <USkeleton class="h-5 w-40" />
          <USkeleton class="h-5 w-36" />
          <USkeleton class="h-5 w-28" />
        </div>
      </div>

      <!-- Content skeleton -->
      <div class="lg:col-span-2 space-y-3">
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-5/6" />
      </div>
    </div>

    <!-- Gallery skeleton -->
    <div class="mt-8">
      <USkeleton class="h-8 w-32 mb-4" />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <USkeleton class="h-64 rounded" />
        <USkeleton class="h-64 rounded" />
        <USkeleton class="h-64 rounded" />
      </div>
    </div>

    <!-- Other project skeleton -->
    <div class="mt-12 pt-8 border-t border-border">
      <div class="grid lg:grid-cols-3 gap-8">
        <USkeleton class="h-8 w-40 lg:ml-auto" />
        <div class="lg:col-span-2 flex items-center">
          <USkeleton class="w-6 h-6 mr-3" />
          <USkeleton class="h-8 w-48" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="projectData" key="content">
    <h1 class="font-bold text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-8">
      <GeometricText :text="projectData.title" />
    </h1>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-3">
        <UBreadcrumb :items="breadcrumbItems" />
        <div v-if="projectData.terms" class="flex flex-row flex-wrap gap-2">
          <TermBadge
            v-for="term in projectData.terms.nodes"
            :key="term.id"
            :name="term.name"
          />
        </div>
        <div class="space-y-2">
          <div v-if="projectData.projectFields?.year">
            <strong class="mr-1">{{ t('projects.year') }}</strong>{{ projectData.projectFields.year }}
          </div>
          <div
            v-if="projectData.projectFields?.collaboration"
            class="flex flex-row flex-wrap items-center"
          >
            <strong class="mr-1">{{ t('projects.collaboration') }}</strong>
            <NuxtLink
              :to="projectData.projectFields.collaboration.url"
              :target="projectData.projectFields.collaboration.target"
              class="flex flex-row items-center hover:underline"
            >
              {{ projectData.projectFields.collaboration.title }}
              <UIcon name="i-lucide-external-link" class="inline-block w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
          <div
            v-if="projectData.projectFields?.designer"
            class="flex flex-row flex-wrap items-center"
          >
            <strong class="mr-1">{{ t('projects.designer') }}</strong>
            <NuxtLink
              :to="projectData.projectFields.designer.url"
              :target="projectData.projectFields.designer.target"
              class="flex flex-row items-center hover:underline"
            >
              {{ projectData.projectFields.designer.title }}
              <UIcon name="i-lucide-external-link" class="inline-block w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
          <div v-if="projectData.projectFields?.siteUrl">
            <NuxtLink
              :to="projectData.projectFields.siteUrl"
              target="_blank"
              class="inline-flex flex-row items-center hover:underline"
            >
              {{ t('projects.siteUrl') }}
              <UIcon name="i-lucide-external-link" class="inline-block w-4 h-4 ml-2" />
            </NuxtLink>
          </div>
          <div v-if="projectData.projectFields?.githubUrl">
            <NuxtLink
              :to="projectData.projectFields.githubUrl"
              target="_blank"
              class="inline-flex flex-row items-center hover:underline"
            >
              {{ t('projects.githubUrl') }}
              <UIcon name="i-lucide-github" class="inline-block w-4 h-4 ml-2" />
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="lg:col-span-2">
        <div
          v-dompurify-html="projectData.content"
          class="wysiwyg-content prose prose-invert space-y-2 text-lg"
        />
      </div>
    </div>
    <div
      v-if="projectData.projectFields?.projectScreenshots"
      class="mt-8"
    >
      <h2 class="text-2xl font-semibold mb-4">
        {{ t('projects.gallery') }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(projectScreenshot, index) in projectData.projectFields.projectScreenshots"
          :key="index"
          class="overflow-hidden rounded"
        >
          <UModal
            :title="projectScreenshot.imageTitle || projectData.title"
            :ui="{
              title: 'text-2xl',
              header: 'flex items-center justify-between',
              close: 'static w-6 h-6 border-2 rounded-full flex items-center justify-center hover:bg-primary hover:text-background transition-colors',
              description: 'text-base',
              overlay: 'fixed inset-0 data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in] bg-background/75',
              content: 'bg-background text-primary lg:max-h-[90vh] max-w-95vw lg:max-w-[80vw] w-full divide-y-1 flex flex-col focus:outline-none data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible',
            }"
            aria-describedby="undefined"
          >
            <UButton
              :label="t('projects.siteUrl')"
              :aria-label="projectScreenshot.imageTitle || projectData.title"
              class="w-full py-0 bg-background cursor-pointer"
            >
              <figure class="w-full relative overflow-hidden">
                <div class="absolute w-full h-full inset-0 bg-background/75 opacity-100 hover:opacity-0 transition-opacity flex items-center justify-center p-8">
                  <figcaption v-if="projectScreenshot.imageTitle" class="text-lg text-center font-bold flex flex-col items-center justify-center">
                    <UIcon name="i-lucide-eye" class="inline-block w-5 h-5 mr-2" />
                    {{ projectScreenshot.imageTitle }}
                  </figcaption>
                </div>
                <NuxtImg
                  :src="projectScreenshot?.projectImage?.node?.mediaDetails.sizes['3']?.sourceUrl || projectScreenshot?.projectImage?.node?.sourceUrl"
                  :alt="projectScreenshot?.projectImage?.node?.altText || projectScreenshot.imageTitle || `${projectData.title} screenshot`"
                  class="w-full transform hover:scale-105 transition-transform duration-300 object-cover h-64"
                />
              </figure>
            </UButton>
            <template
              #body
            >
              <NuxtImg
                :src="projectScreenshot?.projectImage?.node?.sourceUrl"
                :alt="projectScreenshot?.projectImage?.node?.altText || projectScreenshot.imageTitle || `${projectData.title} screenshot`"
                class="w-full lg:w-auto h-auto lg:h-full mx-auto object-contain"
              />
            </template>
          </UModal>
        </div>
      </div>
    </div>

    <div v-if="otherProject" class="mt-12 pt-8 border-t border-border">
      <div class="grid lg:grid-cols-3 gap-8">
        <h3 class="text-2xl font-semibold lg:text-right opacity-70">
          {{ t('projects.otherProject') }}
        </h3>
        <div class="lg:col-span-2">
          <NuxtLink
            :to="getProjectUrl(otherProject.slug)"
            class="flex flex-row items-center transition-colors hover:text-white"
          >
            <GeometricSquare size="auto" class="mr-3" />
            <h4 class="text-2xl font-bold">{{ otherProject.title }}</h4>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
