/**
 * IndexNow Protocol Utility
 * Submits URL updates to search engines (Bing, Yandex, Seznam, Naver, etc.)
 * to accelerate indexing whenever documents or tool configurations are updated/saved.
 */

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

export const notifyIndexNow = async (urls?: string[]): Promise<boolean> => {
  try {
    const host = window.location.hostname || 'shalasahayak.in';
    const currentUrl = window.location.href;
    const urlList = urls && urls.length > 0 ? urls : [currentUrl];

    // Standard IndexNow API payload
    const payload: IndexNowPayload = {
      host: host,
      key: '4c94b7c25e8346e09e2a87405be91300',
      keyLocation: `https://${host}/4c94b7c25e8346e09e2a87405be91300.txt`,
      urlList: urlList,
    };

    // Send asynchronous request to IndexNow endpoint
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log('IndexNow ping succeeded:', urlList);
      return true;
    } else {
      console.warn('IndexNow ping status:', response.status);
      return false;
    }
  } catch (err) {
    console.info('IndexNow notification attempt completed (offline/preview fallback):', err);
    return false;
  }
};
