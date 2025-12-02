import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../../hooks/use-auth-context";
import Svg, { Path } from "react-native-svg";

export default function ScreenConfiguracion() {
  const { session, profile, refreshProfile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Estados del formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");

      // Si tenemos avatar_url en el perfil, la usamos. Si no, construimos la URL por defecto
      // basada en la convención de nombres que establecimos (avatar.jpg)
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      } else if (session?.user?.id) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("PPUser")
          .getPublicUrl(`${session.user.id}/avatar.jpg`);
        // Añadimos timestamp para evitar caché inicial
        setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      }
    }
    if (session?.user) {
      setEmail(session.user.email || "");
    }
  }, [profile, session]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para acceder a tus fotos."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync ({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadAvatar(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        `No se pudo seleccionar la imagen: ${error.message}`
      );
    }
  };
  const uploadAvatar = async (asset) => {
    if (!session?.user?.id) {
      Alert.alert("Error", "No se pudo obtener la información del usuario");
      return;
    }

    try {
      setUploading(true);

      if (!asset.base64) {
        throw new Error("No se pudo obtener el contenido de la imagen");
      }

      const fileExt = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
      // Usamos un nombre fijo para no necesitar guardar la URL en la BD
      const fileName = `avatar.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Convertir base64 a ArrayBuffer
      const fileData = decode(asset.base64);

      // Subir a Supabase Storage (sobrescribiendo si existe)
      const { error: uploadError } = await supabase.storage
        .from("PPUser")
        .upload(filePath, fileData, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública de forma segura
      const { data } = supabase.storage.from("PPUser").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;

      if (!publicUrl) {
        throw new Error("No se pudo obtener la URL pública de la imagen");
      }

      // No actualizamos la BD, solo el estado local
      // Añadimos un timestamp para forzar la recarga de la imagen y evitar caché
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);

      await refreshProfile();
      Alert.alert("Éxito", "Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert(
        "Error",
        `No se pudo subir la foto de perfil: ${error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    if (!session?.user?.id) {
      Alert.alert("Error", "No se pudo obtener la información del usuario");
      return;
    }

    try {
      setLoading(true);

      // Actualizar nombre en profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", session.user.id);

      if (profileError) throw profileError;

      await refreshProfile();
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({ email });

      if (error) throw error;

      Alert.alert(
        "Éxito",
        "Se ha enviado un correo de confirmación a tu nueva dirección de email"
      );
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Error", "No se pudo actualizar el correo electrónico");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Éxito", "Contraseña actualizada correctamente");
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar indicador de carga si no hay sesión
  if (!session) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-slate-600 mt-4">Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="p-6">
        {/* Sección de foto de perfil */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            Foto de Perfil
          </Text>

          <View className="items-center">
            <View className="relative">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-32 h-32 rounded-full border-4 border-indigo-500"
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-indigo-100 items-center justify-center border-4 border-indigo-500">
                  <Svg
                    height="48"
                    viewBox="0 -960 960 960"
                    width="48"
                    fill="#6366f1"
                  >
                    <Path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
                  </Svg>
                </View>
              )}

              {uploading && (
                <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={pickImage}
              disabled={uploading}
              className="mt-4 bg-indigo-600 px-6 py-3 rounded-lg shadow-md shadow-indigo-600/30"
            >
              <Text className="text-white font-bold">
                {uploading ? "Subiendo..." : "Cambiar Foto"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección de información personal */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            Información Personal
          </Text>

          <View className="mb-4">
            <Text className="text-slate-700 text-sm font-semibold mb-2">
              Nombre Completo
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ingresa tu nombre completo"
              className="border border-slate-300 rounded-lg px-4 py-3 text-slate-900 bg-white"
            />
          </View>

          <TouchableOpacity
            onPress={updateProfile}
            disabled={loading}
            className="bg-indigo-600 px-6 py-3 rounded-lg shadow-md shadow-indigo-600/30"
          >
            <Text className="text-white font-bold text-center">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección de correo electrónico */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            Correo Electrónico
          </Text>

          <View className="mb-4">
            <Text className="text-slate-700 text-sm font-semibold mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-slate-300 rounded-lg px-4 py-3 text-slate-900 bg-white"
            />
          </View>

          <TouchableOpacity
            onPress={updateEmail}
            disabled={loading}
            className="bg-indigo-600 px-6 py-3 rounded-lg shadow-md shadow-indigo-600/30"
          >
            <Text className="text-white font-bold text-center">
              {loading ? "Actualizando..." : "Actualizar Email"}
            </Text>
          </TouchableOpacity>

          <Text className="text-slate-500 text-xs mt-2">
            Se enviará un correo de confirmación a tu nueva dirección
          </Text>
        </View>

        {/* Sección de contraseña */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            Cambiar Contraseña
          </Text>

          <View className="mb-4">
            <Text className="text-slate-700 text-sm font-semibold mb-2">
              Nueva Contraseña
            </Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              className="border border-slate-300 rounded-lg px-4 py-3 text-slate-900 bg-white"
            />
          </View>

          <View className="mb-4">
            <Text className="text-slate-700 text-sm font-semibold mb-2">
              Confirmar Contraseña
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repite la nueva contraseña"
              secureTextEntry
              className="border border-slate-300 rounded-lg px-4 py-3 text-slate-900 bg-white"
            />
          </View>

          <TouchableOpacity
            onPress={updatePassword}
            disabled={loading || !newPassword || !confirmPassword}
            className={`px-6 py-3 rounded-lg shadow-md ${
              loading || !newPassword || !confirmPassword
                ? "bg-slate-400"
                : "bg-indigo-600 shadow-indigo-600/30"
            }`}
          >
            <Text className="text-white font-bold text-center">
              {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
