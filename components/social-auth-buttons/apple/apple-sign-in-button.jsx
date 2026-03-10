import { Pressable, Text } from 'react-native';

export default function AppleSignInButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="py-3 px-4 bg-black rounded-xl items-center"
    >
      <Text className="text-white font-bold">Continuar con Apple</Text>
    </Pressable>
  );
}
