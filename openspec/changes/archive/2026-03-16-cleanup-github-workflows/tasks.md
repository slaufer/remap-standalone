## 1. Remove production.yaml

- [x] 1.1 Delete `.github/workflows/production.yaml`

## 2. Clean up desktop-release.yaml

- [x] 2.1 Remove all `REACT_APP_FIREBASE_*` env vars from the build step in `desktop-release.yaml`
- [x] 2.2 Remove the `dist-electron/**/*.deb` line from the artifact upload step in `desktop-release.yaml`

## 3. Clean up pullrequest.yaml

- [x] 3.1 Remove all `REACT_APP_FIREBASE_*`, `REACT_APP_PAYPAL_*`, and `REACT_APP_ERROR_REPORTING_KEY` env vars from the build step in `pullrequest.yaml`
