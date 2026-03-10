import { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import * as Linking from 'expo-linking';

export default function PagoTarjetaStripe() {
  const [amountMXN, setAmountMXN] = useState('499');
  const [concepto, setConcepto] = useState('Inscripción MQerK Academy');
  const [submitting, setSubmitting] = useState(false);
  const redirectTo = (Platform.OS === 'web' && typeof window !== 'undefined')
    ? window.location.origin
    : Linking.createURL('/');

  const amountInt = useMemo(() => {
    const n = parseInt(String(amountMXN).replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) ? Math.max(n, 1) : 1;
  }, [amountMXN]);

  const onCheckout = async () => {
    if (!amountInt) return;
    try {
      setSubmitting(true);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          currency: 'mxn',
          amount: amountInt * 100, // centavos
          description: concepto,
          success_url: `${redirectTo}`,
          cancel_url: `${redirectTo}`,
        },
      });
      if (error) {
        console.error('create-checkout-session error', error);
        return;
      }
      const url = data?.url;
      if (url) {
        if (Platform.OS === 'web') {
          window.location.href = url;
        } else {
          Linking.openURL(url);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-4 py-6">
      <View className="w-full max-w-[520px] bg-white rounded-2xl p-6 shadow-md border border-slate-200">
        <Text className="text-slate-900 text-xl font-extrabold mb-4">Pagar con tarjeta</Text>

        <View className="gap-y-3 mb-4">
          <Text className="text-slate-700 font-semibold">Concepto</Text>
          <TextInput
            value={concepto}
            onChangeText={setConcepto}
            className="border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            placeholder="Descripción del pago"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="gap-y-3 mb-6">
          <Text className="text-slate-700 font-semibold">Monto (MXN)</Text>
          <TextInput
            value={String(amountInt)}
            onChangeText={setAmountMXN}
            keyboardType="numeric"
            className="border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            placeholder="499"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <Pressable
          onPress={onCheckout}
          disabled={submitting}
          className={`rounded-xl py-3.5 items-center ${submitting ? 'bg-violet-400' : 'bg-[#6F09EA]'}`}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
        >
          <Text className="text-white font-bold">{submitting ? 'Creando pago…' : 'Pagar con tarjeta'}</Text>
        </Pressable>

        <Text className="text-slate-500 text-xs mt-3">Serás redirigido a Stripe Checkout de forma segura.</Text>
      </View>
    </View>
  );
}
