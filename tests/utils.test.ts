import { expect, test } from 'vitest';
import { getDisplayTitle, slugify } from '../src/utils/text';

test('slugify converts text to kebab-case', () => {
  expect(slugify('Hello World')).toBe('hello-world');
  expect(slugify('Kanban2Code is Awesome!')).toBe('kanban2code-is-awesome');
  expect(slugify('  Trim Me  ')).toBe('trim-me');
});

test('getDisplayTitle prefixes task number for roadmap task ids', () => {
  expect(getDisplayTitle({ id: 'task1.2-remove-template-service', title: 'Remove Template Service' }))
    .toBe('1.2 Remove Template Service');
});

test('getDisplayTitle does not show timestamp ids', () => {
  expect(getDisplayTitle({ id: '1765942177900-some-name', title: 'Some Name' })).toBe('Some Name');
});

test('getDisplayTitle falls back safely for empty titles', () => {
  expect(getDisplayTitle({ id: 'task1.2-some-name', title: '' })).toBe('1.2');
  expect(getDisplayTitle({ id: '1765942177900-some-name', title: '' })).toBe('Untitled');
  expect(getDisplayTitle({ id: 'whatever', title: '' })).toBe('Untitled');
});
