import { NotificationItem } from '../actions/actions';
import { Key } from '../components/configure/keycodekey/KeyGen';
import { IEncoderKeymaps, IHid, IKeyboard, IKeymap } from '../services/hid/Hid';
import { WebHid } from '../services/hid/WebHid';
import {
  AppliedKeymapData,
  IBuildableFirmware,
  IBuildableFirmwareFile,
  IFirmware,
  IFirmwareBuildingTask,
  IKeyboardDefinitionDocument,
  IOrganization,
  SavedKeymapData,
} from '../services/storage/Storage';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import buildInfo from '../assets/files/build-info.json';
import {
  getDefaultCategory,
  PracticeCategoryId,
} from '../services/practice/PracticeTexts';
import {
  KeyboardLabelLang,
  KEY_LABEL_LANGS,
} from '../services/labellang/KeyLabelLangs';
import { LayoutOption } from '../components/configure/keymap/Keymap';
import { IMacro, IMacroBuffer, MacroKey } from '../services/macro/Macro';
import { IFirmwareWriter } from '../services/firmware/FirmwareWriter';
import { FirmwareWriterWebApiImpl } from '../services/firmware/FirmwareWriterWebApiImpl';
import { IBootloaderType } from '../services/firmware/Types';

export type ISetupPhase =
  | 'init'
  | 'keyboardNotSelected'
  | 'connectingKeyboard'
  | 'fetchingKeyboardDefinition'
  | 'waitingKeyboardDefinitionUpload'
  | 'openingKeyboard'
  | 'openedKeyboard';
export const SetupPhase: { [p: string]: ISetupPhase } = {
  init: 'init',
  keyboardNotSelected: 'keyboardNotSelected',
  connectingKeyboard: 'connectingKeyboard',
  fetchingKeyboardDefinition: 'fetchingKeyboardDefinition',
  waitingKeyboardDefinitionUpload: 'waitingKeyboardDefinitionUpload',
  openingKeyboard: 'openingKeyboard',
  openedKeyboard: 'openedKeyboard',
};

/**
 * A single character's typing statistics.
 */
export interface ITypingCharStats {
  correct: number;
  incorrect: number;
}

/**
 * Typing statistics for a specific keyboard.
 * The key is the character (e.g., 'a', 'b', 'c').
 */
export type ITypingStatsPerKeyboard = Record<string, ITypingCharStats>;

/**
 * Typing statistics for all keyboards.
 * The key is the keyboard definition document ID.
 */
export type ITypingStats = Record<string, ITypingStatsPerKeyboard>;

export type ITypingPracticeStatus = 'idle' | 'running' | 'finished';

export type ITypingPracticeError = {
  index: number;
  expected: string;
  actual: string;
};

export type ITypingPracticeStats = {
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  startTime: number | null;
  endTime: number | null;
  cps: number;
  accuracy: number;
};

export const ALL_FLASH_FIRMWARE_DIALOG_MODE = [
  'instruction',
  'flashing',
  'loading',
] as const;
type flashFirmwareDialogModeTuple = typeof ALL_FLASH_FIRMWARE_DIALOG_MODE;
export type IFlashFirmwareDialogMode = flashFirmwareDialogModeTuple[number];

export type IFlashFirmwareDialogFlashMode =
  | 'upload_and_flash'
  | 'fetch_and_flash'
  | 'build_and_flash';

const KeySwitchOperations = {
  click: 'click',
  cw: 'cw',
  ccw: 'ccw',
} as const;
export type IKeySwitchOperation =
  (typeof KeySwitchOperations)[keyof typeof KeySwitchOperations];

export type IUserInformation = {
  uid: string;
  currentProjectId: string | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserPurchase = {
  uid: string;
  remainingBuildCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type RootState = {
  entities: {
    device: {
      vendorId: number;
      productId: number;
      name: string | null;
      layerCount: number;
      keymaps: {
        [pos: string]: IKeymap;
      }[];
      macros: {
        [id: number]: string;
      };
      bleMicroPro: boolean;
      macro: {
        bufferBytes: Uint8Array;
        maxBufferSize: number;
        maxCount: number;
      };
      viaProtocolVersion: number;
      encodersKeymaps: IEncoderKeymaps[];
    };
    keyboards: IKeyboard[]; // authorized keyboard list
    keyboard: IKeyboard | null;
    keyboardDefinition: KeyboardDefinitionSchema | null;
    keyboardDefinitionDocuments: IKeyboardDefinitionDocument[];
    keyboardDefinitionDocument: IKeyboardDefinitionDocument | null;
    savedKeymaps: SavedKeymapData[];
    sharedKeymaps: SavedKeymapData[];
    appliedKeymaps: AppliedKeymapData[];
    searchResultKeyboardDocuments: IKeyboardDefinitionDocument[];
    searchResultOrganizationMap: Record<string, IOrganization>;
    sameAuthorKeyboardDocuments: IKeyboardDefinitionDocument[];
    organization: IOrganization | null;
    organizationMap: Record<string, IOrganization>;
    buildableFirmware: IBuildableFirmware | null;
    buildableFirmwareKeyboardFiles: IBuildableFirmwareFile[];
    buildableFirmwareKeymapFiles: IBuildableFirmwareFile[];
    firmwareBuildingTasks: IFirmwareBuildingTask[];
    approvedKeyboardDefinitionDocuments: IKeyboardDefinitionDocument[];
  };
  app: {
    package: {
      name: string;
      version: string;
    };
    buildNumber: number;
    setupPhase: ISetupPhase;
    remaps: {
      // remap candidates and show keydiff for clickable keys
      [pos: string]: IKeymap;
    }[];
    encodersRemaps: {
      // remap candidates and show keydiff for encoders
      [id: number]: {
        clockwise?: IKeymap;
        counterclockwise?: IKeymap;
      };
    }[];
    testedMatrix: string[]; // 'row,col' string list which are pressed keys in TEST MATRIX MODE
    currentTestMatrix: string[]; // 'row,col' string list which are pressed down keys currently in TEST MATRIX MODE
    notifications: NotificationItem[];
    keyboardHeight: number;
    keyboardWidth: number;
    labelLang: KeyboardLabelLang;
    signedIn: boolean;
    meta: {
      title: string;
      description: string;
      og: {
        url: string;
        title: string;
        description: string;
        image: string;
      };
    };
    localAuthenticationInfo: {
      uid: string;
    };
    autoTypingPracticeAfterConnection: boolean;
    user: {
      information: IUserInformation | undefined;
      purchase: IUserPurchase | undefined;
    };
  };
  configure: {
    header: {
      flashing: boolean;
    };
    keymap: {
      selectedPos: string;
      selectedLayer: number;
      selectedEncoderId: number | null;
      selectedKeySwitchOperation: IKeySwitchOperation;
    };
    keymapToolbar: {
      testMatrix: boolean;
      typingPractice: boolean;
    };
    keycodes: {
      keys: { [category: string]: Key[] };
    };
    keycodeKey: {
      selectedKey: Key | null;
      hoverKey: Key | null;
      draggingKey: Key | null;
    };
    keydiff: {
      origin: IKeymap | null;
      destination: IKeymap | null;
    };
    layoutOptions: {
      selectedOptions: LayoutOption[];
    };
    macroEditor: {
      key: Key | null;
      keys: Key[];
      macroBuffer: IMacroBuffer | null;
      macro: IMacro | null;
      macroKeys: MacroKey[];
    };
    practice: {
      currentCategory: PracticeCategoryId;
      sentences: string[];
      currentSentenceIndex: number;
      currentText: string;
      userInput: string;
      currentIndex: number;
      errors: ITypingPracticeError[];
      stats: ITypingPracticeStats;
      accumulatedCorrectChars: number;
      accumulatedIncorrectChars: number;
      status: ITypingPracticeStatus;
    };
    typingStats: ITypingStats;
  };
  common: {
    firmware: {
      flashFirmwareDialog: {
        keyboardName: string;
        firmware: IFirmware | null;
        flashing: boolean;
        progressRate: number;
        logs: string[];
        mode: IFlashFirmwareDialogMode;
        bootloaderType: IBootloaderType;
        flashMode: IFlashFirmwareDialogFlashMode;
        buildingFirmwareTask: IFirmwareBuildingTask | null;
        firmwareBlob: Buffer | undefined;
      };
      uploadFirmwareDialog: {
        open: boolean;
        firmwareFileBuffer: ArrayBuffer | undefined;
      };
    };
  };
  hid: {
    instance: IHid;
  };
  serial: {
    writer: IFirmwareWriter;
  };
};

const firmwareWriter = new FirmwareWriterWebApiImpl();

export const INIT_STATE: RootState = {
  entities: {
    device: {
      vendorId: NaN,
      productId: NaN,
      name: null,
      layerCount: NaN,
      keymaps: [],
      macros: {},
      bleMicroPro: false,
      macro: {
        bufferBytes: new Uint8Array(),
        maxBufferSize: 0,
        maxCount: 0,
      },
      viaProtocolVersion: NaN,
      encodersKeymaps: [],
    },
    keyboards: [],
    keyboard: null, // hid.keyboards[i]
    keyboardDefinition: null,
    keyboardDefinitionDocuments: [],
    keyboardDefinitionDocument: null,
    savedKeymaps: [],
    sharedKeymaps: [],
    appliedKeymaps: [],
    searchResultKeyboardDocuments: [],
    searchResultOrganizationMap: {},
    sameAuthorKeyboardDocuments: [],
    organization: null,
    organizationMap: {},
    buildableFirmware: null,
    buildableFirmwareKeyboardFiles: [],
    buildableFirmwareKeymapFiles: [],
    firmwareBuildingTasks: [],
    approvedKeyboardDefinitionDocuments: [],
  },
  app: {
    package: {
      name: '',
      version: '',
    },
    buildNumber: buildInfo.buildNumber,
    setupPhase: SetupPhase.init,
    remaps: [],
    encodersRemaps: [],
    testedMatrix: [],
    currentTestMatrix: [],
    notifications: [],
    keyboardHeight: 0,
    keyboardWidth: 0,
    labelLang: (() => {
      const defaultKeyLabel = 'en-us';
      const storageValue = localStorage.getItem('LabelLang');
      if (storageValue === null) {
        return defaultKeyLabel;
      }
      const keyLabelLang = KEY_LABEL_LANGS.find(
        (v) => v.labelLang == storageValue
      );
      if (keyLabelLang == undefined) {
        return defaultKeyLabel;
      }
      return keyLabelLang.labelLang;
    })(),
    signedIn: false,
    meta: {
      title: '',
      description: '',
      og: {
        title: '',
        url: '',
        description: '',
        image: '',
      },
    },
    localAuthenticationInfo: {
      uid: '',
    },
    autoTypingPracticeAfterConnection: false,
    user: {
      information: undefined,
      purchase: undefined,
    },
  },
  configure: {
    header: {
      flashing: false,
    },
    keymap: {
      selectedLayer: NaN,
      selectedPos: '',
      selectedEncoderId: null,
      selectedKeySwitchOperation: 'click',
    },
    keymapToolbar: {
      testMatrix: false,
      typingPractice: false,
    },
    keycodes: {
      keys: {},
    },
    keycodeKey: {
      selectedKey: null,
      hoverKey: null,
      draggingKey: null,
    },
    keydiff: {
      origin: null,
      destination: null,
    },
    layoutOptions: {
      selectedOptions: [],
    },
    macroEditor: {
      key: null,
      keys: [],
      macroBuffer: null,
      macro: null,
      macroKeys: [],
    },
    practice: {
      currentCategory: getDefaultCategory().id,
      sentences: [],
      currentSentenceIndex: 0,
      currentText: '',
      userInput: '',
      currentIndex: 0,
      errors: [],
      stats: {
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        startTime: null,
        endTime: null,
        cps: 0,
        accuracy: 100,
      },
      accumulatedCorrectChars: 0,
      accumulatedIncorrectChars: 0,
      status: 'idle',
    },
    typingStats: {},
  },
  common: {
    firmware: {
      flashFirmwareDialog: {
        keyboardName: '',
        firmware: null,
        flashing: false,
        progressRate: 0,
        logs: [''],
        mode: 'instruction',
        bootloaderType: 'caterina',
        flashMode: 'fetch_and_flash',
        buildingFirmwareTask: null,
        firmwareBlob: undefined,
      },
      uploadFirmwareDialog: {
        open: false,
        firmwareFileBuffer: undefined,
      },
    },
  },
  hid: {
    instance: new WebHid(),
  },
  serial: {
    writer: firmwareWriter,
  },
};
