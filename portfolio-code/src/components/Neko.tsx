import { useNekoScript } from '../hooks/useNekoScript';

/** Mounts the vanilla `public/neko.js` cat. The pet has no DOM of its own. */
export default function Neko() {
  useNekoScript();
  return null;
}
