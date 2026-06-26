import * as THREE from "three";

export const GLOBE_RADIUS = 2.2;

export const HOME_CAMERA_POSITION = new THREE.Vector3(0, 0.5, 6.2);
export const HOME_TARGET = new THREE.Vector3(0, 0, 0);

export const FOCUS_CAMERA_DISTANCE = GLOBE_RADIUS + 2.0;

export function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function hotspotCameraVectors(lat: number, lng: number) {
  const surface = latLngToVector3(lat, lng, GLOBE_RADIUS);
  const camera = surface.clone().normalize().multiplyScalar(FOCUS_CAMERA_DISTANCE);
  return { surface, camera };
}
