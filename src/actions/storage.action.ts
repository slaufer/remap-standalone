import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState, SetupPhase } from '../store/state';
import {
  AppActions,
  KeymapActions,
  KeycodeKeyActions,
  KeydiffActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { HidActions, hidActionsThunk } from './hid.action';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';
import { findByDeviceInfo as findBundledDefinition } from '../services/storage/BundledDefinitions';
import {
  AppliedKeymapData,
  IBuildableFirmware,
  IBuildableFirmwareFile,
  IFirmwareBuildingTask,
  IKeyboardDefinitionDocument,
  IOrganization,
  SavedKeymapData,
} from '../services/storage/Storage';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocuments`;
export const STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT = `${STORAGE_ACTIONS}/UpdateKeyboardDefinitionDocument`;
export const STORAGE_UPDATE_SAVED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateSavedKeymaps`;
export const STORAGE_UPDATE_SHARED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateSharedKeymaps`;
export const STORAGE_UPDATE_APPLIED_KEYMAPS = `${STORAGE_ACTIONS}/UpdateAppliedKeymaps`;
export const STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT = `${STORAGE_ACTIONS}/UpdateSearchResultKeyboardDefinitionDocument`;
export const STORAGE_UPDATE_SAME_AUTHOR_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateSameAuthorKeyboardDefinitionDocuments`;
export const STORAGE_UPDATE_SEARCH_RESULT_ORGANIZATION_MAP = `${STORAGE_ACTIONS}/UpdateSearchResultOrganizationMap`;
export const STORAGE_UPDATE_ORGANIZATION = `${STORAGE_ACTIONS}/UpdateOrganization`;
export const STORAGE_UPDATE_ORGANIZATION_MAP = `${STORAGE_ACTIONS}/UpdateOrganizationMap`;
export const STORAGE_UPDATE_BUILDABLE_FIRMWARE = `${STORAGE_ACTIONS}/UpdateBuildableFirmware`;
export const STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYBOARD_FILES = `${STORAGE_ACTIONS}/UpdateBuildableFirmwareKeyboardFiles`;
export const STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYMAP_FILES = `${STORAGE_ACTIONS}/UpdateBuildableFirmwareKeymapFiles`;
export const STORAGE_UPDATE_FIRMWARE_BUILDING_TASKS = `${STORAGE_ACTIONS}/UpdateFirmwareBuildingTasks`;
export const STORAGE_UPDATE_APPROVED_KEYBOARD_DEFINITION_DOCUMENTS = `${STORAGE_ACTIONS}/UpdateApprovedKeyboardDefinitionDocuments`;
export const StorageActions = {
  updateKeyboardDefinition: (keyboardDefinition: any) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
  updateKeyboardDefinitionDocuments: (
    keyboardDefinitionDocuments: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENTS,
      value: keyboardDefinitionDocuments,
    };
  },
  updateKeyboardDefinitionDocument: (
    keyboardDefinitionDocument: IKeyboardDefinitionDocument
  ) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT,
      value: keyboardDefinitionDocument,
    };
  },
  clearKeyboardDefinitionDocument: () => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION_DOCUMENT,
      value: null,
    };
  },
  updateSavedKeymaps: (keymaps: SavedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_SAVED_KEYMAPS,
      value: keymaps,
    };
  },
  updateSharedKeymaps: (keymaps: SavedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_SHARED_KEYMAPS,
      value: keymaps,
    };
  },
  updateAppliedKeymaps: (keymaps: AppliedKeymapData[]) => {
    return {
      type: STORAGE_UPDATE_APPLIED_KEYMAPS,
      value: keymaps,
    };
  },
  updateSearchResultKeyboardDefinitionDocument: (
    definitions: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_SEARCH_RESULT_KEYBOARD_DEFINITION_DOCUMENT,
      value: definitions,
    };
  },
  updateSameAuthorKeyboardDefinitionDocuments: (
    definitions: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_SAME_AUTHOR_KEYBOARD_DEFINITION_DOCUMENTS,
      value: definitions,
    };
  },
  updateSearchResultOrganizationMap: (
    organizationMap: Record<string, IOrganization>
  ) => {
    return {
      type: STORAGE_UPDATE_SEARCH_RESULT_ORGANIZATION_MAP,
      value: organizationMap,
    };
  },
  updateOrganization: (organization: IOrganization) => {
    return {
      type: STORAGE_UPDATE_ORGANIZATION,
      value: organization,
    };
  },
  updateOrganizationMap: (organizationMap: Record<string, IOrganization>) => {
    return {
      type: STORAGE_UPDATE_ORGANIZATION_MAP,
      value: organizationMap,
    };
  },
  updateBuildableFirmware: (buildableFirmware: IBuildableFirmware | null) => {
    return {
      type: STORAGE_UPDATE_BUILDABLE_FIRMWARE,
      value: buildableFirmware,
    };
  },
  updateBuildableFirmwareKeyboardFiles: (
    buildableFirmwareKeyboardFiles: IBuildableFirmwareFile[]
  ) => {
    return {
      type: STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYBOARD_FILES,
      value: buildableFirmwareKeyboardFiles,
    };
  },
  updateBuildableFirmwareKeymapFiles: (
    buildableFirmwareKeymapFiles: IBuildableFirmwareFile[]
  ) => {
    return {
      type: STORAGE_UPDATE_BUILDABLE_FIRMWARE_KEYMAP_FILES,
      value: buildableFirmwareKeymapFiles,
    };
  },
  updateFirmwareBuildingTasks: (tasks: IFirmwareBuildingTask[]) => {
    return {
      type: STORAGE_UPDATE_FIRMWARE_BUILDING_TASKS,
      value: tasks,
    };
  },
  updateApprovedKeyboardDefinitionDocumentss: (
    keyboardsDefinitions: IKeyboardDefinitionDocument[]
  ) => {
    return {
      type: STORAGE_UPDATE_APPROVED_KEYBOARD_DEFINITION_DOCUMENTS,
      value: keyboardsDefinitions,
    };
  },
};

type ActionTypes = ReturnType<
  | (typeof AppActions)[keyof typeof AppActions]
  | (typeof KeymapActions)[keyof typeof KeymapActions]
  | (typeof KeycodeKeyActions)[keyof typeof KeycodeKeyActions]
  | (typeof KeydiffActions)[keyof typeof KeydiffActions]
  | (typeof HidActions)[keyof typeof HidActions]
  | (typeof NotificationActions)[keyof typeof NotificationActions]
  | (typeof StorageActions)[keyof typeof StorageActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const storageActionsThunk = {
  // eslint-disable-next-line no-undef
  refreshKeyboardDefinition:
    (keyboardDefinition: KeyboardDefinitionSchema): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { entities } = getState();
      dispatch(
        LayoutOptionsActions.initSelectedOptions(
          keyboardDefinition.layouts.labels
            ? keyboardDefinition.layouts.labels
            : []
        )
      );
      dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
      await dispatch(hidActionsThunk.refreshKeymaps());
      dispatch(AppActions.remapsInit(entities.device.layerCount));
      dispatch(AppActions.encodersRemapsInit(entities.device.layerCount));
      dispatch(KeydiffActions.clearKeydiff());
      dispatch(KeycodeKeyActions.clear());
      dispatch(KeymapActions.clearSelectedKeyPosition());
    },

  // eslint-disable-next-line no-undef
  uploadKeyboardDefinition:
    (keyboardDefinition: KeyboardDefinitionSchema): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      _getState: () => RootState
    ) => {
      dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
      dispatch(
        LayoutOptionsActions.initSelectedOptions(
          keyboardDefinition.layouts.labels
            ? keyboardDefinition.layouts.labels
            : []
        )
      );
      dispatch(hidActionsThunk.openKeyboard());
    },

  fetchKeyboardDefinitionByDeviceInfo:
    (
      vendorId: number,
      productId: number,
      // eslint-disable-next-line no-unused-vars
      _productName: string
    ): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      _getState: () => RootState
    ) => {
      const bundled = await findBundledDefinition(vendorId, productId);
      if (bundled) {
        await dispatch(storageActionsThunk.uploadKeyboardDefinition(bundled));
      } else {
        dispatch(
          AppActions.updateSetupPhase(
            SetupPhase.waitingKeyboardDefinitionUpload
          )
        );
      }
    },
};
