import Map from "https://cdn.skypack.dev/ol/Map.js";
import View from "https://cdn.skypack.dev/ol/View.js";
import VectorSource from "https://cdn.skypack.dev/ol/source/Vector.js";
import KML from "https://cdn.skypack.dev/ol/format/KML.js";
import {
  Tile as TileLayer,
  Vector as VectorLayer,
} from "https://cdn.skypack.dev/ol/layer.js";
import OSM from "https://cdn.skypack.dev/ol/source/OSM.js";
import {useGeographic} from "https://cdn.skypack.dev/ol/proj";

useGeographic();
const sdBayLonLat = [-117.1441, 32.67];

var kml = new VectorSource({
  url: "/kml/tracks.kml.j2",
  format: new KML(),
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({
      source: kml,
    }),
  ],
  view: new View({
    center: sdBayLonLat,
    zoom: 12,
  }),
});

window.setInterval(eventInterval, 5000);
function eventInterval() {
  kml.refresh();
}

const info = document.getElementById('info');
info.style.pointerEvents = 'none';
const tooltip = new bootstrap.Tooltip(info, {
  animation: false,
  customClass: 'pe-none',
  html: true,
  offset: [0, 5],
  title: '-',
  trigger: 'manual',
});

let currentFeature;
const displayFeatureInfo = function (pixel, target) {
  const feature = target.closest('.ol-control')
    ? undefined
    : map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
  if (feature) {
    info.style.left = pixel[0] + 'px';
    info.style.top = pixel[1] + 'px';
    if (feature !== currentFeature) {
      tooltip.setContent({'.tooltip-inner': feature.get('description')});
    }
    if (currentFeature) {
      tooltip.update();
    } else {
      tooltip.show();
    }
  } else {
    tooltip.hide();
  }
  currentFeature = feature;
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    tooltip.hide();
    currentFeature = undefined;
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel, evt.originalEvent.target);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel, evt.originalEvent.target);
});

map.getTargetElement().addEventListener('pointerleave', function () {
  tooltip.hide();
  currentFeature = undefined;
});
