export function truncateHtmlText(html: string, maxLength = 100): string {
  if (!html) return '';

  const plainText = html.replace(/<[^>]*>/g, '');

  let decodedText = plainText;

  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = plainText;
    decodedText = textarea.value;
  }

  if (decodedText.length > maxLength) {
    return decodedText.substring(0, maxLength) + '...';
  }

  return decodedText;
}
