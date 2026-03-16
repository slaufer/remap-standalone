# Remap (Standalone Fork)

> **This is a fork of [remap-keys/remap](https://github.com/remap-keys/remap)**, maintained for personal use with QMK keyboards (primarily Keyball61). It exists because I wanted a guaranteed way to keep editing my keymap without depending on any external service staying online.
>
> **Key differences from upstream:**
>
> - No Firebase, no cloud backend — works fully offline
> - No Google Analytics or telemetry
> - No PayPal / payment features
> - Bundled VIA keyboard definitions — no internet required to recognize connected keyboards
> - Electron desktop app is the primary distribution (no hosted web service)
> - Keymap JSON export/import — back up your full keymap to a file and restore it at any time

# Remap

The product named "Remap" is a keyboard customization app to utilize keyboards more for people who are interested in self-made keyboard kits.

The people can find favorite keyboards and can customize the key mapping and others of the keyboard easily, and their features are available from Web browsers directly.

[Remap Production Site](https://remap-keys.app)

![Screenshot from 2021-03-14 10-28-30](https://user-images.githubusercontent.com/261787/111054447-1bc5f200-84b0-11eb-8bc6-3df9e198d0dd.png)

## Mission

Remap provides information and features to help people who want to leverage a self-made keyboard kit.

## Target Users

People who want to find, buy, build and leverage a self-made keyboard kit.

## Goal

The target users become to be able to find a favorite keyboard, be able to success to build bought keyboard, be able to customize it more easily and freely.

## For Developers

Developers can start a development of Remap locally by the following step:

1. Install NodeJS version 12 or higher.
2. Install `yarn` command with `npm install -g yarn`.
3. Run `yarn install`.
4. Run `yarn start`.
5. Open the `http://localhost:3000` in the Chrome or Edge Stable 89 or higher.

As a limitation, the launched Remap locally cannot access to Firebase backend server. Therefore, the developer needs to import a keyboard definition JSON file from local every times at opening a keyboard.

We're using Prettier to format codes. Execute the `yarn format` before committing and pushing your code. Or, you can use auto-formatting feature with the Prettier for your IDE.

Before contributing, read the [How to become a contributor and submit your own code](https://github.com/remap-keys/remap/blob/main/CONTRIBUTING.md) document.

## Desktop App

Remap is also available as a cross-platform desktop application built with Electron. The desktop app bundles Chromium, so no separate browser installation is required, and WebHID keyboard access is granted automatically without browser permission prompts.

### Installation

Download the latest installer for your platform from the [GitHub Releases page](https://github.com/slaufer/remap-standalone/releases):

- **Windows**: `.exe` (NSIS installer)
- **macOS**: `.dmg`
- **Linux**: `.AppImage`

### Linux: udev rules for WebHID

On Linux, non-root processes need permission to access HID devices. Add a udev rule for your keyboard's USB vendor/product ID:

```bash
# Example: allow all users to access HID devices (adjust VID/PID as needed)
echo 'KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"' \
  | sudo tee /etc/udev/rules.d/99-remap-hid.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
```

Then add your user to the `plugdev` group: `sudo usermod -aG plugdev $USER` (log out and back in to apply).

### Development: running the desktop app locally

```bash
# Install dependencies (first time)
yarn install

# Start Electron app in development mode (connects to Vite dev server)
yarn electron:start

# Build web assets + compile Electron main process
yarn electron:build

# Build and package installers for the current platform
yarn electron:dist
# Output: dist-electron/
```

## Keymap JSON Export / Import

The Configure page includes export and import actions in the keymap toolbar menu. This lets you back up your full keymap to a file and restore it later — useful for keeping a copy of your layout outside of the app.

- **Export JSON**: Downloads a `keymap_<keyboard>.json` file containing all layers, layout options, and encoder mappings for the connected keyboard.
- **Import JSON**: Opens a file picker to load a previously exported keymap file and apply it to the connected keyboard. The app warns you if the file was exported from a different keyboard model, but still lets you proceed.

## References

### WebHID

This software communicates with a keyboard with the WebHID API provided by a Web browser. The specification document of the WebHID API is: [WebHID API - Draft Community Group Report 23 October 2020](https://wicg.github.io/webhid/)

The WebHID has already been available from Google Chrome and Microsoft Edge version 89 stable or higher.

### QMK Firmware

The target of this software is a keyboard with the QMK Firmware. The QMK Firmware provides some features for a VIA client application via the RawHID feature.

- [Raw HID](https://docs.qmk.fm/#/feature_rawhid)

Also, you can find the entry points of the features in the following code:

- [qmk_firmware/via.c at master · qmk/qmk_firmware](https://github.com/qmk/qmk_firmware/blob/master/quantum/via.c#L202)
