import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), 'utf8'));
}

function exists(relativePath) {
  return existsSync(path.join(root, relativePath));
}

function docPath(notesDoc) {
  return notesDoc.split('#')[0];
}

describe('architecture index', () => {
  test('uses the index-first architecture contract and valid topic files', () => {
    const index = readJson('docs/architecture/index.json');

    assert.equal(index.source_of_truth.architecture_landing_page, 'docs/architecture.md');
    assert.equal(index.source_of_truth.index_path, 'docs/architecture/index.json');
    assert.ok(Array.isArray(index.sections));
    assert.ok(index.sections.length > 0);
    assert.ok(exists('docs/architecture.md'));

    for (const section of index.sections) {
      assert.equal(typeof section.title, 'string');
      assert.ok(section.title.length > 0);
      assert.equal(typeof section.file, 'string');
      assert.ok(exists(section.file), `${section.file} should exist`);
      assert.equal(typeof section.summary, 'string');
      assert.ok(section.summary.length > 0);
      assert.ok(Array.isArray(section.search_terms));
      assert.ok(section.search_terms.length > 0);
    }
  });

  test('does not keep the old copied architecture seed files', () => {
    assert.equal(exists('docs/architecture/architecture-index.json'), false);
    assert.equal(exists('docs/architecture/architecture-contract.md'), false);
  });
});

describe('design component index', () => {
  test('uses the index-first design contract and valid component references', () => {
    const index = readJson('docs/design/ui-components-index.json');

    assert.equal(index.source_of_truth.design_system_doc, 'docs/design/design-system.md');
    assert.equal(index.source_of_truth.design_memory_doc, 'docs/design/ui-implementation-system.md');
    assert.ok(Array.isArray(index.shared_components));
    assert.ok(Array.isArray(index.screen_specific_components));
    assert.ok(exists('docs/design/ui-implementation-system.md'));

    for (const component of index.shared_components) {
      assert.equal(typeof component.name, 'string');
      assert.ok(component.name.length > 0);
      assert.equal(typeof component.status, 'string');
      assert.ok(exists(docPath(component.notes_doc)), `${component.notes_doc} should exist`);

      if (component.status !== 'planned') {
        for (const sourceRef of component.source_refs ?? []) {
          assert.ok(exists(sourceRef), `${sourceRef} should exist`);
        }

        for (const targetFile of component.target_files ?? []) {
          assert.ok(exists(targetFile), `${targetFile} should exist`);
        }
      }
    }
  });
});

describe('build scaffold output', () => {
  test('build output includes canonical docs and kanban scaffold assets', () => {
    assert.ok(exists('dist/scaffold/docs/architecture/index.json'));
    assert.ok(exists('dist/scaffold/docs/architecture.md'));
    assert.ok(exists('dist/scaffold/docs/design/ui-components-index.json'));
    assert.ok(exists('dist/scaffold/.kanban2code/_agents/04-planner.md'));
    assert.ok(exists('dist/scaffold/.kanban2code/_agents/05-coder.md'));
    assert.ok(exists('dist/scaffold/.kanban2code/_agents/06-auditor.md'));
  });
});
