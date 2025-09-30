import { View } from 'react-native';

export default function MapViewWrapper({ width = 600, height = 450 }) {
  return (
    <View style={{ width, height }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d237.04951234566224!2d-96.1219307!3d18.0811722!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c3e79a1075bcad%3A0x54b80ec3131030de!2sMQerKAcademy!5e0!3m2!1ses!2smx!4v1758650715785!5m2!1ses!2smx"
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa MQerKAcademy"
      />
    </View>
  );
}
