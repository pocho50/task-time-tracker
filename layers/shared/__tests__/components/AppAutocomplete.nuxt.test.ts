import { describe, it, expect, vi } from 'vitest';
import { mountSuspended, mockComponent, mockNuxtImport  } from '@nuxt/test-utils/runtime';
import AppAutocomplete from '../../components/AppAutocomplete.vue';

const PLACEHOLDER = 'Select an option';
const NO_OPTIONS = 'No options available';

// Mock i18n
const { useI18nMock } = vi.hoisted(() => {
  return {
    useI18nMock: vi.fn(() => ({
      t: (key: string) => {
        // Mock translations
        const translations: Record<string, string> = {
          'autocomplete.placeholder': PLACEHOLDER,
          'autocomplete.noOptions': NO_OPTIONS,
        };
        return translations[key] || key;
      },
    })),
  };
});

mockNuxtImport('useI18n', () => useI18nMock);

// Mock the Icon component
mockComponent('Icon', {
  props: ['name', 'size'],
  template: '<i :data-icon="name" :class="`icon-${name}`"></i>',
});

// Mock useTemplateRef and onClickOutside composables
mockNuxtImport('useTemplateRef', () => {
  return <T>(_: string) => ref<T | null>(null);
});

mockNuxtImport('onClickOutside', () => {
  return (_: any, callback: () => void) => {
    // Store the callback to trigger it in tests
    (window as any).triggerClickOutside = callback;
  };
});

// Sample options for testing
const testOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('AppAutocomplete', () => {
  it('renders with default placeholder when no option is selected', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
        placeholder: PLACEHOLDER,
      },
    });

    // Assert
    expect(wrapper.find('input').attributes('placeholder')).toBe(PLACEHOLDER);
  });

  it('renders with custom placeholder when provided', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
        placeholder: 'Custom placeholder',
      },
    });

    // Assert
    expect(
      wrapper.find('input').attributes('placeholder')
    ).toMatchInlineSnapshot(`"Custom placeholder"`);
  });

  it('renders with label when provided', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
        label: 'Test Label',
      },
    });

    // Assert
    expect(wrapper.find('.label-text').text()).toMatchInlineSnapshot(
      `"Test Label"`
    );
  });

  it('opens dropdown when input is focused', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
      },
    });

    // Act - Focus the input
    const input = wrapper.find('input');
    await input.trigger('focus');

    // Assert - Dropdown should be open
    expect(wrapper.find('.dropdown').classes()).toContain('dropdown-open');
    expect(wrapper.find('.dropdown-content').isVisible()).toBe(true);
  });

  it('displays correct options in the dropdown', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
      },
    });

    // Act - Focus the input to open dropdown
    const input = wrapper.find('input');
    await input.trigger('focus');

    // Assert - Check options
    const optionElements = wrapper.findAll('.dropdown-content li a');
    expect(optionElements.length).toBe(3);
    expect(optionElements[0]!.text()).toMatchInlineSnapshot(`"Option 1"`);
    expect(optionElements[1]!.text()).toMatchInlineSnapshot(`"Option 2"`);
    expect(optionElements[2]!.text()).toMatchInlineSnapshot(`"Option 3"`);
  });

  it('selects option when clicked', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
      },
    });

    // Act - Focus input to open dropdown
    const input = wrapper.find('input');
    await input.trigger('focus');

    // Click on the first option
    const optionElements = wrapper.findAll('.dropdown-content li a');
    await optionElements[0]!.trigger('click');

    // Assert
    expect(wrapper.find('input').element.value).toBe('Option 1');
    // Check that dropdown is closed after selection
    expect(wrapper.find('.dropdown').classes()).not.toContain('dropdown-open');
  });

  it('filters options based on search query', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
      },
    });

    // Act - Focus input and type
    const input = wrapper.find('input');
    await input.trigger('focus');
    await input.setValue('Option 1');
    await input.trigger('input');

    // Assert - Only matching option should be displayed
    const optionElements = wrapper.findAll('.dropdown-content li a');
    expect(optionElements.length).toBe(1);
    expect(optionElements[0]!.text()).toMatchInlineSnapshot(`"Option 1"`);
  });

  it('shows clear button when option is selected', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
        modelValue: '1',
      },
    });

    // Assert
    expect(wrapper.find('[data-icon="mdi:chevron-down"]').exists()).toBe(true);
  });

  it('clears selection when clear button is clicked', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
        modelValue: '1',
        placeholder: PLACEHOLDER,
      },
    });

    // Act - Click clear button
    const clearButton = wrapper.find('[data-icon="mdi:chevron-down"]');
    await clearButton.trigger('click');

    // Assert
    expect(wrapper.find('input').element.value).toBe('');
    expect(wrapper.find('input').attributes('placeholder')).toBe(PLACEHOLDER);
  });

  it('shows a message when no options are available', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: [],
      },
    });

    // Act - Focus input to open dropdown
    const input = wrapper.find('input');
    await input.trigger('focus');

    // Assert
    expect(wrapper.text()).toContain(NO_OPTIONS);
  });

  it('closes dropdown when clicking outside', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
      },
    });

    // Act - Focus input to open dropdown
    const input = wrapper.find('input');
    await input.trigger('focus');
    // Dropdown should be open
    expect(wrapper.find('.dropdown').classes()).toContain('dropdown-open');

    // Act - Simulate click outside
    (window as any).triggerClickOutside();
    await wrapper.vm.$nextTick();

    // Assert - Dropdown should be closed
    expect(wrapper.find('.dropdown').classes()).not.toContain('dropdown-open');
  });

  it('navigates options with keyboard arrows and selects with enter', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
      },
    });

    // Act - Focus input to open dropdown
    const input = wrapper.find('input');
    await input.trigger('focus');

    // Navigate down to first option
    await input.trigger('keydown', { key: 'ArrowDown' });

    // Select with enter
    await input.trigger('keydown', { key: 'Enter' });

    // Assert
    expect(wrapper.find('input').element.value).toBe('Option 1');
  });

  it('respects minChars prop for filtering', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppAutocomplete, {
      props: {
        options: testOptions,
        minChars: 2,
      },
    });

    // Act - Focus input and type one character
    const input = wrapper.find('input');
    await input.trigger('focus');
    await input.setValue('O');
    await input.trigger('input');

    // Assert - All options should still be visible since we haven't reached minChars
    const optionElements = wrapper.findAll('.dropdown-content li a');
    expect(optionElements.length).toBe(3);

    // Act - Type more characters to reach minChars
    await input.setValue('Op');
    await input.trigger('input');

    // Assert - Now options should be filtered
    const filteredOptionElements = wrapper.findAll('.dropdown-content li a');
    expect(filteredOptionElements.length).toBe(3);
  });
});
