import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Activity as Activity,
} from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  SafeAreaView,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import equal from "fast-deep-equal";
import { supabase } from "../../lib/supabase";
import { Dropdown } from "react-native-element-dropdown";
import Slider from "@react-native-community/slider";
import Svg, { Path } from "react-native-svg";

const LabeledInput = ({ label, error, children }) => (
  <View className="mb-4">
    <Text className="text-sm font-semibold text-slate-700 mb-1">{label}</Text>
    {children}
    {!!error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
  </View>
);

const DisabledCurrencyDisplay = ({ value }) => {
  return (
    <View style={[styles.currencyInputContainer, styles.disabledInput]}>
      <Text style={styles.disabledCurrencyText}>$</Text>
      <Text
        style={[styles.disabledCurrencyText, { flex: 1, textAlign: "right" }]}
      >
        {String(Math.floor(value))}
      </Text>
      <Text style={styles.disabledCurrencyText}>.00</Text>
    </View>
  );
};

const CurrencyInput = ({ value, onChangeText, placeholder, editable }) => {
  const isEditable = editable !== false;
  const inputRef = React.useRef(null);

  const handleFocus = () => {
    // Si es editable y el valor es 0, lo borra para facilitar la escritura.
    if (isEditable && (Number(value) === 0 || value === null || value === "")) {
      onChangeText("");
    }
    // Coloca el cursor al final del texto al enfocar.
    setTimeout(() => inputRef.current?.setSelection(99, 99), 0);
  };

  if (!isEditable) {
    return <DisabledCurrencyDisplay value={value} />;
  }

  return (
    <View
      style={[
        styles.currencyInputContainer,
        !isEditable && styles.disabledInput,
      ]}
    >
      <Text style={styles.currencySymbol}>$</Text>
      <TextInput
        style={styles.currencyInput}
        ref={inputRef}
        value={value === null || value === "" ? "" : String(Math.floor(value))}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        placeholder={placeholder || "0"}
        keyboardType="number-pad"
        editable={isEditable}
      />
      <Text style={styles.currencyCents}>.00</Text>
    </View>
  );
};

const TicketPreview = ({ form, curso, totalFinal, totalConIncentivo }) => {
  const today = new Date();
  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <View style={styles.ticketContainer}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketTitle}>Fenix Rentail</Text>
        <Text style={styles.ticketSubtitle}>Comprobante de Venta</Text>
        <Text style={styles.ticketDate}>{today.toLocaleString("es-MX")}</Text>
      </View>

      <View style={styles.ticketSection}>
        <Text style={styles.ticketSectionTitle}>Cliente</Text>
        <Text style={styles.ticketText}>
          {form.nombre_cliente || "No especificado"}
        </Text>
      </View>

      <View style={styles.ticketSection}>
        <Text style={styles.ticketSectionTitle}>Detalles</Text>
        <View style={styles.ticketItem}>
          <Text style={styles.ticketText} numberOfLines={1}>
            {form.curso_quantity}x {curso?.label || "Curso no seleccionado"}
          </Text>
          <Text style={styles.ticketText}>
            {currencyFormatter.format(form.importe)}
          </Text>
        </View>
      </View>

      <View style={styles.ticketSeparator} />

      <View style={styles.ticketTotals}>
        <View style={styles.ticketItem}>
          <Text style={styles.ticketText}>Anticipo:</Text>
          <Text style={styles.ticketText}>
            - {currencyFormatter.format(form.anticipo || 0)}
          </Text>
        </View>
        <View style={styles.ticketItem}>
          <Text style={[styles.ticketText, styles.ticketTotalLabel]}>
            Total a Pagar:
          </Text>
          <Text style={[styles.ticketText, styles.ticketTotalAmount]}>
            {currencyFormatter.format(totalFinal)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SLIDER_HEIGHT = 40; // Altura para todos los sliders

const initialFormState = {
  nombre_cliente: "",
  direccion: "",
  curso_id: null,
  curso_quantity: 1,
  grupo: null,
  frecuencia_sesiones: null,
  horas_sesion: 1,
  importe: 0,
  anticipo: null,
  incentivo_premium: null,
  descripcion: "",
};

export default function RegistroVenta({ navigation, onFormClose }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Comprueba si el formulario ha sido modificado en el momento del evento.
      const isDirty = !equal(form, initialFormState);

      if (!isDirty) {
        return; // Si no hay cambios, permite la navegación.
      }

      e.preventDefault(); // Previene la navegación.

      Alert.alert(
        "Cambios sin guardar",
        "Tienes cambios sin guardar. ¿Qué deseas hacer?",
        [
          {
            text: "Descartar",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
          { text: "Cancelar", style: "cancel", onPress: () => {} },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, form]); // La dependencia clave es 'form'

  const [form, setForm] = useState(initialFormState);
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [incentivoEnPorcentaje, setIncentivoEnPorcentaje] = useState(false);
  const [is_incentivo_active, set_incentivo_active] = useState(false);

  // Estados locales para la visualización en tiempo real de los sliders
  const [liveHoras, setLiveHoras] = useState(form.horas_sesion);
  const [liveAnticipo, setLiveAnticipo] = useState(form.anticipo);
  const [liveIncentivo, setLiveIncentivo] = useState(form.incentivo_premium);

  useEffect(() => {
    setLiveHoras(form.horas_sesion);
  }, [form.horas_sesion]);
  useEffect(() => {
    setLiveAnticipo(form.anticipo);
  }, [form.anticipo]);
  useEffect(() => {
    setLiveIncentivo(form.incentivo_premium);
  }, [form.incentivo_premium]);

  const handleClearForm = () => {
    Alert.alert(
      "Limpiar Formulario",
      "¿Estás seguro de que deseas borrar todos los datos ingresados?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, limpiar",
          style: "destructive",
          onPress: () => {
            setForm(initialFormState);
            setIncentivoEnPorcentaje(false);
            set_incentivo_active(false);
          },
        },
      ]
    );
  };

  useEffect(() => {
    const fetchCursos = async () => {
      const { data, error } = await supabase.from("cursos").select("*");
      if (!error && data) {
        setCursos(
          data.map((c) => ({
            label: c.nombre_curso,
            value: c.id_curso,
            costo: c.costo_curso,
          }))
        );
      }
      setLoadingCursos(false);
    };
    fetchCursos();
  }, []);

  const handleCursoChange = (item) => {
    setForm((prev) => {
      const nuevoImporte = item.costo || 0;
      let nuevoAnticipo = prev.anticipo;

      // Si el anticipo anterior estaba al tope (igual al importe anterior),
      // lo ajustamos para que esté al tope del nuevo importe.
      if (prev.anticipo !== null && prev.anticipo === prev.importe) {
        nuevoAnticipo = nuevoImporte;
      }

      return {
        ...prev,
        curso_id: item.value,
        curso_quantity: 1, // Resetea la cantidad a 1 al cambiar de curso
        importe: nuevoImporte,
        anticipo: nuevoAnticipo,
      };
    });
  };

  const handleCursoQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || !form.curso_id) return; // No permitir menos de 1 o si no hay curso

    const selectedCurso = cursos.find((c) => c.value === form.curso_id);
    const costo_curso = selectedCurso ? selectedCurso.costo : 0;

    setForm((prev) => ({
      ...prev,
      curso_quantity: newQuantity,
      importe: costo_curso * newQuantity,
    }));
  };

  const handleAnticipoChange = (value) => {
    let numericValue = value === null ? null : parseFloat(value);

    // Si el anticipo ingresado es mayor que el importe, lo limitamos al valor del importe.
    if (numericValue > form.importe && form.importe > 0) {
      numericValue = form.importe;
    }
    if (numericValue >= form.importe && form.importe > 0) {
      setForm((prev) => ({
        ...prev,
        anticipo: numericValue,
        incentivo_premium: null, // Resetea el incentivo
      }));
    } else {
      setForm((prev) => ({ ...prev, anticipo: numericValue }));
    }
  };

  const handleIncentivoChange = (value) => {
    if (form.anticipo >= form.importe && form.importe > 0) return; // No hacer nada si está deshabilitado
    let numericValue = value === null ? null : parseFloat(value);

    if (numericValue !== null) {
      const maxIncentivoPermitido = form.importe - (form.anticipo || 0);

      if (incentivoEnPorcentaje) {
        // Si es porcentaje, el valor del incentivo calculado no debe superar el máximo.
        const incentivoCalculado = form.importe * (numericValue / 100);
        if (incentivoCalculado > maxIncentivoPermitido) {
          // Recalculamos el porcentaje máximo permitido.
          numericValue = (maxIncentivoPermitido / form.importe) * 100;
        }
      } else {
        // Si es monto fijo, no debe superar el máximo.
        if (numericValue > maxIncentivoPermitido) {
          numericValue = maxIncentivoPermitido;
        }
      }
    }
    setForm((prev) => {
      const finalValue =
        numericValue === null ? null : parseFloat(numericValue.toFixed(2));
      return {
        ...prev,
        incentivo_premium: finalValue,
      };
    });
  };

  const handleIncentivoActivation = () => {
    if (is_incentivo_disabled) return; // No activar si está deshabilitado
    set_incentivo_active(true);
  };

  const handleIncentivoPress = () => {
    if (is_incentivo_disabled) return;

    // Lógica para la web: un clic activa o desactiva.
    if (Platform.OS === "web") {
      if (is_incentivo_active) {
        // En web, usamos window.confirm directamente para evitar problemas con Alert.
        if (
          window.confirm(
            "¿Estás seguro de que deseas desactivar el incentivo? El valor configurado se perderá."
          )
        ) {
          set_incentivo_active(false);
          setForm((prev) => ({ ...prev, incentivo_premium: null }));
          setIncentivoEnPorcentaje(false);
        }
      } else {
        handleIncentivoActivation();
      }
    } else {
      // Lógica para móvil: un clic solo activa.
      handleIncentivoActivation();
    }
  };

  const handleIncentivoDeactivation = () => {
    Alert.alert(
      "Retirar Incentivo Premium",
      "¿Estás seguro de que deseas desactivar el incentivo? El valor configurado se perderá.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, retirar",
          style: "destructive",
          onPress: () => {
            set_incentivo_active(false);
            // Al desactivar, reseteamos el valor del incentivo en el formulario
            setForm((prev) => ({ ...prev, incentivo_premium: null }));
            // También reseteamos el estado del switch a su valor por defecto (monto fijo)
            setIncentivoEnPorcentaje(false);
          },
        },
      ]
    );
  };

  const toggleIncentivoTipo = () => {
    if (form.anticipo >= form.importe && form.importe > 0) return; // No hacer nada si está deshabilitado
    const { importe, incentivo_premium } = form;

    // La conversión solo tiene sentido si hay un importe y un incentivo
    if (importe > 0 && incentivo_premium > 0) {
      // Si estamos a punto de cambiar A PORCENTAJE
      if (!incentivoEnPorcentaje) {
        const nuevoPorcentaje = (incentivo_premium / importe) * 100;
        // Actualizamos el form con el nuevo valor calculado
        setForm((prev) => ({
          ...prev,
          incentivo_premium: parseFloat(nuevoPorcentaje.toFixed(2)),
        }));
      }
      // Si estamos a punto de cambiar A MONTO FIJO
      else {
        const nuevoMonto = importe * (incentivo_premium / 100);
        setForm((prev) => ({
          ...prev,
          incentivo_premium: Math.round(nuevoMonto),
        }));
      }
    }
    // Finalmente, cambiamos el estado del switch
    setIncentivoEnPorcentaje((prev) => !prev);
  };

  const totalFinal = useMemo(() => {
    const { importe, anticipo = 0, incentivo_premium = 0 } = form;
    let incentivoCalculado = 0;
    if (incentivoEnPorcentaje) {
      incentivoCalculado = importe * (incentivo_premium / 100);
    } else {
      incentivoCalculado = incentivo_premium;
    }
    return importe - anticipo - incentivoCalculado < 0
      ? 0
      : importe - anticipo - incentivoCalculado;
  }, [
    form.importe,
    form.anticipo,
    form.incentivo_premium,
    incentivoEnPorcentaje,
  ]);

  const pendienteSinIncentivo = useMemo(() => {
    const { importe, anticipo = 0 } = form;
    const result = importe - anticipo;
    return result < 0 ? 0 : result;
  }, [form.importe, form.anticipo]);

  const totalConIncentivo = useMemo(() => {
    const { importe, incentivo_premium = 0 } = form;
    let incentivoCalculado = 0;
    if (incentivoEnPorcentaje) {
      incentivoCalculado = importe * (incentivo_premium / 100);
    } else {
      incentivoCalculado = incentivo_premium;
    }
    const result = importe - incentivoCalculado;
    return result < 0 ? 0 : result;
  }, [form.importe, form.incentivo_premium, incentivoEnPorcentaje]);

  const grupos = [
    { label: "Vespertino 1", value: "vespertino_1" },
    { label: "Vespertino 2", value: "vespertino_2" },
    { label: "Vespertino 3", value: "vespertino_3" },
    { label: "Sabatino", value: "sabatino" },
    { label: "Matutino 1", value: "matutino_1" },
    { label: "Matutino 2", value: "matutino_2" },
    { label: "Matutino 3", value: "matutino_3" },
  ];

  const frecuencias = [
    { label: "Diaria", value: "diaria" },
    { label: "Semanal", value: "semanal" },
    { label: "Mensual", value: "mensual" },
  ];

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const is_incentivo_disabled = useMemo(
    () => (form.anticipo >= form.importe && form.importe > 0) || !form.curso_id,
    [form.anticipo, form.importe, form.curso_id]
  );

  const selectedCursoInfo = useMemo(
    () => cursos.find((c) => c.value === form.curso_id),
    [form.curso_id, cursos]
  );

  const isFormValid = useMemo(() => {
    return (
      form.nombre_cliente.trim() !== "" &&
      form.curso_id !== null &&
      form.anticipo !== null
    );
  }, [form.nombre_cliente, form.curso_id, form.anticipo]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View style={styles.header}>
        <TouchableOpacity onPress={onFormClose} style={styles.backButton}>
          <Svg height="24" viewBox="0 -960 960 960" width="24" fill="#475569">
            <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Nueva Venta</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"} // Usar 'padding' en ambas plataformas
          style={{ flex: 1.2 }} // Damos más espacio al formulario
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Ajuste para iOS
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <LabeledInput label="Nombre del Cliente/Estudiante">
              <TextInput
                style={styles.input}
                value={form.nombre_cliente}
                autoCapitalize="words"
                onChangeText={(newText) => {
                  // Previene que se escriba un espacio si el campo está vacío.
                  if (form.nombre_cliente === "" && newText === " ") {
                    return;
                  }
                  // Remueve caracteres especiales y reemplaza múltiples espacios con uno solo
                  const cleanedText = newText
                    .replace(/[^a-zA-Z\sÁÉÍÓÚÜÑáéíóúüñ]/g, "")
                    .replace(/\s\s+/g, " ");
                  const formattedText = cleanedText.replace(
                    /\w\S*/g,
                    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1)
                  );
                  setForm({ ...form, nombre_cliente: formattedText });
                }}
                placeholder="Ej. Maria Rodriguez"
              />
            </LabeledInput>

            <LabeledInput label="Dirección">
              <TextInput
                style={styles.input}
                value={form.direccion}
                onChangeText={(newText) => {
                  if (form.direccion === "" && newText === " ") {
                    return;
                  }
                  const processedText = newText
                    .replace(/\s\s+/g, " ") // Reemplaza múltiples espacios con uno solo
                    // Reemplaza múltiples caracteres especiales consecutivos con el primero de la secuencia
                    .replace(/([^\w\sÁÉÍÓÚÜÑáéíóúüñ])\1+/g, "$1");
                  setForm({ ...form, direccion: processedText });
                }}
                placeholder="Calle, número, colonia"
              />
            </LabeledInput>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <LabeledInput label="Grupo Asignado">
                  <Dropdown
                    style={styles.dropdown}
                    data={grupos}
                    labelField="label"
                    valueField="value"
                    placeholder="Selecciona un grupo"
                    value={form.grupo}
                    onChange={(item) => setForm({ ...form, grupo: item.value })}
                    dropdownPosition="auto"
                  />
                </LabeledInput>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <LabeledInput label="Frecuencia de Sesiones">
                  <Dropdown
                    style={styles.dropdown}
                    data={frecuencias}
                    labelField="label"
                    valueField="value"
                    placeholder="Selecciona frecuencia"
                    value={form.frecuencia_sesiones}
                    onChange={(item) =>
                      setForm({ ...form, frecuencia_sesiones: item.value })
                    }
                  />
                </LabeledInput>
              </View>
            </View>

            <LabeledInput label="Número de Horas">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Slider
                  style={{ flex: 1, height: SLIDER_HEIGHT }}
                  minimumValue={1}
                  maximumValue={30}
                  step={1}
                  value={form.horas_sesion}
                  onValueChange={setLiveHoras}
                  onSlidingComplete={(value) => {
                    const roundedValue = Math.round(value);
                    setForm({ ...form, horas_sesion: roundedValue });
                  }}
                  minimumTrackTintColor="#6F09EA"
                  maximumTrackTintColor="#d1d5db"
                />
                <TextInput
                  style={[
                    styles.input,
                    { width: 70, marginLeft: 10, textAlign: "center" },
                  ]}
                  value={String(Math.round(liveHoras))}
                  onChangeText={(text) => {
                    const numValue = Number(text) || 1;
                    setForm({ ...form, horas_sesion: numValue });
                    setLiveHoras(numValue);
                  }}
                  keyboardType="number-pad"
                />
              </View>
            </LabeledInput>

            <LabeledInput label="Curso/Asesoría">
              <View>
                <Dropdown
                  style={styles.dropdown}
                  data={cursos}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    loadingCursos ? "Cargando cursos..." : "Selecciona un curso"
                  }
                  value={form.curso_id}
                  onChange={handleCursoChange}
                  disable={loadingCursos}
                  search
                  searchPlaceholder="Buscar curso..."
                  dropdownPosition="auto"
                />
                <View
                  style={[
                    styles.quantityContainer,
                    !form.curso_id && styles.disabledQuantityContainer,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      handleCursoQuantityChange(form.curso_quantity - 1)
                    }
                    disabled={!form.curso_id || form.curso_quantity <= 1}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{form.curso_quantity}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      handleCursoQuantityChange(form.curso_quantity + 1)
                    }
                    disabled={!form.curso_id}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LabeledInput>

            <LabeledInput label="Importe">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Slider
                  style={{ flex: 1, height: SLIDER_HEIGHT }}
                  minimumValue={0}
                  maximumValue={form.importe > 0 ? form.importe : 5000}
                  value={form.importe}
                  disabled={true}
                  minimumTrackTintColor="#4b5563"
                  maximumTrackTintColor="#d1d5db"
                  thumbTintColor="#9ca3af"
                />
                <DisabledCurrencyDisplay value={form.importe} />
              </View>
            </LabeledInput>

            <LabeledInput label="Anticipo">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Slider
                  style={{ flex: 1, height: SLIDER_HEIGHT }}
                  minimumValue={0}
                  step={50}
                  maximumValue={form.importe > 0 ? form.importe : 1000}
                  value={Number(form.anticipo) || 0}
                  onValueChange={setLiveAnticipo}
                  onSlidingComplete={(value) => {
                    handleAnticipoChange(value);
                  }}
                  disabled={!form.curso_id}
                  minimumTrackTintColor={!form.curso_id ? "#4b5563" : "#6F09EA"}
                  maximumTrackTintColor="#d1d5db"
                  thumbTintColor={!form.curso_id ? "#9ca3af" : "#6F09EA"}
                />
                <CurrencyInput
                  value={form.anticipo}
                  onChangeText={(text) => {
                    const numericValue =
                      text === ""
                        ? null
                        : parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
                    handleAnticipoChange(numericValue);
                  }}
                  placeholder="0"
                  editable={!!form.curso_id}
                />
              </View>
            </LabeledInput>

            <LabeledInput
              label={
                form.incentivo_premium
                  ? "Pendiente (sin incentivo)"
                  : "Total Final"
              }
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Slider
                  style={{ flex: 1, height: SLIDER_HEIGHT }}
                  minimumValue={0}
                  maximumValue={form.importe > 0 ? form.importe : 5000}
                  value={pendienteSinIncentivo > 0 ? pendienteSinIncentivo : 0}
                  disabled={true}
                  minimumTrackTintColor="#4b5563"
                  maximumTrackTintColor="#d1d5db"
                  thumbTintColor="#9ca3af"
                />
                <DisabledCurrencyDisplay value={pendienteSinIncentivo} />
              </View>
            </LabeledInput>

            <View style={styles.separator} />

            <View
              style={[
                styles.incentivoContainer,
                is_incentivo_disabled && styles.incentivoDisabledContainer,
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleIncentivoPress}
                onLongPress={
                  Platform.OS !== "web" ? handleIncentivoDeactivation : null
                }
                disabled={is_incentivo_disabled}
                style={[
                  styles.incentivoHeader,
                  is_incentivo_active && styles.incentivoHeaderActive,
                ]}
              >
                <Svg height="18" viewBox="0 0 24 24" width="18" fill="#f59e0b">
                  <Path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5a2 2 0 00-2 2v1h20v-1a2 2 0 00-2-2z" />
                </Svg>
                <Text style={styles.premiumLabelText}>Incentivo Premium</Text>
              </TouchableOpacity>

              {is_incentivo_active && (
                <View style={styles.incentivoBody}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text>Monto Fijo ($)</Text>
                    <Switch
                      trackColor={{ false: "#d1d5db", true: "#a78bfa" }}
                      thumbColor="#6F09EA"
                      onValueChange={toggleIncentivoTipo}
                      value={incentivoEnPorcentaje}
                      style={{ marginHorizontal: 8 }}
                      disabled={is_incentivo_disabled}
                    />
                    <Text>Porcentaje (%)</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Slider
                      style={{ flex: 1, height: SLIDER_HEIGHT }}
                      minimumValue={0}
                      maximumValue={
                        incentivoEnPorcentaje ? 100 : pendienteSinIncentivo
                      }
                      step={incentivoEnPorcentaje ? 5 : 50} // Mantenemos el step
                      value={Number(form.incentivo_premium) || 0} // El valor visual se basa en el form, pero se ajusta al step más cercano
                      onValueChange={setLiveIncentivo}
                      onSlidingComplete={(value) => {
                        handleIncentivoChange(value);
                      }}
                      minimumTrackTintColor={
                        is_incentivo_disabled ? "#4b5563" : "#6F09EA"
                      }
                      maximumTrackTintColor="#d1d5db"
                      thumbTintColor={
                        is_incentivo_disabled ? "#9ca3af" : "#6F09EA"
                      }
                      disabled={is_incentivo_disabled}
                    />
                    {incentivoEnPorcentaje ? (
                      <TextInput
                        style={[
                          styles.input,
                          { width: 100, marginLeft: 10, textAlign: "right" },
                          is_incentivo_disabled && styles.disabledInput,
                        ]}
                        value={
                          form.incentivo_premium === null
                            ? ""
                            : `${Math.round(form.incentivo_premium)} %`
                        }
                        onChangeText={(text) => {
                          const numericValue =
                            text === ""
                              ? null
                              : parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
                          handleIncentivoChange(numericValue);
                        }}
                        keyboardType="number-pad"
                        placeholder="0 %"
                        editable={!is_incentivo_disabled}
                      />
                    ) : (
                      <CurrencyInput
                        value={form.incentivo_premium}
                        onChangeText={(text) => {
                          const numericValue =
                            text === ""
                              ? null
                              : parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
                          handleIncentivoChange(numericValue);
                        }}
                        editable={!is_incentivo_disabled}
                      />
                    )}
                  </View>
                </View>
              )}
            </View>

            {form.incentivo_premium && (
              <LabeledInput label="Pendiente (con incentivo)">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Slider
                    style={{ flex: 1, height: SLIDER_HEIGHT }}
                    minimumValue={0}
                    maximumValue={form.importe > 0 ? form.importe : 5000}
                    value={totalFinal > 0 ? totalFinal : 0}
                    disabled={true}
                    minimumTrackTintColor="#4b5563"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#9ca3af"
                  />
                  <DisabledCurrencyDisplay value={totalFinal} />
                </View>
              </LabeledInput>
            )}

            <LabeledInput label="Total a pagar">
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Slider
                  style={{ flex: 1, height: SLIDER_HEIGHT }}
                  minimumValue={0}
                  maximumValue={form.importe > 0 ? form.importe : 5000} // El máximo sigue siendo el importe original
                  value={totalConIncentivo > 0 ? totalConIncentivo : 0}
                  disabled={true}
                  minimumTrackTintColor="#4b5563"
                  maximumTrackTintColor="#d1d5db"
                  thumbTintColor="#9ca3af"
                />
                <DisabledCurrencyDisplay value={totalConIncentivo} />
              </View>
            </LabeledInput>

            <LabeledInput label="Descripción">
              <TextInput
                style={[
                  styles.input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                value={form.descripcion}
                onChangeText={(newText) => {
                  if (form.descripcion === "" && newText === " ") {
                    return;
                  }
                  const singleSpacedText = newText.replace(/\s\s+/g, " ");
                  setForm({ ...form, descripcion: singleSpacedText });
                }}
                placeholder="Añade notas o detalles adicionales sobre la venta..."
                multiline
              />
            </LabeledInput>
          </ScrollView>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearForm}
            >
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { flex: 1 },
                !isFormValid && styles.submitButtonDisabled,
              ]}
              disabled={!isFormValid}
            >
              <Text style={styles.submitButtonText}>Registrar Venta</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {isLandscape && (
          <View style={styles.previewContainer}>
            <TicketPreview
              form={form}
              curso={selectedCursoInfo}
              totalFinal={totalFinal}
              totalConIncentivo={totalConIncentivo}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Espacio extra al final
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  disabledInput: {
    backgroundColor: "#e5e7eb",
    color: "#4b5563",
  },
  dropdown: {
    height: 45,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  submitButton: {
    backgroundColor: "#6F09EA",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#a78bfa", // Un morado más claro
    opacity: 0.7,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
  },
  clearButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center", // Centra el texto verticalmente
  },
  clearButtonText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  incentivoContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
    overflow: "hidden",
    marginBottom: 16,
  },
  incentivoDisabledContainer: {
    opacity: 0.5,
  },
  incentivoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#f3f4f6", // Grisáceo por defecto
  },
  incentivoHeaderActive: {
    backgroundColor: "#fffbeb", // Amarillo cuando está activo
  },
  premiumLabelText: {
    marginLeft: 6,
    fontWeight: "bold",
    color: "#b45309",
  },
  incentivoBody: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
    height: 45,
    width: 120,
    marginLeft: 10,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#4b5563",
    marginRight: 4,
  },
  currencyInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
  },
  currencyCents: {
    fontSize: 16,
    color: "#6b7280",
  },
  disabledCurrencyText: {
    fontSize: 16,
    color: "#4b5563", // Mismo color gris para todo el texto
    marginRight: 2, // Pequeño espacio entre elementos
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center", // Centra el incremental
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
  },
  disabledQuantityContainer: {
    opacity: 0.5,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6F09EA",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 12,
    color: "#1f2937",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#d1d5db",
  },
  separator: {
    height: 2,
    backgroundColor: "#e5e7eb",
    marginVertical: 20,
  },
  // Estilos para la vista previa del ticket
  previewContainer: {
    flex: 0.8,
    padding: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  ticketContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  ticketHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  ticketSubtitle: {
    fontSize: 14,
    color: "#475569",
  },
  ticketDate: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  ticketSection: {
    marginBottom: 15,
  },
  ticketSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
    marginBottom: 8,
  },
  ticketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketText: {
    fontSize: 14,
    color: "#334155",
  },
  ticketSeparator: {
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  ticketTotals: {
    marginTop: 10,
  },
  ticketTotalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ticketTotalAmount: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#1e293b",
  },
});
