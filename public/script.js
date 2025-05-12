document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const url = document.getElementById('urlInput').value;
  if (!url) return alert('Please enter a URL');
  try {
    const res = await fetch('/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    document.getElementById('markdownOutput').textContent = data.markdown;
    const link = document.getElementById('downloadLink');
    link.href = `/scrapes/${data.fileName}`;
    link.style.display = 'inline-block';
    document.getElementById('result').style.display = 'block';
  } catch (err) {
    alert('Error: ' + err.message);
  }
});
