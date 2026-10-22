export async function loadPresentationFonts(): Promise<void> {
  const requests = [
    ...[500, 600, 700, 800].map(weight => `${weight} 48px "Inter"`),
    '400 120px "Event Display"',
    ...[500, 600, 700].map(weight => `${weight} 30px "Event Sans"`),
    '700 36px "Event Hand"',
  ];
  const faces = await Promise.all(requests.map(face => document.fonts.load(face)));
  if (faces.some(loaded => loaded.length === 0)) throw new Error("A presentation font could not be loaded.");
  await document.fonts.ready;
}
