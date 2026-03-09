/**
 * Runs client-side to reformat all <time> elements using the browser's locale.
 * Each <time> must have a `datetime` attribute with an ISO date string.
 */
export function formatDates() {
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  document.querySelectorAll<HTMLTimeElement>('time[datetime]').forEach(el => {
    const date = new Date(el.getAttribute('datetime')!)
    if (!isNaN(date.getTime())) {
      el.textContent = formatter.format(date)
    }
  })
}
