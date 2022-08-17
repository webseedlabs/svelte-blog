import { readdirSync, statSync, existsSync, unlinkSync, rmSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';
import { log } from './logger.js';
import { firstLine } from './readFirstLine.js';

/**
 *
 * @param {*} str input string
 * @param {*} map {
 *                  match: regex rules,
 *                  replace: string to replace with,
 *                }
 * @returns replaced string
 */
export const strReplaceMatchWith = (str, map) => {
  map.forEach(function (_err, regexItem) {
    str = str.replace(map[regexItem].match, map[regexItem].replace);
  });
  return str;
};

export const getAllFilesInDir = (src, arrayFiles = []) => {
  if (!existsSync(src)) return [];

  const files = readdirSync(src, { withFileTypes: true });

  arrayFiles = arrayFiles || [];

  files.forEach((file) => {
    if (file.isDirectory()) {
      arrayFiles = getAllFilesInDir(join(src, file.name), arrayFiles);
    } else {
      arrayFiles.push(join(src, file.name));
    }
  });

  return arrayFiles;
};

export const rmFile = (path) => {
  if (path && existsSync(path)) {
    unlinkSync(path);
    log('red', 'File Removed', path);
  }
};

export const rmDir = (dir) => {
  if (existsSync(dir)) {
    getAllFilesInDir(dir).forEach((f) => rmFile(f));
    rmSync(dir, { recursive: true, force: true });
    log('red', 'Dir Removed', dir);
  } else {
    log('green', 'Dir Not Exists. All Done.', dir);
  }
};

export const rmGeneratedFiles = (file, matchString) => {
  return new Promise((resolve) => {
    firstLine(file).then((s) => {
      if (s.match(matchString)) {
        rmFile(file);
        resolve(true);
      }
      resolve(false);
    });
  });
};

export const rmEmptyFolders = (dir) => {
  var isDir = statSync(dir).isDirectory();
  if (!isDir) {
    return;
  }

  var files = readdirSync(dir);
  if (files.length > 0) {
    files.forEach(function (file) {
      var fullPath = join(dir, file);
      rmEmptyFolders(fullPath);
    });

    files = readdirSync(dir);
  }

  if (files.length == 0) {
    rmdirSync(dir);
    log('red', 'Empty Dir Removed', dir);
    return;
  }
};
