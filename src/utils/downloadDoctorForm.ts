import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { API_URL } from './constant';

export const DOCTOR_FORM_URL = 'https://lb50health.com/Physician_Approval_V2.pdf';
export const DOCTOR_FORM_FILENAME = 'Physician_Approval_V2.pdf';

export type DownloadDoctorFormResult =
  | { success: true; message: string }
  | { success: false; message: string };

function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const base = pathname.split('/').filter(Boolean).pop();
    if (base && base.includes('.')) {
      return decodeURIComponent(base);
    }
  } catch {
    // fall through
  }
  return DOCTOR_FORM_FILENAME;
}

function resolveDownloadUrl(url?: string): string {
  const trimmed = url?.trim();
  if (!trimmed) {
    return DOCTOR_FORM_URL;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  const apiBase = API_URL.replace(/\/api\/?$/, '');
  const bases = [apiBase, DOCTOR_FORM_URL];
  for (const base of bases) {
    try {
      return new URL(trimmed, base.endsWith('/') ? base : `${base}/`).href;
    } catch {
      // try next base
    }
  }

  return DOCTOR_FORM_URL;
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'webp':
      return 'image/webp';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

function getAndroidSdkVersion(): number {
  return typeof Platform.Version === 'number' ? Platform.Version : 0;
}

async function openIosDownloadedFile(filePath: string): Promise<void> {
  try {
    await ReactNativeBlobUtil.ios.presentOpenInMenu(filePath);
    return;
  } catch {
    // Fall through to preview / options menu.
  }

  try {
    await ReactNativeBlobUtil.ios.openDocument(filePath);
    return;
  } catch {
    // Fall through.
  }

  try {
    await ReactNativeBlobUtil.ios.presentOptionsMenu(filePath);
  } catch {
    // File is still saved under the app Documents folder.
  }
}

function isSuccessfulHttpStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

async function saveFileToAndroidDownloads(
  sourcePath: string,
  filename: string,
  mime: string,
): Promise<string> {
  const androidSdk = getAndroidSdkVersion();

  if (androidSdk >= 29) {
    return ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: filename,
        parentFolder: '',
        mimeType: mime,
      },
      'Download',
      sourcePath,
    );
  }

  const { LegacyDownloadDir } = ReactNativeBlobUtil.fs.dirs;
  const destPath = `${LegacyDownloadDir}/${filename}`;
  await ReactNativeBlobUtil.fs.cp(sourcePath, destPath);
  await ReactNativeBlobUtil.fs.scanFile([{ path: destPath, mime }]);
  return destPath;
}

export async function downloadDoctorForm(
  url?: string,
): Promise<DownloadDoctorFormResult> {
  const downloadUrl = resolveDownloadUrl(url);
  const filename = getFilenameFromUrl(downloadUrl);
  const mime = getMimeType(filename);

  try {
    if (Platform.OS === 'android') {
      const cachePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${filename}`;
      const response = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: cachePath,
        overwrite: true,
      }).fetch('GET', downloadUrl);

      const status = response.info().status;
      if (!isSuccessfulHttpStatus(status)) {
        return {
          success: false,
          message: 'Failed to download the doctor form. Please try again.',
        };
      }

      const sourcePath = response.path();
      const savedPath = await saveFileToAndroidDownloads(
        sourcePath,
        filename,
        mime,
      );

      try {
        await ReactNativeBlobUtil.fs.unlink(sourcePath);
      } catch {
        // Best-effort cache cleanup.
      }

      try {
        await ReactNativeBlobUtil.android.actionViewIntent(savedPath, mime);
      } catch {
        // Opening is best-effort; the file is still in Downloads.
      }

      return {
        success: true,
        message: `Saved to Downloads as ${filename}. Open Files → Downloads to view the file.`,
      };
    }

    const path = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${filename}`;
    const response = await ReactNativeBlobUtil.config({
      fileCache: true,
      path,
      overwrite: true,
    }).fetch('GET', downloadUrl);

    const status = response.info().status;
    if (!isSuccessfulHttpStatus(status)) {
      return {
        success: false,
        message: 'Failed to download the doctor form. Please try again.',
      };
    }

    const filePath = response.path();
    await openIosDownloadedFile(filePath);

    return {
      success: true,
      message:
        'Form downloaded. In the menu, choose Save to Files (or another app) to keep a copy. Until then it stays inside LB50 only.',
    };
  } catch {
    return {
      success: false,
      message: 'Failed to download the doctor form. Please try again.',
    };
  }
}
