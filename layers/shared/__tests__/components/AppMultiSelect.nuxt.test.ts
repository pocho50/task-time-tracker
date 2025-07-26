import { describe, it, expect, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { mockComponent, mockNuxtImport } from '@nuxt/test-utils/runtime';
import AppMultiSelect from '../../components/AppMultiSelect.vue';

const PLACEHOLDER = 'Select options';
const NO_OPTIONS = 'No options available';

// Mock i18n
const { useI18nMock } = vi.hoisted(() => {
  return {
    useI18nMock: vi.fn(() => ({
      t: (key: string) => {
        // Mock translations
        const translations: Record<string, string> = {
          'multiSelect.placeholder': PLACEHOLDER,
          'multiSelect.noOptions': NO_OPTIONS,
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

describe('AppMultiSelect', () => {
  it('renders with default placeholder when no options are selected', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
        placeholder: PLACEHOLDER,
      },
    });

    // Assert
    expect(wrapper.text()).toContain(PLACEHOLDER);
  });

  it('renders with custom placeholder when provided', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
        placeholder: 'Custom placeholder',
      },
    });

    // Assert
    expect(wrapper.text()).toContain('Custom placeholder');
  });

  it('renders with label when provided', async () => {
    // Arrange & Act
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
        label: 'Test Label',
      },
    });

    // Assert
    expect(wrapper.find('.label-text').text()).toBe('Test Label');
  });

  it('opens dropdown when button is clicked', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
      },
    });

    // Act - Find and click the dropdown button
    const button = wrapper.find('button');
    await button.trigger('click');

    // Assert - Dropdown should be open
    expect(wrapper.find('.dropdown').classes()).toContain('dropdown-open');
    expect(wrapper.find('.dropdown-content').isVisible()).toBe(true);
  });

  it('displays correct options in the dropdown', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
      },
    });

    // Act - Open the dropdown
    const button = wrapper.find('button');
    await button.trigger('click');

    // Assert - Check options
    const optionElements = wrapper.findAll('li label span');
    expect(optionElements.length).toBe(3);
    expect(optionElements[0]!.text()).toBe('Option 1');
    expect(optionElements[1]!.text()).toBe('Option 2');
    expect(optionElements[2]!.text()).toBe('Option 3');
  });

  it('selects options when checkboxes are clicked', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
        modelValue: [],
      },
    });

    // Act - Open dropdown and check options
    await wrapper.find('button').trigger('click');
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes).toHaveLength(3); // Ensure we have the expected checkboxes
    await checkboxes[0]!.setValue(true);
    await checkboxes[2]!.setValue(true);

    // Assert
    expect(wrapper.find('button span').text()).toMatchInlineSnapshot(
      `"Option 1, Option 3"`
    );

    // Act - Check another option
    expect(checkboxes.length).toBeGreaterThan(1);
    await checkboxes[1]!.setValue(true);
    expect(wrapper.find('button span').text()).toMatchInlineSnapshot(
      `"Option 1, Option 2, Option 3"`
    );

    // Update the model directly to test rendering
    await wrapper.setProps({
      modelValue: ['1', '3'],
    });

    // Check that the displayed text shows the selected options
    expect(wrapper.find('button span').text()).toMatchInlineSnapshot(
      `"Option 1, Option 3"`
    );
  });

  it('shows reset button when options are selected', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
        modelValue: ['1', '2'],
      },
    });

    // Assert
    expect(wrapper.find('[data-icon="mdi:close"]').exists()).toBe(true);
  });

  it('resets selection when reset button is clicked', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
        modelValue: ['1', '2'],
        placeholder: PLACEHOLDER,
      },
    });

    // Act - Click reset button
    const resetButton = wrapper.find('[data-icon="mdi:close"]');
    await resetButton.trigger('click');

    // Assert
    expect(wrapper.find('button span').text()).toContain(PLACEHOLDER);
  });

  it('shows a message when no options are available', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: [],
      },
    });

    // Act - Open dropdown
    await wrapper.find('button').trigger('click');

    // Assert
    expect(wrapper.text()).toContain(NO_OPTIONS);
  });

  it('closes dropdown when clicking outside', async () => {
    // Arrange
    const wrapper = await mountSuspended(AppMultiSelect, {
      props: {
        options: testOptions,
      },
    });

    // Act - Open dropdown
    await wrapper.find('button').trigger('click');
    // Dropdown should be open
    expect(wrapper.find('.dropdown').classes()).toContain('dropdown-open');

    // Act - Simulate click outside
    (window as any).triggerClickOutside();
    await nextTick();

    // Assert - Dropdown should be closed
    expect(wrapper.find('.dropdown').classes()).not.toContain('dropdown-open');
  });
});
