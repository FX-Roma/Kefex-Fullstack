# Media feature — planned

Current uploads use `middleware/upload.middleware.js` and local `BACKEND/uploads`. Production work: server-side file-signature validation, malware scanning, EXIF policy, derivatives, object storage, CDN, signed access, orphan cleanup and retention/deletion. MongoDB should store asset metadata and object keys, not large binary images.
