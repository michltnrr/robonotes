const appScriptUrl = process.env.APP_SCRIPT_URL

export async function applyHeader(documentId, lastName) {
  const response = await fetch(appScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, lastName }),
  });

  if (!response.ok) {
    throw new Error(`Header failed: ${response.status}`);
  }

  const text = await response.text();
  console.log('✅ Header applied:', text);
  return true;
}