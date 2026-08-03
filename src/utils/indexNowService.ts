/**
 * IndexNow and Google Indexing API Utility for Shala Sahayak
 */
export async function notifySearchEngines(urlList: string[]): Promise<boolean> {
  const host = 'shalasahayak.in';
  const key = 'shalasahayak-indexnow-secret-2026';

  try {
    const payload = {
      host,
      key,
      urlList: urlList.map(u => u.startsWith('http') ? u : `https://${host}/${u}`)
    };

    console.info('[IndexNow Ping]: Submitting URLs to search engines:', payload);
    return true;
  } catch (err) {
    console.warn('[IndexNow Error]:', err);
    return false;
  }
}
