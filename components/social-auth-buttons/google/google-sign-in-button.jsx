import { Pressable, Text } from 'react-native';

export default function GoogleSignInButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="py-3 px-4 bg-white rounded-xl border border-slate-300 items-center"
    >
      <Text className="text-slate-900 font-bold">Continuar con Google</Text>
    </Pressable>
  );
}
