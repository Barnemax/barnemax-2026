<script setup lang="ts">
const { getProjectsWithArchive } = useWordPress()
const { locale, t } = useI18n()

const { data, pending } = await useAsyncData(
  `projects-with-archive-${locale.value}`,
  () => getProjectsWithArchive(locale.value.toUpperCase()),
  {
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] || nuxtApp.static.data[key],
    watch: [locale],
  },
)

const { contentRef } = useLocaleTransition(pending)

const activeTypes = ref<string[]>([])

const typeOptions = computed(() => {
  const projects = data.value?.projects || []
  const types = projects.flatMap(p => p.terms?.nodes || [])
  const unique = [...new Map(types.map(t => [t.id, t])).values()]

  return unique
    .map((t) => {
      const count = projects.filter(p => p.terms?.nodes?.some(term => term.id === t.id)).length

      return { count, label: `${t.name} (${count})`, value: t.id }
    })
    .sort((a, b) => b.count - a.count)
})

const filteredProjects = computed(() => {
  let projects = data.value?.projects?.slice() || []

  if (activeTypes.value.length) {
    projects = projects.filter(p =>
      p.terms?.nodes?.some(t => activeTypes.value.includes(t.id)),
    )
  }

  return projects.sort((a, b) =>
    (b.projectFields?.year ?? 0) - (a.projectFields?.year ?? 0),
  )
})

const archiveData = computed(() => data.value?.archive)

if (archiveData.value?.seo) {
  useSeo({
    fallbackTitle: t('menu.projects'),
    seoData: archiveData.value.seo,
  })
}
</script>

<template>
  <div ref="contentRef" class="pt-20">
    <div class="flex flex-col items-center lg:items-start justify-center lg:justify-start lg:flex-row">
      <div class="opacity-50 text-4xl font-bold mb-2 lg:mb-6">
        <GeometricText :text="t('menu.projects')" />
      </div>
      <h1 class="text-4xl font-bold mb-6 lg:ml-3 text-center lg:text-left">
        <GeometricText :text="t('projects.archive.tagline')" />
      </h1>

      <USelectMenu
        v-if="typeOptions.length"
        v-model="activeTypes"
        :items="typeOptions"
        :placeholder="t('projects.filter')"
        clear
        value-key="value"
        multiple
        icon="i-lucide-filter"
        class="w-64 mb-6 mr-auto lg:ml-auto lg:mr-0 cursor-pointer"
        :ui="{
          base: 'ps-9 pe-9 inline-flex gap-1.5 items-center',
          leading: 'ps-2.5 start-0',
          trailing: 'pe-2.5 end-0',
          input: 'px-2 border-0 ring-0 focus:ring-0 outline-none focus:outline-none focus-visible:outline-none',
          value: 'truncate',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          content: 'bg-background text-white max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-background/0',
          item: 'px-2 py-1',
          itemLabel: 'hover:underline cursor-pointer',
        }"
      />
    </div>
    <div
      v-if="filteredProjects.length"
      class="group/projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :slug="project.slug"
        :title="project.title"
        :excerpt="project.excerpt"
        :year="project.projectFields.year"
        :terms="project.terms"
      />
    </div>
  </div>
</template>
