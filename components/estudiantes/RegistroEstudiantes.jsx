import React, { useState, useEffect, useRef } from "react";
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
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { supabase } from "../../lib/supabase";
import Svg, { Path } from "react-native-svg";

// Input compacto con label y error inline (copiado de RegistroAsesor.jsx)
function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled,
  ...rest
}) {
  return (
    <TouchableOpacity activeOpacity={1} className="w-full mb-2">
      <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
        {label}
      </Text>
      <View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className={`border border-slate-300 rounded-xl px-4 py-3 text-slate-900 ${
            disabled ? "bg-slate-100 opacity-60" : "bg-white"
          }`}
          editable={!disabled}
          {...rest}
        />
        {!!error && (
          <Text className="text-red-600 text-xs mt-1 absolute -bottom-4 left-1">
            {error}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const GRUPOS = [
  "Matutino 1",
  "Matutino 2",
  "Matutino 3",
  "Vespertino 1",
  "Vespertino 2",
  "Vespertino 3",
  "Sabatino",
];

export default function RegistroEstudiantes({ onFormClose }) {
  const initialFormState = {
    nombre_estudiante: "",
    id_curso: null,
    grupo: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const [cursoOpen, setCursoOpen] = useState(false);
  const cursoAnchorRef = useRef(null);
  const [cursoMenuPos, setCursoMenuPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const [grupoOpen, setGrupoOpen] = useState(false);
  const grupoAnchorRef = useRef(null);
  const [grupoMenuPos, setGrupoMenuPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const fetchCursos = async () => {
      setLoadingCursos(true);
      const { data, error } = await supabase
        .from("cursos")
        .select("id_curso, nombre_curso");
      if (error) {
        console.error("Error fetching cursos:", error);
        setToast({ type: "error", msg: "No se pudieron cargar los cursos." });
      } else {
        setCursos(data);
      }
      setLoadingCursos(false);
    };
    fetchCursos();
  }, []);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!form.nombre_estudiante.trim()) {
      errs.nombre_estudiante = "Ingresa el nombre del estudiante.";
    }
    if (!form.id_curso) {
      errs.id_curso = "Selecciona un curso.";
    }
    if (!form.grupo) {
      errs.grupo = "Selecciona un grupo.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async () => {
    setToast({ type: "", msg: "" });
    if (!validate()) return;

    setSaving(true);
    const { error } = await supabase.from("alumnos").insert([
      {
        nombre_alumno: form.nombre_estudiante.trim(),
        id_curso: form.id_curso, // Requiere agregar esta columna a la tabla alumnos
        grupo: form.grupo, // Requiere agregar esta columna a la tabla alumnos
        fecha_inscripcion: new Date(),
        estatus_alumno: true,
      },
    ]);

    if (error) {
      console.error("Error saving student:", error);
      setToast({
        type: "error",
        msg: "No se pudo registrar al estudiante. Intenta de nuevo.",
      });
    } else {
      setToast({
        type: "ok",
        msg: "Estudiante registrado correctamente.",
      });
      setForm(initialFormState);
      setFieldErrors({});
      if (onFormClose) setTimeout(() => onFormClose(), 1500);
    }
    setSaving(false);
  };

  const selectedCurso = cursos.find((c) => c.id_curso === form.id_curso);

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : undefined}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
      >
        <View className="flex-1 p-4">
          <View className="w-full">
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
                <Text className="text-slate-600 font-bold ml-1">Volver</Text>
              </TouchableOpacity>
            )}
            <Text className="text-slate-900 text-2xl font-extrabold">
              Registro de Estudiantes
            </Text>
            <Text className="text-slate-600 mb-6">
              Completa los siguientes campos para añadir un nuevo estudiante.
            </Text>
          </View>

          <ScrollView className="w-full" keyboardShouldPersistTaps="handled">
            <LabeledInput
              label="Nombre del Estudiante"
              value={form.nombre_estudiante}
              onChangeText={set("nombre_estudiante")}
              placeholder="Nombre completo del estudiante"
              error={fieldErrors.nombre_estudiante}
              disabled={saving}
            />

            {/* Curso Dropdown */}
            <View className="w-full mb-2 z-20" ref={cursoAnchorRef}>
              <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                Curso
              </Text>
              <Pressable
                onPress={() => {
                  if (saving) return;
                  cursoAnchorRef.current?.measureInWindow((x, y, w, h) => {
                    setCursoMenuPos({ x, y, w, h });
                    setCursoOpen(true);
                  });
                }}
                className={`border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between ${
                  saving ? "bg-slate-100 opacity-60" : "bg-white"
                }`}
                disabled={saving}
              >
                <Text
                  className={`text-slate-900 ${!selectedCurso ? "opacity-50" : ""}`}
                >
                  {selectedCurso?.nombre_curso || "Selecciona un curso"}
                </Text>
                {loadingCursos ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Svg
                    width={20}
                    height={20}
                    viewBox="0 -960 960 960"
                    fill="#475569"
                  >
                    <Path d="M480-360 240-600h480L480-360Z" />
                  </Svg>
                )}
              </Pressable>
              {!!fieldErrors.id_curso && (
                <Text className="text-red-600 text-xs mt-1">
                  {fieldErrors.id_curso}
                </Text>
              )}
            </View>

            {/* Grupo Dropdown */}
            <View className="w-full mb-2 z-10" ref={grupoAnchorRef}>
              <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                Grupo
              </Text>
              <Pressable
                onPress={() => {
                  if (saving) return;
                  grupoAnchorRef.current?.measureInWindow((x, y, w, h) => {
                    setGrupoMenuPos({ x, y, w, h });
                    setGrupoOpen(true);
                  });
                }}
                className={`border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between ${
                  saving ? "bg-slate-100 opacity-60" : "bg-white"
                }`}
                disabled={saving}
              >
                <Text
                  className={`text-slate-900 ${!form.grupo ? "opacity-50" : ""}`}
                >
                  {form.grupo || "Selecciona un grupo"}
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
              {!!fieldErrors.grupo && (
                <Text className="text-red-600 text-xs mt-1">
                  {fieldErrors.grupo}
                </Text>
              )}
            </View>

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

            <View className="mt-6 flex-row justify-end gap-2">
              <Pressable
                onPress={() => {
                  setForm(initialFormState);
                  setFieldErrors({});
                  setToast({ type: "", msg: "" });
                }}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-white"
                disabled={saving}
              >
                <Text className="text-slate-700 font-semibold">Limpiar</Text>
              </Pressable>
              <Pressable
                onPress={onSubmit}
                disabled={saving}
                className={`px-5 py-3 rounded-xl items-center justify-center ${saving ? "bg-violet-400" : "bg-[#6F09EA]"}`}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold">
                    Registrar Estudiante
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* Curso Modal */}
        <Modal
          transparent
          visible={cursoOpen}
          animationType="fade"
          onRequestClose={() => setCursoOpen(false)}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setCursoOpen(false)}
          />
          <View
            style={[
              styles.menu,
              {
                left: cursoMenuPos.x,
                top: cursoMenuPos.y + cursoMenuPos.h - 23,
                width: cursoMenuPos.w,
              },
            ]}
          >
            <ScrollView>
              {cursos.map((curso) => (
                <Pressable
                  key={curso.id_curso}
                  onPress={() => {
                    set("id_curso")(curso.id_curso);
                    setCursoOpen(false);
                  }}
                  className="px-4 py-3 active:bg-slate-50 flex-row items-center justify-between"
                >
                  <Text className="text-slate-800">{curso.nombre_curso}</Text>
                  {form.id_curso === curso.id_curso && (
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
            </ScrollView>
          </View>
        </Modal>

        {/* Grupo Modal */}
        <Modal
          transparent
          visible={grupoOpen}
          animationType="fade"
          onRequestClose={() => setGrupoOpen(false)}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setGrupoOpen(false)}
          />
          <View
            style={[
              styles.menu,
              {
                left: grupoMenuPos.x,
                top: grupoMenuPos.y + grupoMenuPos.h - 24,
                width: grupoMenuPos.w,
              },
            ]}
          >
            {GRUPOS.map((grupo) => (
              <Pressable
                key={grupo}
                onPress={() => {
                  set("grupo")(grupo);
                  setGrupoOpen(false);
                }}
                className="px-4 py-3 active:bg-slate-50 flex-row items-center justify-between"
              >
                <Text className="text-slate-800">{grupo}</Text>
                {form.grupo === grupo && (
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    maxHeight: 200,
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
  },
});
