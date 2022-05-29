
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select('#app');
  var c = createCanvas(1024, 576);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new dollar());
  gallery.addVisual(new CryptoCandleChart());
  gallery.addVisual(new Fractals());
  gallery.addVisual(new TechDiversityRace());




}

function draw() {
  background(73, 73, 73);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
