<script setup lang="ts">
const { locale, defaultLocale } = useI18n();

const props = withDefaults(
  defineProps<{
    /** Date/time value to display */
    datetime: string | Date | number;
    /** Show year */
    year?: 'numeric' | '2-digit';
    /** Show month */
    month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
    /** Show day */
    day?: 'numeric' | '2-digit';
    /** Show hour */
    hour?: 'numeric' | '2-digit';
    /** Show minute */
    minute?: 'numeric' | '2-digit';
    /** Show second */
    second?: 'numeric' | '2-digit';
    /** Custom locale override */
    customLocale?: string;
    /** Show weekday */
    weekday?: 'narrow' | 'short' | 'long';
    /** Show era */
    era?: 'narrow' | 'short' | 'long';
    /** Show timezone name */
    timeZoneName?:
      | 'short'
      | 'long'
      | 'shortOffset'
      | 'longOffset'
      | 'shortGeneric'
      | 'longGeneric';
  }>(),
  {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
);
</script>

<template>
  <NuxtTime
    :datetime="props.datetime"
    :year="props.year"
    :month="props.month"
    :day="props.day"
    :hour="props.hour"
    :minute="props.minute"
    :second="props.second"
    :weekday="props.weekday"
    :era="props.era"
    :time-zone-name="props.timeZoneName"
    :locale="props.customLocale ?? locale ?? defaultLocale"
  />
</template>
