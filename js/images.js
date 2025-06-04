// Load images from the img directory
window.PDFImages = [];

const imagePaths = [
  "js/img/a1c.png",
  "js/img/mental_health.png",
  "js/img/movement.png",
  "js/img/sleep.png",
];

imagePaths.map((path) => {
  const img = new Image();
  img.src = path;
  img.onload = function () {
    console.log(`Loaded image: ${path}`);
  };
  window.PDFImages.push(img);
});
