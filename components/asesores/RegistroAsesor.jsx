import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { supabase } from "../../lib/supabase";
import Svg, { Path } from "react-native-svg";

// Input compacto con label y error inline
function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoComplete,
  secureTextEntry,
  error,
  autoCorrect,
  textContentType,
  ...rest
}) {
  return (
    <View className="w-full">
      <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
        placeholderTextColor="#9ca3af"
        className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white"
        {...rest}
      />
      {!!error && <Text className="text-red-600 text-xs mt-1">{error}</Text>}
    </View>
  );
}

export default function RegistroAsesor({ asesorToEdit, onFormClose }) {
  const { width, height } = useWindowDimensions();
  const isSmall = width < 640;
  const isTablet = width >= 640 && width < 1024;
  // Anclar el contenido arriba; en tablets solo damos un poco más de padding top
  const contentStyle = {
    padding: 16,
    paddingBottom: 28,
    ...(isTablet ? { paddingTop: 24 } : {}),
  };
  // Medir el alto del bloque de título y centrar SOLO el formulario en tablets
  const [titleHeight, setTitleHeight] = useState(0);
  const formWrapStyle = isTablet
    ? {
        minHeight: Math.max(
          0,
          height - titleHeight - 16 /*pt*/ - 28 /*pb*/ - 24 /*mt form*/
        ),
      }
    : null;

  const initialFormState = {
    nombre_asesor: "",
    correo_asesor: "",
    telefono_asesor: "",
    direccion_asesor: "",
    municipio_asesor: "",
    rfc_asesor: "",
    nacionalidad_asesor: "",
    genero_asesor: "",
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    // Si recibimos un asesor para editar, llenamos el formulario
    if (asesorToEdit) {
      setForm({ ...initialFormState, ...asesorToEdit });
    }
  }, [asesorToEdit]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [genderOpen, setGenderOpen] = useState(false);
  const genderAnchorRef = useRef(null);
  const [genderMenuPos, setGenderMenuPos] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  // --- Referencias para el scroll automático ---
  const scrollViewRef = useRef(null);
  const activeInputRef = useRef(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  // Helpers de validación
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneDigits = (v) => v.replace(/\D+/g, "");
  const onlyLettersSpaces = (v) =>
    /^(?=.{2,100}$)[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\.\s]+$/.test(v.trim());
  // RFC personas y morales MX
  const rfcRe =
    /^([A-Z&Ñ]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{3}$/;

  const validateRFC = (rfc, nacionalidad) => {
    if (!rfc && String(nacionalidad).toLowerCase() === "mexicana")
      return "RFC requerido para nacionalidad mexicana";
    if (!rfc) return "";
    const upper = rfc.toUpperCase();
    if (!rfcRe.test(upper)) return "RFC inválido";
    return "";
  };

  const validators = useMemo(
    () => ({
      nombre_asesor: (v) =>
        !v.trim()
          ? "Ingresa el nombre"
          : !onlyLettersSpaces(v)
            ? "Solo letras y espacios"
            : "",
      correo_asesor: (v) =>
        !v.trim()
          ? "Ingresa el correo"
          : emailRe.test(v.trim())
            ? ""
            : "Correo inválido",
      telefono_asesor: (v) => {
        const d = phoneDigits(v);
        if (!d) return "Ingresa el teléfono";
        return d.length === 10 ? "" : "Teléfono debe tener 10 dígitos";
      },
      direccion_asesor: (v) =>
        v && v.trim().length < 5 ? "Dirección demasiado corta" : "",
      municipio_asesor: (v) =>
        v && !onlyLettersSpaces(v) ? "Usa solo letras y espacios" : "",
      rfc_asesor: (v, all) => validateRFC(v, all.nacionalidad_asesor),
      nacionalidad_asesor: (v) =>
        v && !onlyLettersSpaces(v) ? "Usa solo letras y espacios" : "",
      genero_asesor: (v) => (!v ? "Selecciona el género" : ""),
    }),
    []
  );

  const validateField = async (key, valueOverride) => {
    const value = valueOverride ?? form[key];
    const fn = validators[key];
    if (!fn) return true;
    const msg = fn(value, form);
    setFieldErrors((e) => ({ ...e, [key]: msg }));
    // chequeo de duplicado para correo al salir del campo
    if (key === "correo_asesor" && !msg) {
      const email = String(value).trim().toLowerCase();
      if (emailRe.test(email)) {
        let query = supabase
          .from("asesores")
          .select("id_asesor", { count: "exact", head: true })
          .eq("correo_asesor", email);
        // Si estamos editando, excluimos el ID del asesor actual de la búsqueda de duplicados
        if (asesorToEdit?.id_asesor) {
          query = query.not("id_asesor", "eq", asesorToEdit.id_asesor);
        }
        const { count } = await query;
        if ((count ?? 0) > 0) {
          setFieldErrors((e) => ({
            ...e,
            correo_asesor: "Este correo ya está registrado",
          }));
          return false;
        }
      }
    }
    return !msg;
  };

  const validateAll = () => {
    const errs = {};
    Object.entries(validators).forEach(([k, fn]) => {
      const e = fn(form[k] ?? "");
      if (e) errs[k] = e;
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async () => {
    setToast({ type: "", msg: "" });
    if (!validateAll()) return;
    try {
      setSaving(true);
      const email = form.correo_asesor.trim().toLowerCase();

      // Chequeo de duplicado (similar a la validación de campo)
      let dupQuery = supabase
        .from("asesores")
        .select("id_asesor", { count: "exact", head: true })
        .eq("correo_asesor", email);
      if (asesorToEdit?.id_asesor) {
        dupQuery = dupQuery.not("id_asesor", "eq", asesorToEdit.id_asesor);
      }
      const { count: dupCount } = await dupQuery;
      if ((dupCount ?? 0) > 0) {
        setFieldErrors((e) => ({
          ...e,
          correo_asesor: "Este correo ya está registrado",
        }));
        return;
      }
      const payload = {
        nombre_asesor: form.nombre_asesor.trim(),
        correo_asesor: email,
        telefono_asesor: phoneDigits(form.telefono_asesor.trim()),
        direccion_asesor: form.direccion_asesor.trim() || null,
        municipio_asesor: form.municipio_asesor.trim() || null,
        rfc_asesor: form.rfc_asesor.trim().toUpperCase() || null,
        nacionalidad_asesor: form.nacionalidad_asesor.trim() || null,
        genero_asesor: form.genero_asesor,
      };

      let result;
      if (asesorToEdit) {
        // Modo Edición
        result = await supabase
          .from("asesores")
          .update(payload)
          .eq("id_asesor", asesorToEdit.id_asesor);
      } else {
        // Modo Creación
        result = await supabase.from("asesores").insert(payload);
      }

      if (result.error) {
        console.error("Save error", result.error);
        setToast({
          type: "error",
          msg: "No se pudo guardar. Intenta de nuevo.",
        });
        return;
      }

      setToast({
        type: "ok",
        msg: `Asesor ${asesorToEdit ? "actualizado" : "registrado"} correctamente.`,
      });
      setForm(initialFormState);
      setFieldErrors({});
      // Si el guardado fue exitoso y hay una función para cerrar, la llamamos después de un momento
      if (onFormClose) setTimeout(() => onFormClose(), 1500);
    } finally {
      setSaving(false);
    }
  };

  const handleInputFocus = (event) => {
    // Guardamos una referencia al input que tiene el foco
    activeInputRef.current = event.nativeEvent.target;
  };

  const handleKeyboardShow = () => {
    // Cuando el teclado aparece, medimos la posición del input activo y hacemos scroll
    activeInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
      scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
    });
  };

  const disabled = saving;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      keyboardVerticalOffset={Platform.OS === "android" ? 30 : 0}
    >
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerStyle={contentStyle}
        keyboardShouldPersistTaps="handled"
      >
        {/* Título en el contenedor principal (sin card que limite el diseño) */}
        <View
          className="max-w-6xl self-start"
          onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)}
        >
          {onFormClose && (
            <TouchableOpacity
              onPress={onFormClose}
              className="flex-row items-center mb-4 opacity-80"
            >
              <Svg
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="#475569"
              >
                <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </Svg>
              <Text className="text-slate-600 font-bold ml-1">
                Volver a la lista
              </Text>
            </TouchableOpacity>
          )}
          <Text className="text-slate-900 text-2xl font-extrabold">
            {asesorToEdit ? "Editar Asesor" : "Registro de Asesores"}
          </Text>
          <Text className="text-slate-600">
            {asesorToEdit
              ? "Modifica los datos del asesor."
              : "Completa los siguientes campos."}
          </Text>
        </View>

        {/* Bloque del formulario centrado en tablets */}
        <View
          className="flex-1 max-w-6xl self-center mt-4"
          style={formWrapStyle}
        >
          {/* Grid 2 columnas */}
          <View className="flex-row flex-wrap gap-4">
            <View style={[styles.half, isSmall && { width: "100%" }]}>
              <LabeledInput
                label="Nombre completo"
                value={form.nombre_asesor}
                onChangeText={(v) => {
                  set("nombre_asesor")(v);
                }}
                onFocus={handleInputFocus}
                onEndEditing={() => validateField("nombre_asesor")}
                placeholder="Juan Pérez"
                autoCorrect={false}
                autoCapitalize={"words"}
                error={fieldErrors.nombre_asesor}
              />
            </View>
            <View style={[styles.half, isSmall && { width: "100%" }]}>
              <LabeledInput
                label="Correo"
                value={form.correo_asesor}
                onChangeText={(v) => {
                  set("correo_asesor")(v);
                }}
                onFocus={handleInputFocus}
                onEndEditing={() => validateField("correo_asesor")}
                placeholder="asesor@dominio.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                error={fieldErrors.correo_asesor}
              />
            </View>
            <View style={[styles.half, isSmall && { width: "100%" }]}>
              <LabeledInput
                label="Teléfono"
                value={form.telefono_asesor}
                onChangeText={(v) => {
                  set("telefono_asesor")(phoneDigits(v));
                }}
                onFocus={handleInputFocus}
                onEndEditing={() => validateField("telefono_asesor")}
                placeholder="5522334455"
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                error={fieldErrors.telefono_asesor}
              />
            </View>
            <View style={[styles.half, isSmall && { width: "100%" }]}>
              <LabeledInput
                label="Dirección"
                value={form.direccion_asesor}
                onChangeText={(v) => {
                  set("direccion_asesor")(v);
                }}
                onFocus={handleInputFocus}
                onEndEditing={() => validateField("direccion_asesor")}
                placeholder="Calle y número"
              />
            </View>
            <View style={[styles.half, isSmall && { width: "100%" }]}>
              <LabeledInput
                label="Municipio"
                value={form.municipio_asesor}
                onChangeText={(v) => {
                  set("municipio_asesor")(v);
                }}
                onFocus={handleInputFocus}
                onEndEditing={() => validateField("municipio_asesor")}
                placeholder="Ej. Benito Juárez"
              />
            </View>
            <View style={[styles.half, isSmall && { width: "100%" }]}>
              <LabeledInput
                label="RFC"
                value={form.rfc_asesor}
                onChangeText={(v) => {
                  set("rfc_asesor")(v.toUpperCase());
                }}
                onFocus={handleInputFocus}
                onEndEditing={() => validateField("rfc_asesor")}
                placeholder="XAXX010101000"
                autoCapitalize="characters"
              />
            </View>
            <View style={[styles.half, isSmall && { width: "100%" }]}>
              <LabeledInput
                label="Nacionalidad"
                value={form.nacionalidad_asesor}
                onChangeText={(v) => {
                  set("nacionalidad_asesor")(v);
                }}
                onFocus={handleInputFocus}
                onEndEditing={() => validateField("nacionalidad_asesor")}
                placeholder="Mexicana"
              />
            </View>

            {/* Select (plegable) Género */}
            <View
              id="genero_asesor"
              style={[
                styles.half,
                isSmall && { width: "100%" },
                { position: "relative", zIndex: genderOpen ? 1000 : 1 },
              ]}
              ref={genderAnchorRef}
            >
              <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                Género
              </Text>
              <Pressable
                onPress={() => {
                  try {
                    const node = genderAnchorRef.current;
                    if (node?.measureInWindow) {
                      node.measureInWindow((x, y, w, h) => {
                        setGenderMenuPos({ x, y, w, h });
                        setGenderOpen(true);
                      });
                    } else {
                      setGenderOpen(true);
                    }
                  } catch {
                    setGenderOpen(true);
                  }
                }}
                className="border border-slate-300 rounded-xl px-4 py-3 bg-white flex-row items-center justify-between"
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              >
                <Text
                  className={`text-slate-900 ${!form.genero_asesor ? "opacity-50" : ""}`}
                >
                  {form.genero_asesor || "Selecciona una opción"}
                </Text>
                <Svg
                  width={20}
                  height={20}
                  viewBox="0 -960 960 960"
                  fill="#475569"
                >
                  <Path d="M480-360 240-600h480L480-360Z" />
                </Svg>
              </Pressable>
              {!!fieldErrors.genero_asesor && (
                <Text className="text-red-600 text-xs mt-1">
                  {fieldErrors.genero_asesor}
                </Text>
              )}

              <Modal
                transparent
                visible={genderOpen}
                animationType="fade"
                onRequestClose={() => setGenderOpen(false)}
              >
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setGenderOpen(false)}
                />
                <View
                  style={[
                    styles.menu,
                    {
                      left: genderMenuPos.x,
                      top: genderMenuPos.y + genderMenuPos.h + 6,
                      width: Math.max(genderMenuPos.w, 220),
                    },
                  ]}
                >
                  {["Masculino", "Femenino", "Otro"].map((opt) => (
                    <Pressable
                      key={opt}
                      onPress={() => {
                        setForm((f) => ({ ...f, genero_asesor: opt }));
                        setGenderOpen(false);
                        validateField("genero_asesor", opt);
                      }}
                      className="px-4 py-3 active:bg-slate-50 flex-row items-center justify-between"
                    >
                      <Text className="text-slate-800">{opt}</Text>
                      {form.genero_asesor === opt && (
                        <Svg
                          width={18}
                          height={18}
                          viewBox="0 -960 960 960"
                          fill="#10b981"
                        >
                          <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </Svg>
                      )}
                    </Pressable>
                  ))}
                </View>
              </Modal>
            </View>
          </View>

          {/* Mensaje y acciones */}
          {!!toast.msg && (
            <View
              className={`mt-4 rounded-lg px-3 py-2 ${toast.type === "ok" ? "bg-emerald-50" : "bg-red-50"} border ${toast.type === "ok" ? "border-emerald-200" : "border-red-200"}`}
            >
              <Text
                className={`${toast.type === "ok" ? "text-emerald-700" : "text-red-700"} text-sm`}
              >
                {toast.msg}
              </Text>
            </View>
          )}
          <View className="mt-3 flex-row justify-end gap-2">
            <Pressable
              onPress={() => {
                setForm({
                  nombre_asesor: "",
                  correo_asesor: "",
                  telefono_asesor: "",
                  direccion_asesor: "",
                  municipio_asesor: "",
                  rfc_asesor: "",
                  nacionalidad_asesor: "",
                  genero_asesor: "",
                });
                setFieldErrors({});
                setToast({ type: "", msg: "" });
              }}
              className="px-4 py-3 rounded-xl border border-slate-300 bg-white"
              hitSlop={8}
              android_ripple={{ color: "rgba(0,0,0,0.06)" }}
            >
              <Text className="text-slate-700 font-semibold">Limpiar</Text>
            </Pressable>
            <Pressable
              onPress={onSubmit}
              disabled={disabled}
              className={`px-5 py-3 rounded-xl items-center justify-center ${disabled ? "bg-violet-400" : "bg-[#6F09EA]"}`}
              hitSlop={10}
              android_ripple={{ color: "rgba(255,255,255,0.15)" }}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold">
                  {asesorToEdit ? "Guardar Cambios" : "Registrar Asesor"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Backdrop para cerrar el dropdown */}
        {/* Sin backdrop para evitar que bloquee clics en web; se cierra al seleccionar o al volver a tocar el campo */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  half: { width: "48%" },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 6px 12px rgba(0,0,0,0.12)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }),
    overflow: "hidden",
    zIndex: 10000,
  },
});
