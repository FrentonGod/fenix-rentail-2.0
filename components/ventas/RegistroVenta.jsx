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
  Keyboard,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import equal from "fast-deep-equal";
import { supabase } from "../../lib/supabase";
import { Dropdown } from "react-native-element-dropdown";
import Slider from "@react-native-community/slider";
import Svg, { Path } from "react-native-svg";

const LabeledInput = ({
  label,
  error,
  children,
  labelCentered = false,
  helperText,
}) => (
  <View className="mb-4">
    <Text
      className={`text-sm font-semibold text-slate-700 mb-1 ${labelCentered ? "text-center" : ""}`}
    >
      {label}
    </Text>
    {children}
    {!!helperText && !error && (
      <Text className="text-slate-500 text-xs mt-1">{helperText}</Text>
    )}
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

const StepButton = ({ onPress, disabled, type }) => {
  const isIncrement = type === "increment";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.stepButton,
        disabled && styles.stepButtonDisabled,
        isIncrement ? { marginLeft: 8 } : { marginRight: 8 },
      ]}
    >
      <Text
        style={[
          styles.stepButtonText,
          disabled && styles.stepButtonTextDisabled,
        ]}
      >
        {isIncrement ? "+" : "-"}
      </Text>
    </TouchableOpacity>
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
        <Text style={styles.ticketTitle}>MQerk Academy</Text>
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
          <View style={{ flexShrink: 1, marginRight: 8 }}>
            <Text style={styles.ticketText} numberOfLines={1}>
              {form.curso_quantity}x {curso?.label || "Curso no seleccionado"}
            </Text>
          </View>
          <Text style={styles.ticketText}>
            {currencyFormatter.format(form.importe)}
          </Text>
        </View>
      </View>

      {form.incentivo_premium > 0 && (
        <View style={styles.ticketItem}>
          <Text style={[styles.ticketText, { color: "#b45309" }]}>
            Incentivo Premium:
          </Text>
          <Text style={[styles.ticketText, { color: "#b45309" }]}>
            - {currencyFormatter.format(form.importe - totalConIncentivo)}
          </Text>
        </View>
      )}

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
            Pendiente:
          </Text>
          <Text style={[styles.ticketText, styles.ticketTotalAmount]}>
            {currencyFormatter.format(totalFinal < 0 ? 0 : totalFinal)}
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
  fecha_limite_pago: "",
};

export default function RegistroVenta({ navigation, onFormClose }) {
  // Usamos un estado para la orientación, basado en las dimensiones de la PANTALLA.
  const [isLandscape, setIsLandscape] = useState(() => {
    const screen = Dimensions.get("screen");
    return screen.width > screen.height;
  });

  useEffect(() => {
    // El listener de 'change' nos da las nuevas dimensiones de la pantalla.
    const subscription = Dimensions.addEventListener("change", ({ screen }) =>
      setIsLandscape(screen.width > screen.height)
    );
    return () => subscription?.remove();
  }, []);

  // Declaraciones de estado movidas al principio del componente
  const [form, setForm] = useState(initialFormState);
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [incentivoEnPorcentaje, setIncentivoEnPorcentaje] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [is_incentivo_active, set_incentivo_active] = useState(false);

  // Estado para controlar la descripción automática
  const [isDescripcionManual, setIsDescripcionManual] = useState(false);

  // Estado para controlar si se muestra el input de dirección personalizada
  const [showCustomDireccion, setShowCustomDireccion] = useState(false);

  // Estados "en vivo" para una UI fluida en los sliders
  const [liveHoras, setLiveHoras] = useState(initialFormState.horas_sesion);
  const [liveAnticipo, setLiveAnticipo] = useState(initialFormState.anticipo);
  const [liveIncentivo, setLiveIncentivo] = useState(
    initialFormState.incentivo_premium
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Comprueba si el formulario ha sido modificado en el momento del evento.
      const isDirty = !equal(form, initialFormState);

      if (!isDirty) {
        return; // Si no hay cambios, permite la navegación.
      }

      e.preventDefault(); // Previene la navegación.

      Keyboard.dismiss();
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

  const handleClearForm = () => {
    Keyboard.dismiss();
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
            setShowCustomDireccion(false);
            setIsDescripcionManual(false); // Resetea el control de la descripción
            // Resetea también los estados "en vivo"
            setLiveHoras(initialFormState.horas_sesion);
            setLiveAnticipo(initialFormState.anticipo);
            setLiveIncentivo(initialFormState.incentivo_premium);
          },
        },
      ]
    );
  };

  // Generador de la descripción automática
  const descripcionAutomatica = useMemo(() => {
    const { nombre_cliente, curso_id, curso_quantity } = form;
    if (!nombre_cliente || !curso_id) return "";

    const cursoSeleccionado = cursos.find((c) => c.value === curso_id);
    if (!cursoSeleccionado) return "";

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;

    const cantidadTexto =
      curso_quantity > 1 ? `de ${curso_quantity} cursos` : "del curso";

    return `Compra ${cantidadTexto} "${cursoSeleccionado.label}" del día ${formattedDate} por ${nombre_cliente}.`;
  }, [form.nombre_cliente, form.curso_id, form.curso_quantity, cursos]);

  // Efecto para actualizar la descripción si no es manual
  useEffect(() => {
    if (!isDescripcionManual) {
      setForm((prev) => ({ ...prev, descripcion: descripcionAutomatica }));
    }
  }, [descripcionAutomatica, isDescripcionManual]);

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
      return {
        ...prev,
        curso_id: item.value,
        curso_quantity: 1, // Resetea la cantidad a 1 al cambiar de curso
        importe: item.costo || 0,
        // Al cambiar de curso, el anticipo se resetea a null para que el usuario lo defina.
        anticipo: null,
      };
    });
    setLiveAnticipo(null); // Sincroniza el estado en vivo
    setLiveIncentivo(null);
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

  const commitAnticipo = (value) => {
    let numericValue = value === null ? null : parseFloat(value);
    setForm((currentForm) => {
      if (numericValue > currentForm.importe && currentForm.importe > 0) {
        numericValue = currentForm.importe;
      }
      setLiveAnticipo(numericValue); // Sincroniza el estado visual con el valor final

      let nuevoIncentivo = currentForm.incentivo_premium;

      // Si hay un incentivo activo, lo recalculamos si el anticipo lo "empuja"
      if (currentForm.incentivo_premium > 0) {
        const maxIncentivoPosible = currentForm.importe - (numericValue || 0);
        let montoIncentivoActual = incentivoEnPorcentaje
          ? currentForm.importe * (currentForm.incentivo_premium / 100)
          : currentForm.incentivo_premium;

        if (montoIncentivoActual > maxIncentivoPosible) {
          nuevoIncentivo = incentivoEnPorcentaje
            ? (maxIncentivoPosible / currentForm.importe) * 100
            : maxIncentivoPosible;
          setLiveIncentivo(nuevoIncentivo); // Sincroniza el slider del incentivo
        }
      }

      if (numericValue >= currentForm.importe && currentForm.importe > 0) {
        // Si el anticipo cubre todo, el incentivo se resetea
        setLiveIncentivo(null);
        return {
          ...currentForm,
          anticipo: numericValue,
          incentivo_premium: null, // Resetea el incentivo
        };
      }

      // Aplica el nuevo anticipo y el incentivo ajustado
      return {
        ...currentForm,
        anticipo: numericValue,
        incentivo_premium: nuevoIncentivo,
      };
    });
  };

  const handleDirectAnticipoChange = (value) => {
    setLiveAnticipo(value);
    commitAnticipo(value);
  };

  const commitIncentivo = (value) => {
    let numericValue = value === null ? null : parseFloat(value);

    setForm((currentForm) => {
      if (numericValue !== null) {
        const maxIncentivoPermitido =
          currentForm.importe - (currentForm.anticipo || 0);

        if (incentivoEnPorcentaje) {
          const incentivoCalculado = currentForm.importe * (numericValue / 100);
          if (incentivoCalculado > maxIncentivoPermitido) {
            numericValue = (maxIncentivoPermitido / currentForm.importe) * 100;
          }
        } else {
          if (numericValue > maxIncentivoPermitido) {
            numericValue = maxIncentivoPermitido;
          }
        }
      }
      setLiveIncentivo(numericValue); // Sincroniza el estado visual con el valor final

      const finalValue =
        numericValue === null ? null : parseFloat(numericValue.toFixed(2));
      return {
        ...currentForm,
        incentivo_premium: finalValue,
      };
    });
  };

  const handleDirectIncentivoChange = (value) => {
    setLiveIncentivo(value);
    commitIncentivo(value);
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
          setLiveIncentivo(null);
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
    Keyboard.dismiss();
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
            setLiveIncentivo(null);
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
        const finalValue = parseFloat(nuevoPorcentaje.toFixed(2));
        setLiveIncentivo(finalValue);
        setForm((prev) => ({ ...prev, incentivo_premium: finalValue }));
      }
      // Si estamos a punto de cambiar A MONTO FIJO
      else {
        const nuevoMonto = importe * (incentivo_premium / 100);
        const finalValue = Math.round(nuevoMonto);
        setLiveIncentivo(finalValue);
        setForm((prev) => ({ ...prev, incentivo_premium: finalValue }));
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

  const formattedFechaLimite = useMemo(() => {
    if (!form.fecha_limite_pago || form.fecha_limite_pago.length < 10) {
      return "DD/MM/AAAA"; // Muestra el formato como placeholder
    }
    const parts = form.fecha_limite_pago.split("/");
    if (parts.length !== 3) return "DD/MM/AAAA";

    const [day, month, year] = parts;
    const monthIndex = parseInt(month, 10) - 1;

    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      return "Fecha inválida";
    }

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const monthName = monthNames[monthIndex];

    return `El pago se realizará el día ${day} de ${monthName} del año ${year}.`;
  }, [form.fecha_limite_pago]);

  const municipios = [
    {
      label: "San Juan Bautista Tuxtepec",
      value: "San Juan Bautista Tuxtepec",
    },
    {
      label: "San Juan Bautista Valle Nacional",
      value: "San Juan Bautista Valle Nacional",
    },
    { label: "Santa María Jacatepec", value: "Santa María Jacatepec" },
    { label: "San José Chiltepec", value: "San José Chiltepec" },
    { label: "Ayotzintepec", value: "Ayotzintepec" },
    { label: "Loma Bonita", value: "Loma Bonita" },
    { label: "San Lucas Ojitlán", value: "San Lucas Ojitlán" },
    { label: "Otra", value: "Otra" },
  ];
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
      form.fecha_limite_pago.length === 10 &&
      form.curso_id !== null &&
      form.anticipo !== null
    );
  }, [
    form.nombre_cliente,
    form.curso_id,
    form.anticipo,
    form.fecha_limite_pago,
  ]);

  const handleRegisterSale = useCallback(async () => {
    if (!isFormValid) {
      Keyboard.dismiss();
      Alert.alert(
        "Campos Incompletos",
        "Por favor, asegúrate de ingresar el nombre del cliente, una fecha límite de pago válida, seleccionar un curso y definir un anticipo."
      );
      return;
    }

    setIsSaving(true);

    try {
      // 1. Calcular el monto del incentivo
      let montoIncentivo = 0;
      if (form.incentivo_premium > 0) {
        montoIncentivo = incentivoEnPorcentaje
          ? form.importe * (form.incentivo_premium / 100)
          : form.incentivo_premium;
      }

      // 2. Preparar el objeto para la base de datos
      const payload = {
        nombre_cliente: form.nombre_cliente.trim(),
        fecha_limite_pago: form.fecha_limite_pago
          ? form.fecha_limite_pago.split("/").reverse().join("-")
          : null, // Convierte DD/MM/AAAA a AAAA-MM-DD para la BD
        direccion: form.direccion.trim() || null,
        curso_id: form.curso_id,
        cantidad: form.curso_quantity,
        grupo: form.grupo,
        frecuencia_sesiones: form.frecuencia_sesiones,
        horas_sesion: form.horas_sesion,
        importe_total: form.importe,
        anticipo: form.anticipo,
        monto_incentivo: montoIncentivo,
        monto_final: totalFinal,
        descripcion: form.descripcion.trim() || null,
        // Asumimos que la tabla tiene un campo `fecha_venta` que se llena automáticamente
      };

      // 3. Insertar en Supabase
      const { error } = await supabase.from("ventas").insert(payload);

      if (error) {
        throw error;
      }

      // 4. Éxito
      Keyboard.dismiss();
      Alert.alert("Venta Registrada", "La venta se ha guardado con éxito.", [
        { text: "OK", onPress: onFormClose }, // Cierra el formulario al confirmar
      ]);
      // No limpiamos el formulario aquí porque `onFormClose` desmontará el componente.
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      Alert.alert(
        Keyboard.dismiss(),
        "Error",
        "No se pudo registrar la venta. Inténtalo de nuevo."
      );
    } finally {
      setIsSaving(false);
    }
  }, [form, isFormValid, incentivoEnPorcentaje, totalFinal, onFormClose]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onFormClose} style={styles.backButton}>
            <Svg height="24" viewBox="0 -960 960 960" width="24" fill="#475569">
              <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registrar Nueva Venta</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <KeyboardAvoidingView
          key={isLandscape ? "landscape" : "portrait"} // Clave para forzar el reseteo
          style={{ flex: 1.2 }}
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          enabled={true} // Habilitado en ambas orientaciones
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <LabeledInput label="Nombre del Cliente/Estudiante">
                <TextInput
                  style={styles.input}
                  value={form.nombre_cliente}
                  autoCapitalize="words" // Dejamos que esta propiedad maneje la capitalización
                  autoCorrect={false}
                  onChangeText={(newText) => {
                    // Previene que se escriba un espacio si el campo está vacío.
                    if (form.nombre_cliente === "" && newText === " ") {
                      return;
                    }
                    // Remueve caracteres especiales y reemplaza múltiples espacios con uno solo
                    const cleanedText = newText
                      .replace(/[^a-zA-Z\sÁÉÍÓÚÜÑáéíóúüñ]/g, "")
                      .replace(/\s\s+/g, " ");
                    // Se elimina la función de formato manual y se establece el texto limpiado
                    setForm({ ...form, nombre_cliente: cleanedText });
                  }}
                  placeholder="Ej. Maria Rodriguez"
                />
              </LabeledInput>

              <LabeledInput label="Dirección">
                <Dropdown
                  style={styles.dropdown}
                  data={municipios}
                  labelField="label"
                  valueField="value"
                  placeholder="Selecciona un municipio"
                  value={showCustomDireccion ? "Otra" : form.direccion}
                  onChange={(item) => {
                    if (item.value === "Otra") {
                      setShowCustomDireccion(true);
                      setForm({ ...form, direccion: "" }); // Limpia la dirección para el input manual
                    } else {
                      setShowCustomDireccion(false);
                      setForm({ ...form, direccion: item.value });
                    }
                  }}
                />
                {showCustomDireccion && (
                  <TextInput
                    style={[styles.input, { marginTop: 10 }]}
                    value={form.direccion}
                    onChangeText={(newText) => {
                      const processedText = newText
                        .replace(/\s\s+/g, " ")
                        .replace(/([^\w\sÁÉÍÓÚÜÑáéíóúüñ])\1+/g, "$1");
                      setForm({ ...form, direccion: processedText });
                    }}
                    placeholder="Escribe la dirección completa"
                    autoFocus={true}
                  />
                )}
              </LabeledInput>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
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
                      onChange={(item) =>
                        setForm({ ...form, grupo: item.value })
                      }
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
                    step={1} //
                    value={liveHoras}
                    // onValueChange se omite para deshabilitar el deslizamiento en tiempo real
                    onSlidingComplete={(value) => {
                      const roundedValue = Math.round(value);
                      setForm((prev) => ({
                        ...prev,
                        horas_sesion: roundedValue,
                      }));
                    }}
                    minimumTrackTintColor="#6F09EA"
                    maximumTrackTintColor="#d1d5db"
                  />
                  <TextInput
                    style={[
                      styles.input,
                      { width: 70, marginLeft: 10, textAlign: "center" },
                    ]}
                    value={String(Math.round(form.horas_sesion))}
                    onChangeText={(text) => {
                      const numValue = Number(text) || 1;
                      setLiveHoras(numValue);
                      setForm((prev) => ({ ...prev, horas_sesion: numValue }));
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
                      loadingCursos
                        ? "Cargando cursos..."
                        : "Selecciona un curso"
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
                    <Text style={styles.quantityText}>
                      {form.curso_quantity}
                    </Text>
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
                  <StepButton type="decrement" disabled />
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
                  <StepButton type="increment" disabled />
                </View>
              </LabeledInput>

              <LabeledInput label="Anticipo">
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <StepButton
                    type="decrement"
                    disabled={!form.curso_id}
                    onPress={() =>
                      handleDirectAnticipoChange(
                        Math.max(0, (liveAnticipo || 0) - 50)
                      )
                    }
                  />
                  <View style={{ flex: 1 }}>
                    <Slider
                      style={{ width: "100%", height: SLIDER_HEIGHT }}
                      minimumValue={0}
                      step={50}
                      maximumValue={form.importe > 0 ? form.importe : 1000}
                      value={Number(liveAnticipo) || 0}
                      // onValueChange se omite para deshabilitar el deslizamiento
                      onSlidingComplete={handleDirectAnticipoChange}
                      disabled={!form.curso_id}
                      minimumTrackTintColor={
                        !form.curso_id ? "#4b5563" : "#6F09EA"
                      }
                      maximumTrackTintColor="#d1d5db"
                      thumbTintColor={!form.curso_id ? "#9ca3af" : "#6F09EA"}
                    />
                  </View>
                  <CurrencyInput
                    value={form.anticipo}
                    onChangeText={(text) => {
                      const numericValue =
                        text === ""
                          ? null
                          : parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
                      handleDirectAnticipoChange(numericValue);
                    }}
                    placeholder="0"
                    editable={!!form.curso_id}
                  />
                  <StepButton
                    type="increment"
                    disabled={!form.curso_id}
                    onPress={() =>
                      handleDirectAnticipoChange(
                        Math.min(form.importe, (liveAnticipo || 0) + 50) // Usa el liveAnticipo para el cálculo
                      )
                    }
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
                  <StepButton type="decrement" disabled />
                  <Slider
                    style={{ flex: 1, height: SLIDER_HEIGHT }}
                    minimumValue={0}
                    maximumValue={form.importe > 0 ? form.importe : 5000}
                    value={
                      pendienteSinIncentivo > 0 ? pendienteSinIncentivo : 0
                    }
                    disabled={true}
                    minimumTrackTintColor="#4b5563"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#9ca3af"
                  />
                  <DisabledCurrencyDisplay value={pendienteSinIncentivo} />
                  <StepButton type="increment" disabled />
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
                    Platform.OS !== "web" && is_incentivo_active
                      ? handleIncentivoDeactivation
                      : null
                  }
                  style={[
                    styles.incentivoHeader,
                    is_incentivo_active && styles.incentivoHeaderActive,
                  ]}
                  disabled={is_incentivo_disabled}
                >
                  <Svg
                    height="18"
                    viewBox="0 0 24 24"
                    width="18"
                    fill="#f59e0b"
                  >
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <StepButton
                        type="decrement"
                        disabled={is_incentivo_disabled}
                        onPress={() =>
                          handleDirectIncentivoChange(
                            Math.max(
                              0,
                              (liveIncentivo || 0) -
                                (incentivoEnPorcentaje ? 5 : 50)
                            )
                          )
                        }
                      />
                      <View style={{ flex: 1 }}>
                        <Slider
                          style={{ width: "100%", height: SLIDER_HEIGHT }}
                          minimumValue={0}
                          maximumValue={
                            incentivoEnPorcentaje ? 100 : pendienteSinIncentivo
                          }
                          step={incentivoEnPorcentaje ? 5 : 50}
                          value={Number(liveIncentivo) || 0}
                          // onValueChange se omite para deshabilitar el deslizamiento
                          onSlidingComplete={handleDirectIncentivoChange}
                          minimumTrackTintColor={
                            is_incentivo_disabled ? "#4b5563" : "#6F09EA"
                          }
                          maximumTrackTintColor="#d1d5db"
                          thumbTintColor={
                            is_incentivo_disabled ? "#9ca3af" : "#6F09EA"
                          }
                          disabled={is_incentivo_disabled}
                        />
                      </View>
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
                                : parseInt(text.replace(/[^0-9]/g, ""), 10) ||
                                  0;
                            handleDirectIncentivoChange(numericValue);
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
                                : parseInt(text.replace(/[^0-9]/g, ""), 10) ||
                                  0;
                            handleDirectIncentivoChange(numericValue);
                          }}
                          editable={!is_incentivo_disabled}
                        />
                      )}
                      <StepButton
                        type="increment"
                        disabled={is_incentivo_disabled}
                        onPress={() =>
                          handleDirectIncentivoChange(
                            (liveIncentivo || 0) +
                              (incentivoEnPorcentaje ? 5 : 50)
                          )
                        }
                      />
                    </View>
                  </View>
                )}
              </View>

              {form.incentivo_premium && (
                <LabeledInput label="Pendiente (con incentivo)">
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <StepButton type="decrement" disabled />
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
                    <StepButton type="increment" disabled />
                  </View>
                </LabeledInput>
              )}

              <LabeledInput label="Total a pagar">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <StepButton type="decrement" disabled />
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
                  <StepButton type="increment" disabled />
                </View>
              </LabeledInput>

              <LabeledInput
                label="Fecha Límite de Pago"
                helperText={formattedFechaLimite}
              >
                <TextInput
                  style={[styles.input, { width: 150 }]}
                  placeholder="DD/MM/AAAA"
                  value={form.fecha_limite_pago}
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={(text) => {
                    // Solo procesamos si el texto cambia
                    if (text === form.fecha_limite_pago) return;

                    const cleaned = text.replace(/[^\d]/g, ""); // Limpia todo lo que no sea dígito
                    let day = cleaned.substring(0, 2);
                    let month = cleaned.substring(2, 4);
                    let year = cleaned.substring(4, 8);

                    // Validaciones en tiempo real
                    if (day.length === 2) {
                      if (parseInt(day, 10) === 0) day = "01";
                      if (parseInt(day, 10) > 31) day = "31";
                    }
                    if (month.length === 2) {
                      if (parseInt(month, 10) === 0) month = "01";
                      if (parseInt(month, 10) > 12) month = "12";

                      // Validar días según el mes
                      const maxDays = new Date(
                        year.length === 4
                          ? parseInt(year, 10)
                          : new Date().getFullYear(),
                        parseInt(month, 10),
                        0
                      ).getDate();
                      if (parseInt(day, 10) > maxDays) {
                        day = String(maxDays);
                      }
                    }

                    // Validar que la fecha no sea en el pasado
                    if (year.length === 4) {
                      const enteredDate = new Date(
                        parseInt(year, 10),
                        parseInt(month, 10) - 1,
                        parseInt(day, 10)
                      );
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación

                      if (enteredDate < today) {
                        Keyboard.dismiss();
                        Alert.alert(
                          "Fecha Inválida",
                          "No puedes seleccionar una fecha anterior al día de hoy."
                        );
                        setForm({ ...form, fecha_limite_pago: "" });
                        return; // Detiene la ejecución para no formatear nada
                      }
                    }

                    let formatted = day;
                    if (cleaned.length > 2) formatted += `/${month}`;
                    if (cleaned.length > 4) formatted += `/${year}`;
                    setForm({ ...form, fecha_limite_pago: formatted });
                  }}
                />
              </LabeledInput>

              <LabeledInput
                label="Descripción"
                helperText="Se genera automáticamente. Puedes editarla si lo necesitas."
              >
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        height: 100,
                        textAlignVertical: "top",
                        flex: 1,
                        marginRight: 8,
                      },
                    ]}
                    value={form.descripcion}
                    onChangeText={(newText) => {
                      // Si el usuario escribe, activamos el modo manual
                      if (!isDescripcionManual) setIsDescripcionManual(true);
                      setForm({ ...form, descripcion: newText });
                    }}
                    placeholder="Añade notas o detalles adicionales sobre la venta..."
                    multiline
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (isDescripcionManual) {
                        // Si es manual, restauramos la automática
                        setIsDescripcionManual(false);
                      } else {
                        // Si es automática, la limpiamos y activamos modo manual
                        setIsDescripcionManual(true);
                        setForm({ ...form, descripcion: "" });
                      }
                    }}
                    style={styles.clearDescriptionButton}
                  >
                    {isDescripcionManual ? (
                      <Svg
                        height="22"
                        viewBox="0 -960 960 960"
                        width="22"
                        fill="#4f46e5"
                      >
                        <Path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T744-744l-56 56q-44-34-96-54.5T480-770q-109 0-184.5 75.5T220-510q0 109 75.5 184.5T480-250q100 0 172-66l56 56q-86 80-208 80Z" />
                      </Svg>
                    ) : (
                      <Svg
                        height="22"
                        viewBox="0 -960 960 960"
                        width="22"
                        fill="#ef4444"
                      >
                        <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </Svg>
                    )}
                    <Text
                      style={[
                        styles.clearDescriptionButtonText,
                        { color: isDescripcionManual ? "#4f46e5" : "#ef4444" },
                      ]}
                    >
                      {isDescripcionManual ? "Restaurar" : "Limpiar"}
                    </Text>
                  </TouchableOpacity>
                </View>
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
                  isSaving && styles.submitButtonDisabled,
                ]}
                disabled={!isFormValid || isSaving}
                onPress={handleRegisterSale}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Registrar Venta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        {isLandscape && (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.previewContainer}>
              <TicketPreview
                form={form}
                curso={selectedCursoInfo}
                totalFinal={totalFinal}
                totalConIncentivo={totalConIncentivo}
              />
            </View>
          </TouchableWithoutFeedback>
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
    cursor: "not-allowed",
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
    justifyContent: "center", // Centrado por defecto
    padding: 12,
    backgroundColor: "#f3f4f6", // Grisáceo por defecto
  },
  incentivoHeaderActive: {
    backgroundColor: "#fffbeb", // Amarillo cuando está activo
    justifyContent: "flex-start", // Alineado a la izquierda cuando está activo
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
    minWidth: 40, // Ancho mínimo para evitar que se colapse
    maxWidth: "100%", // Asegura que no se desborde en web
    textAlign: "right",
    alignSelf: "center",
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
    flex: 0.6,
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
    marginBottom: 4, // Espacio entre items
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
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  stepButtonDisabled: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
  },
  stepButtonText: {
    color: "#4f46e5",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22, // Ajuste para centrar verticalmente el '+' y '-'
  },
  stepButtonTextDisabled: {
    color: "#9ca3af",
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
  clearDescriptionButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 90,
  },
  clearDescriptionButtonText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
