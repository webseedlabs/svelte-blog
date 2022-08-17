// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { readable } from 'svelte/store';
import type { Asset } from '$generated/asset';

/*<!-- :QWER IMPORTS: -->*/

export const assets = (() => {
  const _data = new Map<string, Asset.Image>([
    /*<!-- :QWER MAPDATA: -->*/
  ]);

  const { subscribe } = readable<Map<string, Asset.Image>>(_data);

  return {
    subscribe,
  };
})();
