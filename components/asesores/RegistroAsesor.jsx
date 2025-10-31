import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
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
  Alert,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Image,
} from "react-native";
import { supabase } from "../../lib/supabase";
import Svg, { Path } from "react-native-svg";
import equal from "fast-deep-equal";
import * as ImagePicker from "expo-image-picker";

// Input compacto con label y error inline
function LabeledInput({
  label,
  customLabel, // Nuevo prop para un label personalizado
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
  disabled, // Añadido para controlar la editabilidad
  ...rest
}) {
  return (
    <View className="w-full mb-2">
      {customLabel ? (
        customLabel
      ) : (
        <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
          {label}
        </Text>
      )}
      <View>
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
          className={`border border-slate-300 rounded-xl px-4 py-3 text-slate-900 ${disabled ? "bg-slate-100 opacity-60" : "bg-white"}`}
          editable={!disabled} // Controla si el TextInput es editable
          {...rest}
        />
        {!!error && (
          <Text className="text-red-600 text-xs mt-1 absolute -bottom-4 left-1">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}

const COMMON_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
];

const MUNICIPIOS = [
  { label: "San Juan Bautista Tuxtepec", value: "San Juan Bautista Tuxtepec" },
  {
    label: "San Juan Bautista Valle Nacional",
    value: "San Juan Bautista Valle Nacional",
  },
  { label: "Santa María Jacatepec", value: "Santa María Jacatepec" },
  { label: "San José Chiltepec", value: "San José Chiltepec" },
  { label: "Ayotzintepec", value: "Ayotzintepec" },
  { label: "Loma Bonita", value: "Loma Bonita" },
  { label: "San Lucas Ojitlán", value: "San Lucas Ojitlán" },
  { label: "Otro", value: "Otro" },
];

export default function RegistroAsesor({
  asesorToEdit,
  onFormClose,
  viewOnly = false,
}) {
  const { width, height } = useWindowDimensions();
  const isSmall = width < 640;
  const isLandscape = width > height && Platform.OS !== "web";
  const isTablet = width >= 640 && width < 1024;
  // Anclar el contenido arriba; en tablets solo damos un poco más de padding top
  const contentStyle = {
    padding: 16,
    paddingBottom: 0, // Asegura que el contenido llene el espacio vertical
    ...(isTablet ? { paddingTop: 24 } : {}),
  };
  // Medir el alto del bloque de título y centrar SOLO el formulario en tablets
  const [titleHeight, setTitleHeight] = useState(0);

  const initialFormState = {
    nombre_asesor: "",
    correo_asesor: "",
    telefono_asesor: "",
    direccion_asesor: "",
    municipio_asesor: "",
    rfc_asesor: "",
    nacionalidad_asesor: "Mexicana",
    genero_asesor: "",
    avatar_url: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [editableFields, setEditableFields] = useState({}); // Estado para controlar qué campos son editables
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);
  const [domainSuggestions, setDomainSuggestions] = useState([]);
  const emailInputContainerRef = useRef(null);
  const [isOtroMunicipio, setIsOtroMunicipio] = useState(false);
  const [emailInputLayout, setEmailInputLayout] = useState(null);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  useEffect(() => {
    // Si recibimos un asesor para editar, llenamos el formulario
    if (asesorToEdit) {
      setForm({ ...initialFormState, ...asesorToEdit });
      // Inicializar todos los campos como no editables en modo edición
      const isCustomMunicipio =
        asesorToEdit.municipio_asesor &&
        !MUNICIPIOS.some((m) => m.value === asesorToEdit.municipio_asesor);
      if (isCustomMunicipio) {
        setIsOtroMunicipio(true);
      }

      const initialEditableState = Object.keys(initialFormState).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {}
      );
      setEditableFields(initialEditableState);
    }
    // Si no hay asesorToEdit, el formulario está vacío y todos los campos son editables por defecto (o no controlados por editableFields)
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
  const [municipioOpen, setMunicipioOpen] = useState(false);
  const municipioAnchorRef = useRef(null);
  const [municipioMenuPos, setMunicipioMenuPos] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  // Helper para renderizar el label con el botón de editar
  const pickImage = async () => {
    if (viewOnly) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu galería para seleccionar una foto."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setForm((prevForm) => ({
        ...prevForm,
        avatar_url: uri,
      }));
    }
  };

  const handleDeleteImage = () => {
    Alert.alert(
      "Eliminar foto de perfil",
      "¿Estás seguro de que quieres eliminar la foto? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setForm((prevForm) => ({ ...prevForm, avatar_url: "" }));
          },
        },
      ]
    );
  };

  const renderLabelWithEditButton = useCallback(
    ({ labelText, fieldKey }) => {
      return (
        <View className="flex-row items-center mb-1">
          <View className="flex-row items-center gap-x-2">
            <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide">
              {labelText}
            </Text>
          </View>
          {asesorToEdit &&
            !viewOnly && ( // Solo mostrar el botón de editar en modo edición y no en solo-lectura
              <TouchableOpacity
                onPress={() =>
                  setEditableFields((prev) => ({
                    ...prev,
                    [fieldKey]: !prev[fieldKey],
                  }))
                }
                className="ml-2 p-1 rounded-full bg-slate-100"
                hitSlop={8}
              >
                {editableFields[fieldKey] ? (
                  // Icono de Confirmar (Check)
                  <Svg
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                    fill="#10b981"
                  >
                    <Path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                  </Svg>
                ) : (
                  // Icono de Editar (Lápiz)
                  <Svg
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                    fill="#475569"
                  >
                    <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                  </Svg>
                )}
              </TouchableOpacity>
            )}
        </View>
      );
    },
    [asesorToEdit, editableFields]
  ); // Dependencia para que se regenere si cambia el modo

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
    [asesorToEdit] // Dependencia para que se regenere al cambiar de modo
  );

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    // Limpiamos todo lo que no sea un dígito
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;

    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }

    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
  };

  const validateField = useCallback(
    async (key, valueOverride) => {
      const value = valueOverride ?? form[key];
      const fn = validators[key];
      if (!fn) return true;
      const msg = fn(value, form);
      setFieldErrors((e) => ({ ...e, [key]: msg }));
      // chequeo de duplicado para correo al salir del campo
      if (key === "correo_asesor" && !msg && value) {
        // Solo buscar duplicados si el correo es sintácticamente válido y no está vacío
        const email = String(value).trim().toLowerCase();
        let query = supabase
          .from("asesores")
          .select("id_asesor", { count: "exact", head: true })
          .eq("correo_asesor", email);

        // Si estamos editando, excluimos el ID del asesor actual de la búsqueda
        if (asesorToEdit?.id_asesor) {
          query = query.not("id_asesor", "eq", asesorToEdit.id_asesor);
        }

        const { count, error } = await query;
        if (error) console.error("Error checking duplicate email:", error);

        if ((count ?? 0) > 0) {
          setFieldErrors((e) => ({
            ...e,
            correo_asesor: "Este correo ya existe",
          }));
          return false; // Indica que la validación falló
        }
      }
      return !msg;
    },
    [form, validators, asesorToEdit]
  );

  const validateAll = useCallback(() => {
    const errs = {};
    Object.entries(validators).forEach(([k, fn]) => {
      const e = fn(form[k] ?? "", form);
      if (e) errs[k] = e;
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form, validators]);

  const onSubmit = useCallback(async () => {
    setToast({ type: "", msg: "" });
    if (!validateAll()) return;
    try {
      let newAvatarUrl = form.avatar_url;

      // Si se seleccionó una nueva imagen (es una URI local)
      if (newAvatarUrl && newAvatarUrl.startsWith("file://")) {
        setSaving(true);
        const file = {
          uri: newAvatarUrl,
          type: "image/jpeg", // o el tipo que corresponda
          name: newAvatarUrl.split("/").pop(),
        };

        const formData = new FormData();
        formData.append("file", file);

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        if (!publicUrlData) {
          throw new Error("No se pudo obtener la URL pública de la imagen.");
        }
        newAvatarUrl = publicUrlData.publicUrl;
      }
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
        avatar_url: newAvatarUrl,
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
      // Solo limpiar el formulario si estamos creando un nuevo asesor
      if (!asesorToEdit) {
        setForm(initialFormState);
      }
      setFieldErrors({});
      // Si el guardado fue exitoso y hay una función para cerrar, la llamamos después de un momento
      if (onFormClose) setTimeout(() => onFormClose(), 1500);
    } finally {
      setSaving(false);
    }
  }, [form, asesorToEdit, onFormClose, validateAll, initialFormState]);

  const disabled = saving;

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : undefined}
    >
      <KeyboardAvoidingView
        onPress={Keyboard.dismiss}
        enabled={isLandscape ? true : false}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        key={isLandscape ? "landscape" : "portrait"}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
        keyboardVerticalOffset={
          isLandscape ? (Platform.OS === "ios" ? 80 : 100) : 0
        }
      >
        <View className={`flex-1 p-[16] pb-0 ${isTablet ? "pt-[24]" : ""}`}>
          {/* Título en el contenedor principal (sin card que limite el diseño) */}
          <View
            className="max-w-6xl self-start"
            onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)}
          >
            {onFormClose && (
              <TouchableOpacity
                onPress={() => onFormClose(form)}
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
              {viewOnly
                ? "Detalles del Asesor"
                : asesorToEdit
                  ? "Editar Asesor"
                  : "Registro de Asesores"}
            </Text>
            <Text className="text-slate-600">
              {viewOnly
                ? "Información registrada del asesor."
                : asesorToEdit
                  ? "Modifica los datos del asesor."
                  : "Completa los siguientes campos."}
            </Text>
          </View>

          {/* Bloque del formulario centrado en tablets */}
          <ScrollView
            id="formulario-asesores"
            className={`max-w-6xl self-center ${isLandscape ? "" : "mt-4"}`}
            keyboardShouldPersistTaps="handled"
          >
            {/* Sección de la foto de perfil */}
            <View className="items-center mb-4">
              <Text className="mb-2 uppercase text-wrap text-slate-700 text-xs font-semibold tracking-wide">
                Foto de perfil
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => {
                    if (form.avatar_url) setIsPreviewVisible(true);
                    else pickImage();
                  }}
                >
                  {form.avatar_url ? (
                    <Image
                      source={{ uri: form.avatar_url }}
                      className="w-24 h-24 rounded-full bg-slate-200"
                    />
                  ) : (
                    <View className="w-24 h-24 rounded-full bg-slate-200 justify-center items-center">
                      <Svg
                        height="48"
                        viewBox="0 -960 960 960"
                        width="48"
                        fill="#9ca3af"
                      >
                        <Path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
                      </Svg>
                    </View>
                  )}
                </TouchableOpacity>
                {!viewOnly && (
                  <>
                    <TouchableOpacity
                      onPress={pickImage}
                      className="absolute bottom-0 right-0 bg-slate-700 p-2 rounded-full border-2 border-white"
                    >
                      <Svg
                        height="16"
                        viewBox="0 -960 960 960"
                        width="16"
                        fill="#ffffff"
                      >
                        <Path d="M200-200h56l345-345-56-56-345 345v56Zm572-403L602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 23 56.5T849-602l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                      </Svg>
                    </TouchableOpacity>
                    {form.avatar_url && (
                      <TouchableOpacity
                        onPress={handleDeleteImage}
                        className="absolute top-0 right-0 bg-red-600 p-1.5 rounded-full border-2 border-white"
                      >
                        <Svg
                          height="14"
                          viewBox="0 -960 960 960"
                          width="14"
                          fill="#ffffff"
                        >
                          <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </Svg>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
            {onFormClose && (
              <View className="h-px bg-slate-200 my-2 mb-4" /> // Separador visual
            )}
            {/* Modal de previsualización de imagen */}
            <Modal
              transparent={true}
              animationType="fade"
              visible={isPreviewVisible}
              onRequestClose={() => setIsPreviewVisible(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setIsPreviewVisible(false)} // Este onPress ahora se aplica a todo el contenedor
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.8)", // Un poco más oscuro para mejor contraste
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: form.avatar_url }}
                    style={{ width: "70%", height: "70%", borderRadius: 16 }}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            {/* Grid 2 columnas */}
            <View className="flex-row flex-wrap gap-4">
              <View style={[styles.half, isSmall && { width: "100%" }]}>
                <LabeledInput
                  customLabel={renderLabelWithEditButton({
                    labelText: "Nombre completo",
                    fieldKey: "nombre_asesor",
                  })}
                  value={form.nombre_asesor}
                  onChangeText={(v) => {
                    // Filtra caracteres no permitidos y limita la longitud
                    const cleanedText = v
                      .replace(/[^a-zA-Z\sÁÉÍÓÚÜÑáéíóúüñ]/g, "") // Elimina caracteres especiales y números
                      .replace(/\s\s+/g, " ") // Reemplaza múltiples espacios por uno solo
                      .slice(0, 50); // Limita a 50 caracteres

                    set("nombre_asesor")(cleanedText);
                  }}
                  maxLength={50}
                  onEndEditing={() => validateField("nombre_asesor")}
                  placeholder="Juan Pérez"
                  autoCorrect={false}
                  autoCapitalize={"words"}
                  error={fieldErrors.nombre_asesor}
                  disabled={
                    viewOnly || (asesorToEdit && !editableFields.nombre_asesor)
                  }
                />
              </View>
              <View style={[styles.half, isSmall && { width: "100%" }]}>
                <View
                  ref={emailInputContainerRef}
                  onLayout={(event) => {
                    emailInputContainerRef.current.measureInWindow(
                      (x, y, width, height) => {
                        setEmailInputLayout({ x, y, width, height });
                      }
                    );
                  }}
                >
                  <LabeledInput
                    customLabel={renderLabelWithEditButton({
                      labelText: "Correo",
                      fieldKey: "correo_asesor",
                    })}
                    value={form.correo_asesor}
                    onChangeText={(v) => {
                      // Ignora mayúsculas y caracteres no permitidos.
                      // Solo permite a-z, 0-9 y @ . _ -
                      const currentValue = v.replace(/[^a-z0-9@._-]/g, "").slice(0, 80);
                      set("correo_asesor")(currentValue);

                      const atIndex = currentValue.indexOf("@");
                      if (atIndex !== -1) {
                        const domainPart = currentValue.substring(atIndex + 1);
                        const filteredDomains = COMMON_DOMAINS.filter(
                          (domain) => domain.startsWith(domainPart)
                        );
                        setDomainSuggestions(filteredDomains);
                        setShowDomainSuggestions(filteredDomains.length > 0);
                      } else {
                        setShowDomainSuggestions(false);
                      }
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowDomainSuggestions(false), 200)
                    }
                    maxLength={80}
                    onEndEditing={() => validateField("correo_asesor")}
                    placeholder="asesor@dominio.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    error={fieldErrors.correo_asesor}
                    disabled={
                      viewOnly ||
                      (asesorToEdit && !editableFields.correo_asesor)
                    }
                  />
                </View>
              </View>
              <View style={[styles.half, isSmall && { width: "100%" }]}>
                <LabeledInput
                  customLabel={renderLabelWithEditButton({
                    labelText: "Teléfono",
                    fieldKey: "telefono_asesor",
                  })}
                  value={formatPhoneNumber(form.telefono_asesor)}
                  onChangeText={(v) => {
                    const digits = phoneDigits(v);
                    // Limita a 10 dígitos
                    set("telefono_asesor")(digits.slice(0, 10));
                  }}
                  maxLength={12} // 10 dígitos + 2 espacios
                  onEndEditing={() => validateField("telefono_asesor")}
                  placeholder="552 233 4455"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  error={fieldErrors.telefono_asesor}
                  disabled={
                    viewOnly ||
                    (asesorToEdit && !editableFields.telefono_asesor)
                  }
                />
              </View>
              <View style={[styles.half, isSmall && { width: "100%" }]}>
                <LabeledInput
                  customLabel={renderLabelWithEditButton({
                    labelText: "Dirección",
                    fieldKey: "direccion_asesor",
                  })}
                  value={form.direccion_asesor}
                  onChangeText={(v) => {
                    set("direccion_asesor")(v);
                  }}
                  onEndEditing={() => validateField("direccion_asesor")}
                  placeholder="Calle y número"
                  disabled={
                    viewOnly ||
                    (asesorToEdit && !editableFields.direccion_asesor)
                  }
                />
              </View>
              {isOtroMunicipio ? (
                <View style={[styles.half, isSmall && { width: "100%" }]}>
                  <LabeledInput
                    customLabel={
                      <View className="flex-row relative items-center mb-1">
                        <Text className="text-slate-700 text-xs font-semibold uppercase tracking-wide">
                          Otro Municipio
                        </Text>
                      </View>
                    }
                    value={form.municipio_asesor}
                    onChangeText={(v) => set("municipio_asesor")(v)}
                    placeholder="Escribe el municipio"
                    autoFocus={true}
                    disabled={viewOnly}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setIsOtroMunicipio(false);
                      set("municipio_asesor")("");
                    }}
                    className="p-2 rounded-full absolute right-2 bottom-4 self-start bg-slate-200"
                  >
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14px"
                      viewBox="0 -960 960 960"
                      width="14px"
                      fill="#475569"
                    >
                      <Path d="M624-96 240-480l384-384 68 68-316 316 316 316-68 68Z" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  id="municipio_asesor"
                  style={[
                    styles.half,
                    isSmall && { width: "100%" },
                    { position: "relative", zIndex: municipioOpen ? 1000 : 1 },
                  ]}
                  ref={municipioAnchorRef}
                >
                  {renderLabelWithEditButton({
                    labelText: "Municipio",
                    fieldKey: "municipio_asesor",
                  })}
                  <Pressable
                    onPress={() => {
                      if (
                        viewOnly ||
                        (asesorToEdit && !editableFields.municipio_asesor)
                      )
                        return;
                      municipioAnchorRef.current?.measureInWindow(
                        (x, y, w, h) => {
                          setMunicipioMenuPos({ x, y, w, h });
                          setMunicipioOpen(true);
                        }
                      );
                    }}
                    className={`border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between ${
                      viewOnly ||
                      (asesorToEdit && !editableFields.municipio_asesor)
                        ? "bg-slate-100 opacity-60"
                        : "bg-white"
                    }`}
                    android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                    disabled={
                      viewOnly ||
                      (asesorToEdit && !editableFields.municipio_asesor)
                    }
                  >
                    <Text
                      className={`text-slate-900 ${!form.municipio_asesor ? "opacity-50" : ""}`}
                    >
                      {form.municipio_asesor || "Selecciona un municipio"}
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
                  {!!fieldErrors.municipio_asesor && (
                    <Text className="text-red-600 text-xs mt-1">
                      {fieldErrors.municipio_asesor}
                    </Text>
                  )}
                </View>
              )}

              <View style={[styles.half, isSmall && { width: "100%" }]}>
                <LabeledInput
                  customLabel={renderLabelWithEditButton({
                    labelText: "RFC",
                    fieldKey: "rfc_asesor",
                  })}
                  value={form.rfc_asesor}
                  onChangeText={(v) => {
                    // Filtra cualquier caracter que no sea letra o número.
                    const cleanedText = v.replace(/[^A-Z-0-9]/g, "");
                    set("rfc_asesor")(cleanedText);
                  }}
                  onEndEditing={() => validateField("rfc_asesor")}
                  placeholder="XAXX010101000"
                  autoComplete="off"
                  autoCapitalize="characters"
                  maxLength={13} // Limita la longitud a 13 caracteres
                  disabled={
                    viewOnly || (asesorToEdit && !editableFields.rfc_asesor)
                  }
                />
              </View>
              <View style={[styles.half, isSmall && { width: "100%" }]}>
                <LabeledInput
                  customLabel={renderLabelWithEditButton({
                    labelText: "Nacionalidad",
                    fieldKey: "nacionalidad_asesor",
                  })}
                  value={form.nacionalidad_asesor}
                  onChangeText={(v) => {
                    // Permite solo letras y un único espacio entre palabras.
                    const cleanedText = v
                      .replace(/[^a-zA-Z\sÁÉÍÓÚÜÑáéíóúüñ]/g, "") // Elimina caracteres no permitidos (números, símbolos).
                      .replace(/\s\s+/g, " ") // Reemplaza múltiples espacios por uno solo.
                      .replace(/^\s+/, ""); // Elimina espacios al inicio del texto.
                    set("nacionalidad_asesor")(cleanedText);
                  }}
                  onEndEditing={() => validateField("nacionalidad_asesor")}
                  placeholder="Mexicana"
                  disabled={
                    viewOnly ||
                    (asesorToEdit && !editableFields.nacionalidad_asesor)
                  }
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
                {renderLabelWithEditButton({
                  labelText: "Género",
                  fieldKey: "genero_asesor",
                })}
                <Pressable
                  onPress={() => {
                    if (
                      viewOnly ||
                      (asesorToEdit && !editableFields.genero_asesor)
                    )
                      return; // No abrir si está deshabilitado
                    genderAnchorRef.current?.measureInWindow((x, y, w, h) => {
                      setGenderMenuPos({ x, y, w, h });
                      setGenderOpen(true);
                    });
                  }}
                  className={`border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between ${
                    viewOnly || (asesorToEdit && !editableFields.genero_asesor)
                      ? "bg-slate-100 opacity-60"
                      : "bg-white"
                  }`}
                  android_ripple={{ color: "rgba(0,0,0,0.06)" }}
                  disabled={
                    viewOnly || (asesorToEdit && !editableFields.genero_asesor)
                  } // Deshabilitar el Pressable
                >
                  <Text
                    className={`text-slate-900 ${
                      !form.genero_asesor ? "opacity-50" : ""
                    }`}
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
                        top: isLandscape
                          ? genderMenuPos.y + genderMenuPos.h - 150
                          : genderMenuPos.y + genderMenuPos.h - 28,
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
            {/* Modal para Municipio */}
            <Modal
              transparent
              visible={municipioOpen}
              animationType="fade"
              onRequestClose={() => setMunicipioOpen(false)}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setMunicipioOpen(false)}
              />
              <View
                style={[
                  styles.menu,
                  {
                    left: municipioMenuPos.x,
                    top: isLandscape
                      ? municipioMenuPos.y + municipioMenuPos.h - 355
                      : municipioMenuPos.y + municipioMenuPos.h - 28,
                    width: Math.max(municipioMenuPos.w, 220),
                  },
                ]}
              >
                {MUNICIPIOS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    onPress={() => {
                      if (opt.value === "Otro") {
                        setIsOtroMunicipio(true);
                        set("municipio_asesor")("");
                        setMunicipioOpen(false);
                      } else {
                        set("municipio_asesor")(opt.value);
                        setMunicipioOpen(false);
                        validateField("municipio_asesor", opt.value);
                      }
                    }}
                    className="px-4 py-3 active:bg-slate-50 flex-row items-center justify-between"
                  >
                    <Text className="text-slate-800">{opt.label}</Text>
                    {form.municipio_asesor === opt.value && (
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

            {/* Mensaje y acciones */}
            {!!toast.msg && (
              <View
                className={`mt-4 rounded-lg px-3 py-2 ${
                  toast.type === "ok" ? "bg-emerald-50" : "bg-red-50"
                } border ${
                  toast.type === "ok" ? "border-emerald-200" : "border-red-200"
                }`}
              >
                <Text
                  className={`${
                    toast.type === "ok" ? "text-emerald-700" : "text-red-700"
                  } text-sm`}
                >
                  {toast.msg}
                </Text>
              </View>
            )}
            {!viewOnly && (
              <View className="mt-3 flex-row justify-end gap-2">
                <Pressable
                  onPress={() => {
                    if (asesorToEdit) {
                      // Revertir a los valores originales del asesor
                      setForm({ ...initialFormState, ...asesorToEdit });
                      // Resetear el estado de editabilidad
                      const initialEditableState = Object.keys(
                        initialFormState
                      ).reduce((acc, key) => {
                        acc[key] = false;
                        return acc;
                      }, {});
                      setEditableFields(initialEditableState);
                    } else {
                      // Para nuevo registro, limpiar completamente
                      setForm(initialFormState);
                    }
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
                  className={`px-5 py-3 rounded-xl items-center justify-center ${
                    disabled ? "bg-violet-400" : "bg-[#6F09EA]"
                  }`}
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
            )}
          </ScrollView>
        </View>

        {/* Contenedor de sugerencias de dominio (fuera del ScrollView) */}
        {showDomainSuggestions && emailInputLayout && (
          <View
            style={{
              position: "absolute",
              top:
                emailInputLayout.y +
                emailInputLayout.height -
                (isLandscape ? 353 : 77),
              left: emailInputLayout.x,
              width: emailInputLayout.width,
              zIndex: 2000,
            }}
          >
            <FlatList
              data={domainSuggestions}
              keyExtractor={(item) => item}
              style={styles.suggestionsContainer}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    const username = form.correo_asesor.split("@")[0];
                    const newEmail = `${username}@${item}`;
                    set("correo_asesor")(newEmail);
                    setShowDomainSuggestions(false);
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={styles.suggestionText}>
                    <Text style={{ color: "#9ca3af" }}>
                      {form.correo_asesor.split("@")[0]}@
                    </Text>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  half: { width: "48%" },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    borderRadius: 8,
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
  suggestionsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    maxHeight: 150,
    marginTop: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  suggestionText: {
    fontSize: 16,
    color: "#1e293b",
  },
});
