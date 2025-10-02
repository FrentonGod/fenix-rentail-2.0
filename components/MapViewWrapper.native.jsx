import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';

export default function MapViewWrapper({ width = 600, height = 450 }) {
  return (
    <MapView
      style={{ width, height }}
      initialRegion={{
        latitude: 18.08122029158371,
        longitude: -96.12200652058925,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{ latitude: 18.08122029158371, longitude: -96.12200652058925 }}
        title="MQerKAcademy"
        description="Ubicación exacta de la academia"
      />
    </MapView>
  );
}
