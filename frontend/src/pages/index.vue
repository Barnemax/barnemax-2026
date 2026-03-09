<script setup lang="ts">
import type { Homepage } from '~/types/wordpress'

const { locale, t } = useI18n()
const { getHomepage } = useWordPress()

const { data: homePageData, error: homePageError } = await useAsyncData<Homepage>(
  `homepage-${locale.value}`,
  () => getHomepage(locale.value.toUpperCase()),
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    watch: [locale],
  },
)

if (import.meta.dev && homePageError.value) {
  console.error('Homepage fetch error:', homePageError.value)
}

if (homePageData.value?.seo) {
  useSeo({
    fallbackTitle: 'Homepage',
    seoData: homePageData.value.seo,
  })
}

// Normalize sections for easier looping
const sections = computed(() => {
  const hp = homePageData.value?.homepage
  if (!hp) return []

  return [
    {
      content: hp.introduction?.contentIntroduction,
      key: 'introduction',
      links: hp.introduction?.linksIntroduction?.map(item => item.linkLinksIntroduction),
      title: t('homepage.introductionTitle'),
    },
    {
      content: hp.experience?.contentExperience,
      key: 'experience',
      links: hp.experience?.linksExperience?.map(item => item.linkLinksExperience),
      title: t('homepage.experienceTitle'),
    },
    {
      content: hp.about?.contentAbout,
      key: 'about',
      links: hp.about?.linksAbout?.map(item => item.linkLinksAbout),
      title: t('homepage.aboutTitle'),
    },
  ]
})
</script>

<template>
  <div>
    <div class="h-screen">
      <div class="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h1 class="tracking-wide text-4xl lg:text-7xl font-bold mb-4 transition-colors hover:text-white">
          <GeometricText text="barnemax" />
        </h1>
        <h2 class="opacity-40 text-3xl lg:text-6xl font-bold">
          <GeometricText :text="t('homepage.tagline')" />
        </h2>
      </div>

      <div class="absolute bottom-16 left-0 w-full flex flex-col justify-center items-center text-center px-4">
        <div class="text-xl font-bold">
          {{ t('homepage.scenarioSelection.title') }}
        </div>
        <div class="flex flex-row gap-8 items-center mt-4">
          <NuxtLink
            :href="'#' + t('homepage.scenarioSelection.summary')"
            class="flex flex-row gap-2 items-center hover:underline hover:text-white transition-colors"
          >
            {{ t('homepage.scenarioSelection.summary') }}
            <UIcon name="i-lucide-arrow-down-right" class="text-current opacity-50" />
          </NuxtLink>
          <NuxtLink
            :href="'#' + t('homepage.scenarioSelection.verbose')"
            class="flex flex-row gap-2 items-center hover:underline hover:text-white transition-colors"
          >
            {{ t('homepage.scenarioSelection.verbose') }}
            <UIcon name="i-lucide-arrow-down-right" class="text-current opacity-50" />
          </NuxtLink>
        </div>
      </div>

      <AnimatedBackground :rings="8" />
    </div>
    <div
      :id="t('homepage.scenarioSelection.summary')"
      class="py-16"
    >
      <div class="container mx-auto px-8">
        <div class="grid lg:grid-cols-2 gap-8">
          <div
            v-for="fact in homePageData?.homepage?.summary || []"
            :key="fact.columnTitle"
            class="flex flex-col p-4"
          >
            <div class="text-2xl xl:text-3xl 2xl:text-4xl font-semibold mb-4 lg:mb-6 opacity-60">
              {{ fact.columnTitle }}
            </div>

            <dl class="grid sm:grid-cols-[auto_1fr] gap-x-4 gap-y-0 lg:gap-y-3">
              <template
                v-for="item in fact.summaryItem || []"
                :key="item.label"
              >
                <dt class="font-bold lg:text-right">
                  {{ item.label }}
                </dt>
                <dd class="mb-4 lg:mb-0">
                  {{ item.value }}
                </dd>
              </template>
              <dt />
              <dd class="flex flex-row flex-wrap gap-8 mt-4 pt-4 border-t border-primary/60">
                <NuxtLink
                  v-for="(link, index) in fact.links"
                  :key="index"
                  :href="link.link.url"
                  :target="link.link.target"
                  class="font-bold flex flex-row items-center hover:underline hover:text-white transition-colors"
                >
                  {{ link.link.title }}

                  <UIcon
                    :name="link.link.target === '_blank' ? 'i-lucide-external-link' : 'i-lucide-link'"
                    class="inline-block w-4 h-4 ml-2.5"
                  />
                </NuxtLink>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="homePageData?.homepage?.homeProjects?.highlightedProjects?.nodes?.length"
    >
      <div class="container mx-auto px-8">
        <div class="flex items-baseline justify-between mb-8">
          <h2 class="text-2xl xl:text-3xl font-semibold opacity-60">
            {{ homePageData.homepage.homeProjects.titleProjects }}
          </h2>
          <NuxtLink
            v-if="homePageData.homepage.homeProjects.linkToArchive"
            :href="homePageData.homepage.homeProjects.linkToArchive.url"
            :target="homePageData.homepage.homeProjects.linkToArchive.target"
            class="font-bold flex flex-row items-center hover:underline hover:text-white transition-colors"
          >
            {{ homePageData.homepage.homeProjects.linkToArchive.title }}
            <UIcon name="i-lucide-link" class="inline-block w-4 h-4 ml-2" />
          </NuxtLink>
        </div>
        <div class="group/projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            v-for="project in homePageData.homepage.homeProjects.highlightedProjects.nodes"
            :key="project.id"
            :slug="project.slug"
            :title="project.title"
            :excerpt="project.excerpt"
            :year="project.projectFields?.year"
            :terms="project.terms"
          />
        </div>
      </div>
    </div>

    <div
      :id="t('homepage.scenarioSelection.verbose')"
      class="container mx-auto lg:pt-32 px-8 space-y-16"
    >
      <section
        v-for="section in sections"
        :key="section.key"
        class="lg:grid lg:grid-cols-3 gap-8"
      >
        <div class="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold mb-2 lg:mb-4 lg:col-span-1 lg:text-right opacity-30">
          {{ section.title }}
        </div>
        <div class="lg:col-span-2">
          <div
            v-if="section.content"
          >
            <div
              v-dompurify-html="section.content"
              class="wysiwyg-content space-y-4 text-lg mb-4"
            />
          </div>
          <ul
            v-if="section.links?.length"
            class="space-y-2"
          >
            <li
              v-for="(link, index) in section.links"
              :key="index"
            >
              <NuxtLink
                :href="link.url"
                :target="link.target"
                class="font-bold text-lg flex flex-row items-center hover:underline hover:text-white transition-colors"
              >
                {{ link.title }}

                <UIcon
                  :name="link.target === '_blank' ? 'i-lucide-external-link' : 'i-lucide-link'"
                  class="inline-block w-4 h-4 ml-2.5"
                />
              </NuxtLink>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
