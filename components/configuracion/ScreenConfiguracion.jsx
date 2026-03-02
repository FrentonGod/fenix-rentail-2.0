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
  Modal,
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
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  // Estados del formulario
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");

      // Si tenemos avatar_url en el perfil, la usamos. Si no, buscamos el archivo en el bucket
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      } else if (session?.user?.id) {
        loadAvatarFromStorage();
      }
    }
    if (session?.user) {
      setEmail(session.user.email || "");
    }
  }, [profile, session]);

  const loadAvatarFromStorage = async () => {
    if (!session?.user?.id) return;

    try {
      console.log("🔍 Buscando avatar para usuario:", session.user.id);

      // Intentar buscar en la carpeta del usuario
      let { data, error } = await supabase.storage
        .from("PPUser")
        .list(session.user.id, {
          limit: 10,
          offset: 0,
        });

      console.log("📁 Archivos en carpeta usuario:", data);

      // Si no hay archivos en la carpeta del usuario, intentar en la raíz
      if (!data || data.length === 0) {
        console.log("🔍 Buscando en raíz del bucket...");
        const rootResult = await supabase.storage.from("PPUser").list("", {
          limit: 50,
          offset: 0,
        });

        console.log("📁 Archivos en raíz:", rootResult.data);
        data = rootResult.data;
        error = rootResult.error;
      }

      console.log("❌ Error al listar:", error);

      if (error) {
        console.error("Error listing files:", error);
        return;
      }

      // Buscar archivo que comience con "avatar" o que contenga el ID del usuario
      const avatarFile = data?.find(
        (file) =>
          file.name.startsWith("avatar.") ||
          file.name.includes(session.user.id),
      );

      console.log("🖼️ Archivo de avatar encontrado:", avatarFile);

      if (avatarFile) {
        // Determinar la ruta correcta
        const filePath = avatarFile.name.includes("/")
          ? avatarFile.name
          : `${session.user.id}/${avatarFile.name}`;

        const {
          data: { publicUrl },
        } = supabase.storage.from("PPUser").getPublicUrl(filePath);

        console.log("🔗 URL pública generada:", publicUrl);

        // Añadimos timestamp para evitar caché
        setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      } else {
        console.log("⚠️ No se encontró archivo de avatar");
        console.log(
          "💡 Archivos disponibles:",
          data?.map((f) => f.name),
        );
      }
    } catch (error) {
      console.error("Error loading avatar:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para acceder a tus fotos.",
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        // Mostrar previsualización inmediata de la imagen local
        setAvatarUrl(result.assets[0].uri);
        // Luego subir la imagen
        await uploadAvatar(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        `No se pudo seleccionar la imagen: ${error.message}`,
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

      console.log("📤 Subiendo avatar:");
      console.log("  - Extensión:", fileExt);
      console.log("  - Nombre archivo:", fileName);
      console.log("  - Ruta completa:", filePath);

      // Convertir base64 a ArrayBuffer
      const fileData = decode(asset.base64);

      // Subir a Supabase Storage (sobrescribiendo si existe)
      const { error: uploadError } = await supabase.storage
        .from("PPUser")
        .upload(filePath, fileData, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Error al subir:", uploadError);
        throw uploadError;
      }

      console.log("✅ Avatar subido exitosamente");

      // Actualizar el campo updated_at en profiles para forzar recarga en AppHeader
      await supabase
        .from("profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", session.user.id);

      // Recargar el avatar desde el storage para obtener la URL correcta
      await loadAvatarFromStorage();

      await refreshProfile();
      Alert.alert("Éxito", "Foto de perfil actualizada correctamente");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert(
        "Error",
        `No se pudo subir la foto de perfil: ${error.message}`,
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

  const deleteAvatar = async () => {
    Alert.alert(
      "Eliminar foto de perfil",
      "¿Estás seguro de que quieres eliminar tu foto de perfil?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setUploading(true);

              // Buscar y eliminar el archivo del bucket
              const { data: files } = await supabase.storage
                .from("PPUser")
                .list(session.user.id);

              const avatarFile = files?.find((file) =>
                file.name.startsWith("avatar."),
              );

              if (avatarFile) {
                const { error } = await supabase.storage
                  .from("PPUser")
                  .remove([`${session.user.id}/${avatarFile.name}`]);

                if (error) throw error;
              }

              // Actualizar el campo updated_at en profiles para forzar recarga en AppHeader
              await supabase
                .from("profiles")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", session.user.id);

              setAvatarUrl("");
              await refreshProfile();
              Alert.alert("Éxito", "Foto de perfil eliminada correctamente");
            } catch (error) {
              console.error("Error deleting avatar:", error);
              Alert.alert("Error", "No se pudo eliminar la foto de perfil");
            } finally {
              setUploading(false);
            }
          },
        },
      ],
    );
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const updateEmail = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({ email });

      if (error) throw error;

      Alert.alert(
        "Éxito",
        "Se ha enviado un correo de confirmación a tu nueva dirección de email",
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
    <View className="flex-1">
      <ScrollView
        className="flex-1 bg-slate-50"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="p-6">
          {/* Sección de foto de perfil */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-200">
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Foto de Perfil
            </Text>

            <View className="items-center">
              <TouchableOpacity
                onPress={() => avatarUrl && setIsPreviewVisible(true)}
                activeOpacity={avatarUrl ? 0.7 : 1}
              >
                <View className="relative">
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      className="w-32 h-32 rounded-full border-4 border-indigo-500"
                    />
                  ) : (
                    <View className="w-32 h-32 rounded-full bg-indigo-500 items-center justify-center border-4 border-indigo-500">
                      <Text className="text-white text-4xl font-bold">
                        {getInitials(fullName)}
                      </Text>
                    </View>
                  )}

                  {uploading && (
                    <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
                      <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                  onPress={pickImage}
                  disabled={uploading}
                  className="bg-indigo-600 px-6 py-3 rounded-lg shadow-md shadow-indigo-600/30"
                >
                  <Text className="text-white font-bold">
                    {uploading
                      ? "Subiendo..."
                      : avatarUrl
                        ? "Cambiar Foto"
                        : "Subir Foto"}
                  </Text>
                </TouchableOpacity>

                {avatarUrl && !uploading && (
                  <TouchableOpacity
                    onPress={deleteAvatar}
                    className="bg-red-600 px-6 py-3 rounded-lg shadow-md shadow-red-600/30"
                  >
                    <Text className="text-white font-bold">Eliminar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Modal de previsualización */}
            <Modal
              visible={isPreviewVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsPreviewVisible(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setIsPreviewVisible(false)}
                className="flex-1 bg-black/90 justify-center items-center"
              >
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-11/12 h-96 rounded-2xl"
                  resizeMode="contain"
                />
                <TouchableOpacity
                  onPress={() => setIsPreviewVisible(false)}
                  className="mt-6 bg-white px-8 py-3 rounded-full"
                >
                  <Text className="text-slate-900 font-bold">Cerrar</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
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
    </View>
  );
}
