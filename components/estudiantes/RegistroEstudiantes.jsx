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

// GRUPOS ahora se cargan desde la base de datos

export default function RegistroEstudiantes({ onFormClose }) {
  const initialFormState = {
    nombre_estudiante: "",
    id_curso: null,
    grupo: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [cursos, setCursos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [loadingGrupos, setLoadingGrupos] = useState(true);
  const [showCustomGrupo, setShowCustomGrupo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const [cursoOpen, setCursoOpen] = useState(false);
  const cursoAnchorRef = useRef(null);
  const [cursoMenuPos, setCursoMenuPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const [grupoOpen, setGrupoOpen] = useState(false);
  const grupoAnchorRef = useRef(null);
  const [grupoMenuPos, setGrupoMenuPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  // Función para cargar grupos desde la base de datos
  const fetchGrupos = async () => {
    setLoadingGrupos(true);
    const { data, error } = await supabase
      .from("grupos")
      .select("id_grupo, grupo")
      .order("grupo", { ascending: true });
    if (error) {
      console.error("Error fetching grupos:", error);
      setToast({ type: "error", msg: "No se pudieron cargar los grupos." });
    } else {
      // Ordenar con Sabatino y Dominical al final
      const gruposData = data || [];
      gruposData.sort((a, b) => {
        const gruposAlFinal = ["Sabatino", "Dominical"];
        const aEsEspecial = gruposAlFinal.some((g) =>
          a.grupo.toLowerCase().includes(g.toLowerCase())
        );
        const bEsEspecial = gruposAlFinal.some((g) =>
          b.grupo.toLowerCase().includes(g.toLowerCase())
        );

        if (aEsEspecial && bEsEspecial) {
          return a.grupo.localeCompare(b.grupo, "es", { sensitivity: "base" });
        }
        if (aEsEspecial) return 1;
        if (bEsEspecial) return -1;
        return a.grupo.localeCompare(b.grupo, "es", { sensitivity: "base" });
      });

      // Agregar la opción "Otro" al final
      gruposData.push({
        id_grupo: null,
        grupo: "Otro",
      });

      setGrupos(gruposData);
    }
    setLoadingGrupos(false);
  };

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
        setCursos(data || []);
      }
      setLoadingCursos(false);
    };

    fetchCursos();
    fetchGrupos();
  }, []);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  // Función para guardar un grupo personalizado en la base de datos
  const saveCustomGrupo = async (grupoNombre) => {
    try {
      // Verificar si el grupo ya existe
      const { data: existingGrupo, error: checkError } = await supabase
        .from("grupos")
        .select("id_grupo, grupo")
        .eq("grupo", grupoNombre)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingGrupo) {
        return existingGrupo.grupo;
      }

      // El grupo no existe, crearlo
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const fechaCreacion = `${day}/${month}/${year}`;

      const { data: newGrupo, error: insertError } = await supabase
        .from("grupos")
        .insert([
          {
            grupo: grupoNombre,
            desc_grupo: `Grupo creado el ${fechaCreacion}`,
          },
        ])
        .select("grupo")
        .single();

      if (insertError) throw insertError;

      // Actualizar la lista de grupos
      fetchGrupos();

      return newGrupo.grupo;
    } catch (error) {
      console.error("Error guardando grupo personalizado:", error);
      setToast({
        type: "error",
        msg: `No se pudo guardar el grupo: ${error.message}`,
      });
      return null;
    }
  };

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

    try {
      // 0. Si hay un grupo personalizado, guardarlo primero
      let finalGrupo = form.grupo;
      if (showCustomGrupo && form.grupo && form.grupo.trim() !== "") {
        const nuevoGrupo = await saveCustomGrupo(form.grupo.trim());
        if (!nuevoGrupo) {
          setSaving(false);
          return;
        }
        finalGrupo = nuevoGrupo;
      }

      // 1. Insertar el estudiante
      const { data: nuevoEstudiante, error: errorEstudiante } = await supabase
        .from("alumnos")
        .insert([
          {
            nombre_alumno: form.nombre_estudiante.trim(),
            id_curso: form.id_curso,
            grupo: finalGrupo,
            fecha_inscripcion: new Date(),
            estatus_alumno: true,
          },
        ])
        .select()
        .single();

      if (errorEstudiante) {
        throw errorEstudiante;
      }

      // 2. Obtener el costo del curso
      const { data: cursoData, error: errorCurso } = await supabase
        .from("cursos")
        .select("costo_curso")
        .eq("id_curso", form.id_curso)
        .single();

      if (errorCurso) {
        throw errorCurso;
      }

      // 3. Crear la transacción (deuda) del estudiante
      const { error: errorTransaccion } = await supabase
        .from("transacciones")
        .insert([
          {
            alumno_id: nuevoEstudiante.id_alumno,
            curso_id: form.id_curso,
            grupo_alumno: finalGrupo,
            monto: cursoData.costo_curso,
            total: cursoData.costo_curso,
            pendiente: cursoData.costo_curso, // Deuda completa
            anticipo: 0, // Sin anticipo inicial
            fecha_transaction: new Date().toISOString(),
          },
        ]);

      if (errorTransaccion) {
        throw errorTransaccion;
      }

      setToast({
        type: "ok",
        msg: "Estudiante registrado correctamente con su deuda del curso.",
      });
      setForm(initialFormState);
      setShowCustomGrupo(false);
      setFieldErrors({});
      if (onFormClose) setTimeout(() => onFormClose(), 1500);
    } catch (error) {
      console.error("Error saving student:", error);
      setToast({
        type: "error",
        msg: "No se pudo registrar al estudiante. Intenta de nuevo.",
      });
    } finally {
      setSaving(false);
    }
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
                  if (saving || loadingCursos || loadingGrupos) return;
                  cursoAnchorRef.current?.measureInWindow((x, y, w, h) => {
                    setCursoMenuPos({ x, y, w, h });
                    setCursoOpen(true);
                  });
                }}
                className={`border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between ${
                  saving || loadingCursos || loadingGrupos
                    ? "bg-slate-100 opacity-60"
                    : "bg-white"
                }`}
                disabled={saving || loadingCursos || loadingGrupos}
              >
                <Text
                  className={`text-slate-900 ${!selectedCurso ? "opacity-50" : ""}`}
                >
                  {loadingCursos
                    ? "Cargando cursos..."
                    : selectedCurso?.nombre_curso || "Selecciona un curso"}
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
                  if (saving || loadingCursos || loadingGrupos) return;
                  grupoAnchorRef.current?.measureInWindow((x, y, w, h) => {
                    setGrupoMenuPos({ x, y, w, h });
                    setGrupoOpen(true);
                  });
                }}
                className={`border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between ${
                  saving || loadingCursos || loadingGrupos
                    ? "bg-slate-100 opacity-60"
                    : "bg-white"
                }`}
                disabled={saving || loadingCursos || loadingGrupos}
              >
                <Text
                  className={`text-slate-900 ${!form.grupo || showCustomGrupo ? "opacity-50" : ""}`}
                >
                  {loadingGrupos
                    ? "Cargando grupos..."
                    : showCustomGrupo
                      ? "Otro"
                      : form.grupo || "Selecciona un grupo"}
                </Text>
                {loadingGrupos ? (
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
              {!!fieldErrors.grupo && (
                <Text className="text-red-600 text-xs mt-1">
                  {fieldErrors.grupo}
                </Text>
              )}
            </View>

            {/* Input personalizado para grupo "Otro" */}
            {showCustomGrupo && (
              <View className="w-full mb-2">
                <Text className="text-slate-700 text-xs font-semibold mb-1 uppercase tracking-wide">
                  Nombre del Grupo Personalizado
                </Text>
                <TextInput
                  value={form.grupo === "Otro" ? "" : form.grupo}
                  onChangeText={(text) => {
                    const cleanedText = text
                      .replace(/\s\s+/g, " ")
                      .replace(
                        /([^a-zA-Z0-9\s\u00c1\u00c9\u00cd\u00d3\u00da\u00dc\u00d1\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc\u00f1])\1+/g,
                        "$1"
                      );
                    set("grupo")(cleanedText);
                  }}
                  placeholder="Ej. Sabatino Especial"
                  placeholderTextColor="#9ca3af"
                  className="border border-slate-300 rounded-xl px-4 py-3 text-slate-900 bg-white"
                  disabled={saving}
                />
              </View>
            )}

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
                  setShowCustomGrupo(false);
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
            <ScrollView
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
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
            <ScrollView
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {grupos.map((grupoObj) => (
                <Pressable
                  key={grupoObj.id_grupo || "otro"}
                  onPress={() => {
                    if (grupoObj.grupo === "Otro") {
                      setShowCustomGrupo(true);
                      set("grupo")("");
                    } else {
                      setShowCustomGrupo(false);
                      set("grupo")(grupoObj.grupo);
                    }
                    setGrupoOpen(false);
                  }}
                  className="px-4 py-3 active:bg-slate-50 flex-row items-center justify-between"
                >
                  <Text className="text-slate-800">{grupoObj.grupo}</Text>
                  {form.grupo === grupoObj.grupo && (
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
