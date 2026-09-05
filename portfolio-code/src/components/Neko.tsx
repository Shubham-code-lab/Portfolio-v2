import { useNekoScript } from '../hooks/useNekoScript';

/** Mounts the vanilla cat from `public/vendor/neko`. The pet has no DOM of its own. */
export default function Neko() {
  useNekoScript();
  return null;
}
