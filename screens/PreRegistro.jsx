import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useAuthContext } from '../hooks/use-auth-context';
import { supabase } from '../lib/supabase';
import HeaderAdmin from '../components/HeaderAdmin';

export default function PreRegistroScreen() {
  const { session, refreshProfile } = useAuthContext();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onSave = async () => {
    setError('');
    if (!fullName) {
      setError('Ingresa tu nombre.');
      return;
    }
    try {
      setSaving(true);
      const userId = session?.user?.id;
      const email = session?.user?.email ?? null;
      const upsert = {
        id: userId,
        email,
        full_name: fullName,
        phone,
      };
      const { error: upsertErr } = await supabase.from('profiles').upsert(upsert, { onConflict: 'id' });
      if (upsertErr) {
        console.error('Error guardando perfil:', upsertErr);
        setError('No se pudo guardar. Intenta de nuevo.');
        return;
      }
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <HeaderAdmin
        logoSource={require('../assets/MQerK_logo.png')}
        onLogoPress={() => {}}
        title="MQerK Academy"
        showActions={false}
      />

      <View className="flex-1 items-center justify-center px-4 py-6">
  <View className="w-full max-w-[420px] sm:max-w-[560px] bg-white rounded-2xl p-5 shadow-lg border border-slate-200">
          <Text className="text-slate-900 text-2xl font-extrabold mb-1">Pre-registro</Text>
          <Text className="text-slate-600 mb-6">Completa tus datos para continuar</Text>

          <View className="gap-y-3">
            <Text className="text-slate-800 font-bold">Nombre completo</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Tu nombre"
              className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
              placeholderTextColor="#9ca3af"
            />
            <Text className="text-slate-800 font-bold">Teléfono (opcional)</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Ej. 5522334455"
              keyboardType="phone-pad"
              className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
              placeholderTextColor="#9ca3af"
            />
            <Pressable
              onPress={onSave}
              disabled={saving}
              className={`mt-1 rounded-xl py-3.5 items-center ${saving ? 'bg-violet-400' : 'bg-[#6F09EA]'}`}
              hitSlop={10}
              android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            >
              <Text className="text-white font-bold">{saving ? 'Guardando…' : 'Guardar y continuar'}</Text>
            </Pressable>
            {!!error && <Text className="text-red-600 text-sm">{error}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
}
