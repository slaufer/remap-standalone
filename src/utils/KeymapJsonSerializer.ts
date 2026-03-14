import { ICustomKeycode, IEncoderKeymaps, IKeymap } from '../services/hid/Hid';
import { KeycodeList } from '../services/hid/KeycodeList';
import { KeyboardLabelLang } from '../services/labellang/KeyLabelLangs';
import { LayoutOption } from '../components/configure/keymap/Keymap';

export const KEYMAP_JSON_VERSION = '1';
export const SUPPORTED_VERSIONS = ['1'];

export interface KeymapJsonData {
  version: string;
  vendorId: number;
  productId: number;
  productName: string;
  labelLang: KeyboardLabelLang;
  layoutOptions: LayoutOption[];
  keycodes: { [pos: string]: number }[];
  encoderKeycodes: {
    [id: number]: { clockwise: number; counterclockwise: number };
  }[];
}

export type DeserializeResult =
  | { success: true; data: KeymapJsonData }
  | { success: false; error: string };

export function buildKeymapKeycodes(
  keymaps: { [pos: string]: IKeymap }[],
  layerCount: number
): { [pos: string]: number }[] {
  const keycodes: { [pos: string]: number }[] = [];
  for (let i = 0; i < layerCount; i++) {
    const keyMap: { [pos: string]: number } = {};
    const km = keymaps[i];
    Object.keys(km).forEach((pos) => {
      keyMap[pos] = km[pos].code;
    });
    keycodes.push(keyMap);
  }
  return keycodes;
}

export function buildEncoderKeymapKeycodes(
  encodersKeymaps: IEncoderKeymaps[] | undefined,
  layerCount: number
): { [id: number]: { clockwise: number; counterclockwise: number } }[] {
  if (encodersKeymaps === undefined) {
    return (
      new Array(layerCount) as {
        [id: number]: { clockwise: number; counterclockwise: number };
      }[]
    ).fill({});
  }
  const keycodes: {
    [id: number]: { clockwise: number; counterclockwise: number };
  }[] = [];
  for (let i = 0; i < layerCount; i++) {
    const keymap: {
      [id: number]: { clockwise: number; counterclockwise: number };
    } = {};
    const km = encodersKeymaps[i];
    Object.keys(km).forEach((id) => {
      keymap[Number(id)] = {
        clockwise: km[Number(id)].clockwise.code,
        counterclockwise: km[Number(id)].counterclockwise.code,
      };
    });
    keycodes.push(keymap);
  }
  return keycodes;
}

export function serializeKeymapToJson(params: {
  keymaps: { [pos: string]: IKeymap }[];
  encodersKeymaps: IEncoderKeymaps[] | undefined;
  layerCount: number;
  vendorId: number;
  productId: number;
  productName: string;
  labelLang: KeyboardLabelLang;
  layoutOptions: LayoutOption[];
}): KeymapJsonData {
  return {
    version: KEYMAP_JSON_VERSION,
    vendorId: params.vendorId,
    productId: params.productId,
    productName: params.productName,
    labelLang: params.labelLang,
    layoutOptions: params.layoutOptions,
    keycodes: buildKeymapKeycodes(params.keymaps, params.layerCount),
    encoderKeycodes: buildEncoderKeymapKeycodes(
      params.encodersKeymaps,
      params.layerCount
    ),
  };
}

export function deserializeKeymapFromJson(raw: string): DeserializeResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, error: 'The file is not valid JSON.' };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { success: false, error: 'The file is not valid JSON.' };
  }

  const obj = parsed as Record<string, unknown>;

  if (!('version' in obj)) {
    return {
      success: false,
      error: 'Missing required field: version.',
    };
  }

  if (!SUPPORTED_VERSIONS.includes(obj.version as string)) {
    return {
      success: false,
      error: `Unsupported keymap format version: "${obj.version}". Supported: ${SUPPORTED_VERSIONS.join(', ')}.`,
    };
  }

  if (!('keycodes' in obj) || !Array.isArray(obj.keycodes)) {
    return {
      success: false,
      error: 'Missing required field: keycodes.',
    };
  }

  return {
    success: true,
    data: obj as unknown as KeymapJsonData,
  };
}

export function convertJsonDataToRemaps(
  data: KeymapJsonData,
  currentKeymaps: { [pos: string]: IKeymap }[],
  customKeycodes: ICustomKeycode[] | undefined
): { [pos: string]: IKeymap }[] {
  const labelLang = data.labelLang;
  const savedKeycodes = data.keycodes;
  const layerCount = currentKeymaps.length;

  const remaps: { [pos: string]: IKeymap }[] = [];
  for (let i = 0; i < layerCount; i++) {
    const changes: { [pos: string]: IKeymap } = {};
    if (i < savedKeycodes.length) {
      const keymap = currentKeymaps[i];
      const savedCode = savedKeycodes[i];
      Object.keys(keymap).forEach((pos) => {
        if (keymap[pos].code !== savedCode[pos]) {
          changes[pos] = KeycodeList.getKeymap(
            savedCode[pos],
            labelLang,
            customKeycodes
          );
        }
      });
    }
    remaps.push(changes);
  }
  return remaps;
}

export function convertJsonDataToEncoderRemaps(
  data: KeymapJsonData,
  currentEncodersKeymaps: IEncoderKeymaps[] | undefined,
  layerCount: number,
  customKeycodes: ICustomKeycode[] | undefined
): {
  [p: number]: {
    clockwise?: IKeymap;
    counterclockwise?: IKeymap;
  };
}[] {
  const labelLang = data.labelLang;
  const savedEncoderKeycodes = data.encoderKeycodes;

  const encodersKeymaps: IEncoderKeymaps[] =
    currentEncodersKeymaps ||
    (new Array(layerCount) as IEncoderKeymaps[]).fill({});

  const remaps: {
    [p: number]: {
      clockwise?: IKeymap;
      counterclockwise?: IKeymap;
    };
  }[] = [];

  for (let i = 0; i < encodersKeymaps.length; i++) {
    const changes: {
      [p: number]: { clockwise?: IKeymap; counterclockwise?: IKeymap };
    } = {};
    if (i < savedEncoderKeycodes.length) {
      const encoderKeymap = encodersKeymaps[i];
      const savedCode = savedEncoderKeycodes[i];
      Object.keys(encoderKeymap).forEach((id) => {
        const numId = Number(id);
        if (!savedCode[numId]) return;
        const hasDiffClockwise =
          encoderKeymap[numId].clockwise!.code !== savedCode[numId].clockwise;
        const hasDiffCounterclockwise =
          encoderKeymap[numId].counterclockwise!.code !==
          savedCode[numId].counterclockwise;
        if (hasDiffClockwise || hasDiffCounterclockwise) {
          changes[numId] = {};
        }
        if (hasDiffClockwise) {
          changes[numId].clockwise = KeycodeList.getKeymap(
            savedCode[numId].clockwise,
            labelLang,
            customKeycodes
          );
        }
        if (hasDiffCounterclockwise) {
          changes[numId].counterclockwise = KeycodeList.getKeymap(
            savedCode[numId].counterclockwise,
            labelLang,
            customKeycodes
          );
        }
      });
    }
    remaps.push(changes);
  }
  return remaps;
}
