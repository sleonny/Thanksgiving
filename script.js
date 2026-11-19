// Small visual cue when a family member's photo hotspot is selected.
document.querySelectorAll('.hotspots a').forEach((link) => {
  link.addEventListener('focus', () => link.querySelector('polygon')?.classList.add('active'));
  link.addEventListener('blur', () => link.querySelector('polygon')?.classList.remove('active'));
});