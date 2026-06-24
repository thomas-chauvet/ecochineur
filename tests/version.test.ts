import { describe, expect, it } from 'vitest';

import { parseDescribe } from '../version';

describe('parseDescribe', () => {
  it('parses a plain release tag', () => {
    expect(parseDescribe('v1.2.3')).toEqual({
      version: '1.2.3',
      versionName: '1.2.3',
    });
  });

  it('parses a pre-release tag, stripping the suffix from version', () => {
    expect(parseDescribe('v1.2.3-rc.1')).toEqual({
      version: '1.2.3',
      versionName: '1.2.3-rc.1',
    });
  });

  it('parses a tag with no leading v', () => {
    expect(parseDescribe('1.2.3')).toEqual({
      version: '1.2.3',
      versionName: '1.2.3',
    });
  });

  it('parses a git-describe dev string between tags', () => {
    expect(parseDescribe('v1.2.3-5-gabc123')).toEqual({
      version: '1.2.3',
      versionName: '1.2.3-5-gabc123',
    });
  });

  it('trims surrounding whitespace from git output', () => {
    expect(parseDescribe('v1.2.3\n')).toEqual({
      version: '1.2.3',
      versionName: '1.2.3',
    });
  });
});
