import React, {
  useState,
  useEffect,
  useRef,
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
  <TouchableOpacity activeOpacity={1} className="mb-4">
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
  </TouchableOpacity>
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
    if (isEditable && (value === null || value === "")) {
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
        style={[
          styles.currencyInput,
          (value === 0 || value === null) && styles.currencyInputPlaceholder,
        ]}
        ref={inputRef}
        value={value === null ? "" : String(Math.floor(value))}
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

const StepButton = ({ onPress, disabled, type, onPressIn, onPressOut }) => {
  const isIncrement = type === "increment";
  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        if (disabled) return; // El bisturí
        onPress(); // Si no está deshabilitado, funciona normal
      }}
      style={[
        styles.stepButton,
        disabled && styles.stepButtonDisabled,
        isIncrement ? { marginLeft: 8 } : { marginRight: 8 },
      ]}
      activeOpacity={disabled ? 1.0 : 0.7}
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

const ChipButton = ({ label, onPress, disabled, variant, isSelected }) => (
  <TouchableOpacity
    style={[
      styles.chip,
      isSelected && styles.chipSelected,
      variant === "primary" && styles.chipPrimary,
      variant === "clear" && styles.chipClear,
      disabled && styles.chipDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text
      style={[
        styles.chipText,
        isSelected && styles.chipTextSelected,
        variant === "primary" && styles.chipTextPrimary,
        variant === "clear" && styles.chipTextClear,
        disabled && styles.chipTextDisabled,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ChipButtonGroup = ({
  chips,
  onSelect,
  disabled,
  selectedValue,
  clearLabel,
}) => (
  <View style={styles.chipContainer}>
    {selectedValue !== null && selectedValue !== 0 && (
      <ChipButton
        label={clearLabel || "Limpiar"}
        onPress={() => onSelect(0)}
        disabled={disabled}
        variant="clear"
      />
    )}
    {chips.map((chip) => (
      <ChipButton
        key={chip.label}
        label={chip.label}
        onPress={() => {
          // Si el chip ya está seleccionado, al presionarlo de nuevo se resetea a 0.
          if (chip.value === selectedValue) {
            onSelect(0);
          } else {
            onSelect(chip.value);
          }
        }}
        isSelected={chip.value === selectedValue && chip.value !== 0}
        variant={chip.variant}
        disabled={disabled || chip.disabled}
      />
    ))}
  </View>
);
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
          {form.curso_id ? (
            <>
              <Text
                style={[styles.ticketText, { flexShrink: 1, marginRight: 8 }]}
              >
                {form.curso_quantity}x {curso?.label || "Curso..."}
              </Text>
              <Text style={styles.ticketText}>
                {currencyFormatter.format(form.importe)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.ticketText}>Curso(s) no seleccionado(s)</Text>
              <Text style={styles.ticketText}>
                {currencyFormatter.format(0)}
              </Text>
            </>
          )}
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

      <View style={styles.ticketItem}>
        <Text style={styles.ticketText}>Anticipo:</Text>
        <Text style={styles.ticketText}>
          - {currencyFormatter.format(form.anticipo || 0)}
        </Text>
      </View>

      <View style={styles.ticketSeparator} />

      {form.anticipo > 0 && form.curso_id ? (
        <>
          <View style={[styles.ticketItem, { marginTop: 8, marginBottom: 0 }]}>
            <Text style={[styles.ticketText, styles.ticketTotalLabel]}>
              Pendiente:
            </Text>
            <Text style={[styles.ticketText, styles.ticketTotalAmount]}>
              {currencyFormatter.format(totalFinal < 0 ? 0 : totalFinal)}
            </Text>
          </View>
        </>
      ) : null}

      {form.fecha_limite_pago ? (
        <View style={[styles.ticketItem, { marginTop: 2, marginBottom: 0 }]}>
          <Text style={styles.ticketDate}>Fecha de pago:</Text>
          <Text style={styles.ticketDate}>{form.fecha_limite_pago}</Text>
        </View>
      ) : null}

      <View style={[styles.ticketItem, { marginTop: 4 }]}>
        <Text style={[styles.ticketText, styles.ticketPendingLabel]}>
          Total a Pagar:
        </Text>
        <Text style={[styles.ticketText, styles.ticketPendingAmount]}>
          {currencyFormatter.format(totalConIncentivo)}
        </Text>
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
  anticipo: 0,
  incentivo_premium: 0,
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

  // Estado para controlar si el usuario quiere definir una fecha límite
  const [defineFechaLimite, setDefineFechaLimite] = useState(false);

  // Estados "en vivo" para una UI fluida en los sliders
  const [liveHoras, setLiveHoras] = useState(initialFormState.horas_sesion);
  const [liveAnticipo, setLiveAnticipo] = useState(initialFormState.anticipo);
  const [liveIncentivo, setLiveIncentivo] = useState(
    initialFormState.incentivo_premium
  );

  // --- Lógica para los inputs de fecha segmentados ---
  const [dateParts, setDateParts] = useState({
    day: "",
    month: "",
    year: new Date().getFullYear().toString(),
  });
  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  // Ref para gestionar el intervalo de pulsación larga en los steppers
  const intervalRef = React.useRef(null);

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
            setDefineFechaLimite(false); // Resetea el checklist de la fecha
            // Resetea también los estados "en vivo"
            setLiveHoras(initialFormState.horas_sesion);
            setLiveAnticipo(initialFormState.anticipo);
            setLiveIncentivo(initialFormState.incentivo_premium);
            // Limpia cualquier intervalo activo si se limpia el formulario
            if (intervalRef.current) clearInterval(intervalRef.current);
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

    return `Compra ${cantidadTexto} "${cursoSeleccionado.label}" del día ${formattedDate} por ${nombre_cliente}`;
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
        // Al cambiar de curso, el anticipo y el incentivo se resetean a 0.
        anticipo: 0,
        incentivo_premium: 0,
      };
    });
    // Sincroniza los estados "en vivo" de los sliders
    setLiveAnticipo(0);
    setLiveIncentivo(0);
    // Activa automáticamente el checklist para definir la fecha al seleccionar un curso.
    setDefineFechaLimite(true);

    // Y establece la fecha de hoy directamente para asegurar que se popule.
    const today = new Date();
    setDateParts({
      day: String(today.getDate()).padStart(2, "0"),
      month: String(today.getMonth() + 1).padStart(2, "0"),
      year: today.getFullYear().toString(),
    });
  };

  const handleCursoQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || !form.curso_id) return; // No permitir menos de 1 o si no hay curso

    const selectedCurso = cursos.find((c) => c.value === form.curso_id);
    const costoUnitario = selectedCurso ? selectedCurso.costo : 0;
    const nuevoImporte = costoUnitario * newQuantity;

    setForm((prev) => {
      let incentivoActual = prev.incentivo_premium;
      let anticipoActual = prev.anticipo;

      // 1. Re-validar el incentivo contra el nuevo importe.
      // Si el incentivo es un monto fijo y ahora es mayor que el nuevo importe, se ajusta.
      if (!incentivoEnPorcentaje && incentivoActual > nuevoImporte) {
        incentivoActual = nuevoImporte;
        setLiveIncentivo(incentivoActual); // Sincronizar slider
      }

      // 2. Calcular el monto del incentivo (ya sea porcentaje o fijo)
      const montoIncentivo = incentivoActual
        ? incentivoEnPorcentaje
          ? nuevoImporte * (incentivoActual / 100)
          : incentivoActual
        : 0;

      // 3. Re-validar el anticipo contra el nuevo importe menos el incentivo.
      const maxAnticipo = nuevoImporte - montoIncentivo;
      if (anticipoActual > maxAnticipo) {
        anticipoActual = maxAnticipo;
        setLiveAnticipo(anticipoActual); // Sincronizar slider
      }

      return {
        ...prev,
        curso_quantity: newQuantity,
        importe: nuevoImporte,
        incentivo_premium: incentivoActual,
        anticipo: anticipoActual,
      };
    });
  };

  const commitAnticipo = (value) => {
    let numericValue = value === null || value === "" ? 0 : parseFloat(value);

    setForm((currentForm) => {
      let nuevoIncentivo = currentForm.incentivo_premium;

      // 1. Validar el nuevo anticipo para que no exceda el importe total.
      if (numericValue > currentForm.importe) {
        numericValue = currentForm.importe;
      }

      setLiveAnticipo(numericValue); // Sincroniza el estado visual con el valor final

      // 2. Calcular el máximo incentivo posible con el nuevo anticipo.
      const maxIncentivo = currentForm.importe - numericValue;

      // 3. Si el incentivo actual es mayor que el nuevo máximo, se ajusta.
      if (nuevoIncentivo > maxIncentivo && maxIncentivo >= 0) {
        nuevoIncentivo = maxIncentivo;
        // Si el incentivo se ajusta, también sincronizamos su slider.
        setLiveIncentivo(nuevoIncentivo);
      }

      return {
        ...currentForm,
        anticipo: numericValue,
        incentivo_premium: nuevoIncentivo,
      };
    });
  };

  const handleDirectAnticipoChange = (valueOrUpdater) => {
    // Esta función ahora puede aceptar un valor directo o una función de actualización.
    if (typeof valueOrUpdater === "function") {
      // Si es una función (del setInterval), la usamos para actualizar el estado.
      // Actualizamos tanto el estado 'live' como el del formulario.
      setLiveAnticipo((currentLiveValue) => {
        const newValue = valueOrUpdater(currentLiveValue);
        commitAnticipo(newValue); // commitAnticipo ya sincroniza el form y el live state
        return newValue;
      });
    } else {
      // Si es un valor directo, simplemente lo usamos.
      commitAnticipo(valueOrUpdater);
    }
  };

  const commitIncentivo = (value) => {
    let numericValue = value === null || value === "" ? 0 : parseFloat(value);

    setForm((currentForm) => {
      let nuevoAnticipo = currentForm.anticipo;

      if (numericValue !== null) {
        // El incentivo ahora se limita solo por el importe total.
        const maxIncentivoPermitido = currentForm.importe;

        if (incentivoEnPorcentaje) {
          const incentivoCalculado = currentForm.importe * (numericValue / 100);
          if (incentivoCalculado > maxIncentivoPermitido) {
            // Limita el porcentaje si excede el 100% del importe.
            numericValue = (maxIncentivoPermitido / currentForm.importe) * 100;
          }
        } else {
          // Limita el monto si excede el importe.
          if (numericValue > maxIncentivoPermitido) {
            numericValue = maxIncentivoPermitido;
          }
        }
      }

      setLiveIncentivo(numericValue); // Sincroniza el estado visual con el valor final
      const montoIncentivoFinal = numericValue
        ? incentivoEnPorcentaje
          ? currentForm.importe * (numericValue / 100)
          : numericValue
        : 0;

      const maxAnticipo = currentForm.importe - montoIncentivoFinal;

      const finalValue = numericValue;
      // Si el anticipo actual es mayor que el nuevo máximo permitido, se ajusta.
      if (nuevoAnticipo > maxAnticipo && maxAnticipo >= 0) {
        nuevoAnticipo = maxAnticipo;
        setLiveAnticipo(nuevoAnticipo); // Sincroniza el slider del anticipo
      }

      return {
        ...currentForm,
        incentivo_premium: finalValue,
        anticipo: nuevoAnticipo,
      };
    });
  };

  const handleDirectIncentivoChange = (valueOrUpdater) => {
    // Misma lógica que para el anticipo.
    if (typeof valueOrUpdater === "function") {
      // Actualizamos tanto el estado 'live' como el del formulario.
      setLiveIncentivo((currentLiveValue) => {
        const newValue = valueOrUpdater(currentLiveValue);
        commitIncentivo(newValue);
        return newValue; // Devolvemos el nuevo valor para el estado 'live'
      });
    } else {
      commitIncentivo(valueOrUpdater);
    }
  };

  // Detiene el incremento/decremento progresivo
  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Limpia el intervalo si el componente se desmonta
  useEffect(() => {
    return () => {
      stopCounter();
    };
  }, []);
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

  // Determina si los controles de anticipo deben estar deshabilitados.
  const isAnticipoDisabled = useMemo(
    () => !form.curso_id || totalConIncentivo <= 0,
    [form.curso_id, totalConIncentivo]
  );

  // Determina si el pago se ha cubierto en su totalidad.
  const isPagoCompleto = useMemo(() => totalFinal <= 0, [totalFinal]);

  // Efecto para manejar el estado de la fecha límite basado en si el pago está completo.
  useEffect(() => {
    if (isPagoCompleto) {
      // Si el pago está completo, nos aseguramos de que no haya fecha límite.
      setDefineFechaLimite(false);
      setForm((prev) => ({ ...prev, fecha_limite_pago: "" }));
      setDateParts({
        day: "",
        month: "",
        year: new Date().getFullYear().toString(),
      });
    } else if (!defineFechaLimite) {
      // Al desactivar, solo se limpia la fecha final del formulario,
      // pero se conservan los datos en los inputs (dateParts).
      setForm((prev) => ({ ...prev, fecha_limite_pago: "" }));
    } else {
      // Al reactivar el switch, si ya había una fecha completa, la restauramos.
      const { day, month, year } = dateParts;
      if (day.length === 2 && month.length === 2 && year.length === 4) {
        setForm((prev) => ({
          ...prev,
          fecha_limite_pago: `${day}/${month}/${year}`,
        }));
      }
    }
  }, [isPagoCompleto, defineFechaLimite]);

  const formattedFechaLimite = useMemo(() => {
    const { day, month, year } = dateParts || {};

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

    const dayText = day || "DD";
    let monthText = "MM";
    let yearText;

    const currentYear = new Date().getFullYear();

    if (!year) {
      yearText = "AAAA";
    } else if (parseInt(year, 10) === currentYear) {
      yearText = "en curso";
    } else {
      yearText = year;
    }

    if (month && month.length === 2) {
      const monthIndex = parseInt(month, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12)
        monthText = monthNames[monthIndex];
    }

    return `El pago se realizará el día ${dayText} de ${monthText} del año ${yearText}.`;
  }, [dateParts]); // La dependencia es correcta

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

  const is_incentivo_disabled = useMemo(() => !form.curso_id, [form.curso_id]);

  const selectedCursoInfo = useMemo(
    () => cursos.find((c) => c.value === form.curso_id),
    [form.curso_id, cursos]
  );

  useEffect(() => {
    const { day, month, year } = dateParts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      // Validar que la fecha no sea en el pasado
      const enteredDate = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (enteredDate < today) {
        Alert.alert(
          "Fecha Inválida",
          "No puedes seleccionar una fecha anterior al día de hoy."
        );
        setDateParts({ day: "", month: "", year: "" });
        setForm({ ...form, fecha_limite_pago: "" });
        return;
      }

      const formattedDate = `${day}/${month}/${year}`;
      setForm((prevForm) => ({
        ...prevForm,
        fecha_limite_pago: formattedDate,
      }));
    } else {
      // Si la fecha no está completa, el campo del formulario se vacía
      setForm((prevForm) => ({ ...prevForm, fecha_limite_pago: "" }));
    }
  }, [dateParts]);

  const handleDatePartChange = (part, value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    let newParts = { ...dateParts, [part]: numericValue };

    // Validaciones y auto-focus
    if (part === "day") {
      if (parseInt(numericValue, 10) > 31) newParts.day = "31";
      if (numericValue.length === 2) monthInputRef.current?.focus();
    }
    if (part === "month") {
      if (parseInt(numericValue, 10) > 12) newParts.month = "12";
      if (numericValue.length === 2) yearInputRef.current?.focus();
    }
    if (part === "year" && numericValue.length === 4) {
      const enteredYear = parseInt(numericValue, 10);
      const maxYear = new Date().getFullYear() + 10;

      if (enteredYear > maxYear) {
        Alert.alert(
          "Fecha Inválida",
          "Asegurese de haber puesto una fecha correcta"
        );
        Keyboard.dismiss();
        newParts = { day: "", month: "", year: "" };
      } else {
        Keyboard.dismiss();
      }
    }

    setDateParts(newParts);
  };

  const handleDateBlur = (part) => {
    const value = dateParts[part];
    if (value && value.length === 1) {
      setDateParts((prev) => ({ ...prev, [part]: value.padStart(2, "0") }));
    }
  };
  // --- Fin de la lógica de fecha ---

  const isFormValid = useMemo(() => {
    const baseValid =
      form.nombre_cliente.trim() !== "" &&
      form.curso_id !== null &&
      form.anticipo !== null;

    if (!baseValid) return false;

    // Si el pago está completo, el formulario es válido sin fecha.
    if (isPagoCompleto) return true;

    // Si hay pago pendiente y se define fecha, esta debe ser completa.
    return !defineFechaLimite || form.fecha_limite_pago.length === 10;
  }, [
    form.nombre_cliente,
    form.curso_id,
    form.anticipo,
    form.fecha_limite_pago,
    isPagoCompleto,
    defineFechaLimite,
  ]);

  // Calcula el máximo anticipo posible, considerando el incentivo.
  const maxAnticipoPosible = useMemo(() => {
    const { importe, incentivo_premium = 0 } = form;
    if (importe <= 0) return 1000; // Un valor por defecto si no hay importe

    const montoIncentivo = incentivo_premium
      ? incentivoEnPorcentaje
        ? importe * (incentivo_premium / 100)
        : incentivo_premium
      : 0;

    const max = importe - montoIncentivo;
    return max < 0 ? 0 : max;
  }, [form.importe, form.incentivo_premium, incentivoEnPorcentaje]);

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
      // const { error } = await supabase.from("ventas").insert(payload);

      // if (error) {
      //   throw error;
      // }

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
      <View className="flex-1">
        <View style={styles.header}>
          <TouchableOpacity
            className={`flex flex-row justify-center`}
            onPress={() => {
              const isDirty = !equal(form, initialFormState);
              if (!isDirty) {
                onFormClose();
                return;
              }

              Keyboard.dismiss();
              Alert.alert(
                "Cambios sin guardar",
                "Tienes cambios sin guardar. ¿Qué deseas hacer?",
                [
                  {
                    text: "Descartar",
                    style: "destructive",
                    onPress: onFormClose,
                  },
                  { text: "Cancelar", style: "cancel", onPress: () => {} },
                ]
              );
            }}
          >
            <Svg
              style={styles.backButton}
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="#475569"
            >
              <Path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
            </Svg>

            <Text style={styles.headerTitle}>Registrar Nueva Venta</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1.2 }}>
            <KeyboardAvoidingView
              key={isLandscape ? "landscape" : "portrait"} // Clave para forzar el reseteo
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              enabled={true} // Habilitado en ambas orientaciones
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
            >
              <ScrollView
                keyboardShouldPersistTaps="never"
                contentContainerStyle={styles.scrollContent}
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
                    renderRightIcon={() => (
                      <Svg
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                        fill="#64748b"
                      >
                        <Path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                      </Svg>
                    )}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectedText}
                    itemTextStyle={styles.dropdownItemText}
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
                        renderRightIcon={() => (
                          <Svg
                            height="20"
                            viewBox="0 -960 960 960"
                            width="20"
                            fill="#64748b"
                          >
                            <Path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                          </Svg>
                        )}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedTextStyle={styles.dropdownSelectedText}
                        itemTextStyle={styles.dropdownItemText}
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
                        renderRightIcon={() => (
                          <Svg
                            height="20"
                            viewBox="0 -960 960 960"
                            width="20"
                            fill="#64748b"
                          >
                            <Path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                          </Svg>
                        )}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedTextStyle={styles.dropdownSelectedText}
                        itemTextStyle={styles.dropdownItemText}
                      />
                    </LabeledInput>
                  </View>
                </View>

                <LabeledInput label="Número de Horas">
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <StepButton
                      type="decrement"
                      disabled={form.horas_sesion <= 1}
                      onPress={() => {
                        const newValue = Math.max(1, form.horas_sesion - 1);
                        setLiveHoras(newValue);
                        setForm((prev) => ({
                          ...prev,
                          horas_sesion: newValue,
                        }));
                      }}
                    />
                    <Slider
                      style={{ flex: 1, height: SLIDER_HEIGHT }}
                      minimumValue={1}
                      maximumValue={30}
                      step={1}
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
                      pointerEvents={true ? "none" : "auto"}
                    />
                    <TextInput
                      style={[
                        styles.input, // El TextInput ahora no necesita margen izquierdo
                        { width: 70, marginLeft: 10, textAlign: "center" },
                      ]}
                      value={String(Math.round(form.horas_sesion))}
                      onChangeText={(text) => {
                        const numValue = Number(text) || 1;
                        setLiveHoras(numValue);
                        setForm((prev) => ({
                          ...prev,
                          horas_sesion: numValue,
                        }));
                      }}
                      keyboardType="number-pad"
                    />
                    <StepButton
                      type="increment"
                      disabled={form.horas_sesion >= 30}
                      onPress={() => {
                        const newValue = Math.min(30, form.horas_sesion + 1);
                        setLiveHoras(newValue);
                        setForm((prev) => ({
                          ...prev,
                          horas_sesion: newValue,
                        }));
                      }}
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
                      renderRightIcon={() => (
                        <Svg
                          height="20"
                          viewBox="0 -960 960 960"
                          width="20"
                          fill="#64748b"
                        >
                          <Path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
                        </Svg>
                      )}
                      placeholderStyle={styles.dropdownPlaceholder}
                      selectedTextStyle={styles.dropdownSelectedText}
                      itemTextStyle={styles.dropdownItemText}
                    />
                    <View
                      style={[
                        styles.quantityContainer,
                        !form.curso_id && styles.disabledQuantityContainer,
                      ]}
                    >
                      <TouchableOpacity
                        // 1. Tu lógica combinada
                        onPress={() => {
                          // EL BISTURÍ (con doble chequeo):
                          if (!form.curso_id || form.curso_quantity <= 1)
                            return;

                          // Si pasa, ejecuta la función:
                          handleCursoQuantityChange(form.curso_quantity - 1);
                        }}
                        // 2. (Opcional) El control de opacidad
                        activeOpacity={
                          !form.curso_id || form.curso_quantity <= 1 ? 1.0 : 0.7
                        }
                        // 3. ¡ELIMINADO!
                        // disabled={!form.curso_id || form.curso_quantity <= 1} // <--- Fuera

                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {form.curso_quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          // EL BISTURÍ: Si no hay curso_id, no hagas nada y sal de aquí.
                          if (!form.curso_id) return;

                          // Si todo bien, ejecuta tu función
                          handleCursoQuantityChange(form.curso_quantity + 1);
                        }}
                        // 2. (Opcional pero recomendado)
                        // Controla el feedback visual manualmente.
                        // Si está deshabilitado, opacidad 1 (sin feedback). Si no, 0.7 (el default).
                        activeOpacity={!form.curso_id ? 1.0 : 0.7}
                        // 3. ¡ADIÓS AL CULPABLE!
                        // disabled={!form.curso_id} // <--- Eliminado

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
                      pointerEvents={true ? "none" : "auto"}
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
                      disabled={isAnticipoDisabled || (form.anticipo || 0) <= 0}
                      onPress={() =>
                        handleDirectAnticipoChange(
                          Math.max(0, (liveAnticipo || 0) - 50)
                        )
                      }
                      onPressIn={() => {
                        stopCounter(); // Limpia el anterior por si acaso
                        intervalRef.current = setInterval(() => {
                          // Usamos una función de callback para obtener el valor más reciente
                          handleDirectAnticipoChange((prevValue) => {
                            const newValue = Math.max(0, (prevValue || 0) - 50);
                            return newValue;
                          });
                        }, 150); // Repite cada 150ms
                      }}
                      onPressOut={stopCounter}
                    />
                    <View style={{ flex: 1 }}>
                      <Slider
                        style={{ width: "100%", height: SLIDER_HEIGHT }}
                        minimumValue={0}
                        step={50}
                        maximumValue={maxAnticipoPosible}
                        value={Number(liveAnticipo) || 0}
                        // onValueChange se omite para deshabilitar el deslizamiento
                        onSlidingComplete={handleDirectAnticipoChange}
                        disabled={isAnticipoDisabled}
                        minimumTrackTintColor={
                          isAnticipoDisabled ? "#9ca3af" : "#6F09EA"
                        }
                        maximumTrackTintColor="#d1d5db"
                        thumbTintColor={
                          isAnticipoDisabled ? "#9ca3af" : "#6F09EA"
                        }
                      />
                    </View>
                    <CurrencyInput
                      value={form.anticipo}
                      onChangeText={(text) => {
                        const numericValue =
                          text === ""
                            ? 0
                            : parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
                        handleDirectAnticipoChange(numericValue);
                      }}
                      placeholder="0"
                      editable={!isAnticipoDisabled}
                    />
                    <StepButton
                      type="increment"
                      disabled={
                        isAnticipoDisabled || form.anticipo >= form.importe
                      }
                      onPress={() =>
                        handleDirectAnticipoChange(
                          Math.min(form.importe, (liveAnticipo || 0) + 50)
                        )
                      }
                      onPressIn={() => {
                        stopCounter();
                        intervalRef.current = setInterval(() => {
                          // Usamos una función de callback para obtener el valor más reciente
                          handleDirectAnticipoChange((prevValue) => {
                            const newValue = Math.min(
                              form.importe,
                              (prevValue || 0) + 50
                            );
                            return newValue;
                          });
                        }, 150);
                      }}
                      onPressOut={stopCounter}
                    />
                  </View>
                  {form.curso_id && (
                    <ChipButtonGroup
                      clearLabel="Sin anticipo"
                      disabled={isAnticipoDisabled}
                      selectedValue={form.anticipo}
                      chips={(() => {
                        const importe = form.importe || 0;
                        if (importe <= 0) return [];

                        const standardChips = [50, 100, 200, 500];
                        const dynamicChips = new Set();

                        // 1. Añadir valores estándar que sean menores que el importe
                        standardChips.forEach((v) => {
                          if (v < importe) dynamicChips.add(v);
                        });

                        // 2. Generar valores grandes en decrementos de 500
                        // Empezamos desde el múltiplo de 500 más cercano por debajo del importe
                        let startValue = Math.floor((importe - 1) / 500) * 500;

                        // Recorremos hacia abajo mientras el valor sea significativo (ej. > 500)
                        while (startValue > 500) {
                          dynamicChips.add(startValue);
                          startValue -= 500;
                        }

                        // 3. Convertir el Set a un array de objetos, ordenar y añadir el botón "Total"
                        const chipObjects = Array.from(dynamicChips)
                          .sort((a, b) => a - b) // Ordenar de menor a mayor
                          .map((v) => ({ label: `$${v}`, value: v }));

                        chipObjects.push({
                          label: "Total",
                          value: importe,
                          disabled: !importe || importe <= 0,
                        });

                        return chipObjects;
                      })()}
                      onSelect={handleDirectAnticipoChange}
                    />
                  )}
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

                {/* <TouchableWithoutFeedback activeOpacity={1} style={styles.separator} /> */}

                <TouchableOpacity
                  activeOpacity={1}
                  style={[
                    styles.incentivoContainer,
                    is_incentivo_disabled && styles.incentivoDisabledContainer,
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={is_incentivo_disabled ? 1.0 : 0.8}
                    onPress={() => {
                      // El "bisturí": Si está deshabilitado, no hagas nada.
                      if (is_incentivo_disabled) return;

                      // Si pasa el chequeo, ejecuta tu función original.
                      handleIncentivoPress();
                    }}
                    onLongPress={
                      Platform.OS !== "web" && is_incentivo_active
                        ? handleIncentivoDeactivation
                        : null
                    }
                    style={[
                      styles.incentivoHeader,
                      is_incentivo_active && styles.incentivoHeaderActive,
                    ]}
                  >
                    <Svg
                      height="18"
                      viewBox="0 0 24 24"
                      width="18"
                      fill="#f59e0b"
                    >
                      <Path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5a2 2 0 00-2 2v1h20v-1a2 2 0 00-2-2z" />
                    </Svg>
                    <Text style={styles.premiumLabelText}>
                      Incentivo Premium
                    </Text>
                  </TouchableOpacity>

                  {is_incentivo_active && (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.incentivoBody}
                    >
                      <View style={styles.segmentedControlContainer}>
                        <TouchableOpacity
                          style={[
                            styles.segmentedChip,
                            !incentivoEnPorcentaje &&
                              styles.segmentedChipActive,
                          ]}
                          onPress={() => {
                            if (incentivoEnPorcentaje) toggleIncentivoTipo();
                          }}
                          disabled={is_incentivo_disabled}
                        >
                          <Text
                            style={[
                              styles.segmentedChipText,
                              !incentivoEnPorcentaje &&
                                styles.segmentedChipTextActive,
                            ]}
                          >
                            Monto Fijo ($)
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.segmentedChip,
                            incentivoEnPorcentaje && styles.segmentedChipActive,
                          ]}
                          onPress={() => {
                            if (!incentivoEnPorcentaje) toggleIncentivoTipo();
                          }}
                          disabled={is_incentivo_disabled}
                        >
                          <Text
                            style={[
                              styles.segmentedChipText,
                              incentivoEnPorcentaje &&
                                styles.segmentedChipTextActive,
                            ]}
                          >
                            Porcentaje (%)
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <StepButton
                          type="decrement"
                          disabled={
                            is_incentivo_disabled ||
                            (form.incentivo_premium || 0) <= 0
                          }
                          onPress={() =>
                            handleDirectIncentivoChange(
                              Math.max(
                                0,
                                (liveIncentivo || 0) -
                                  (incentivoEnPorcentaje ? 5 : 50)
                              )
                            )
                          }
                          onPressIn={() => {
                            stopCounter();
                            intervalRef.current = setInterval(() => {
                              // Usamos una función de callback para obtener el valor más reciente
                              handleDirectIncentivoChange((prevValue) => {
                                const step = incentivoEnPorcentaje ? 5 : 50;
                                return Math.max(0, (prevValue || 0) - step);
                              });
                            }, 150);
                          }}
                          onPressOut={stopCounter}
                        />
                        <View style={{ flex: 1 }}>
                          <Slider
                            style={{ width: "100%", height: SLIDER_HEIGHT }}
                            minimumValue={0}
                            maximumValue={
                              incentivoEnPorcentaje
                                ? 100
                                : pendienteSinIncentivo
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
                              {
                                width: 100,
                                marginLeft: 10,
                                textAlign: "right",
                              },
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
                                  ? 0
                                  : parseInt(text.replace(/[^0-9]/g, ""), 10) ||
                                    0;
                              handleDirectIncentivoChange(numericValue);
                            }}
                            editable={!is_incentivo_disabled}
                          />
                        )}
                        <StepButton
                          type="increment"
                          disabled={
                            is_incentivo_disabled ||
                            (incentivoEnPorcentaje // Si es %, el límite es 100
                              ? form.incentivo_premium >= 100 // Si es monto, el límite es el importe total del curso
                              : form.incentivo_premium >= form.importe)
                          }
                          onPress={() =>
                            handleDirectIncentivoChange(
                              (liveIncentivo || 0) +
                                (incentivoEnPorcentaje ? 5 : 50)
                            )
                          }
                          onPressIn={() => {
                            stopCounter();
                            intervalRef.current = setInterval(() => {
                              handleDirectIncentivoChange((prevValue) => {
                                const step = incentivoEnPorcentaje ? 5 : 50;
                                return (prevValue || 0) + step;
                              });
                            }, 150);
                          }}
                          onPressOut={stopCounter}
                        />
                      </View>
                      <ChipButtonGroup
                        clearLabel="Sin incentivo"
                        disabled={is_incentivo_disabled} // El grupo se deshabilita si el incentivo no es aplicable
                        selectedValue={form.incentivo_premium}
                        chips={
                          incentivoEnPorcentaje
                            ? [
                                { label: "10%", value: 10 },
                                { label: "25%", value: 25 },
                                { label: "50%", value: 50 },
                                { label: "75%", value: 75 },
                                {
                                  label: "100%",
                                  value: 100,
                                }, // Botón especial
                              ]
                            : (() => {
                                // Lógica para chips de monto fijo
                                const maxIncentivo = form.importe || 0;
                                if (maxIncentivo <= 0) return [];

                                const standardChips = [50, 100, 200, 500];
                                const dynamicChips = new Set();

                                standardChips.forEach((v) => {
                                  if (v < maxIncentivo) dynamicChips.add(v);
                                });

                                let startValue =
                                  Math.floor((maxIncentivo - 1) / 500) * 500;
                                while (startValue > 500) {
                                  dynamicChips.add(startValue);
                                  startValue -= 500;
                                }

                                const chipObjects = Array.from(dynamicChips)
                                  .sort((a, b) => a - b)
                                  .map((v) => ({ label: `$${v}`, value: v }));

                                chipObjects.push({
                                  label: "Máximo",
                                  value: maxIncentivo,
                                  disabled: !maxIncentivo || maxIncentivo <= 0,
                                });

                                return chipObjects;
                              })()
                        }
                        onSelect={handleDirectIncentivoChange}
                      />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>

                {form.incentivo_premium > 0 ? (
                  <LabeledInput label="Pendiente (con incentivo)">
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                ) : null}

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
                  helperText={defineFechaLimite ? formattedFechaLimite : null}
                >
                  {isPagoCompleto && form.curso_id ? (
                    <View
                      style={styles.pagoCompletoContainer}
                      pointerEvents="none"
                    >
                      <Text style={styles.pagoCompletoText}>
                        El pago ha sido cubierto en su totalidad.
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>
                          Establecer fecha límite de pago
                        </Text>
                        <Switch
                          trackColor={{ false: "#e5e7eb", true: "#a78bfa" }}
                          thumbColor={defineFechaLimite ? "#6F09EA" : "#f4f3f4"}
                          onValueChange={() =>
                            setDefineFechaLimite((prev) => !prev)
                          }
                          disabled={!form.curso_id}
                          value={defineFechaLimite}
                        />
                      </View>
                      {defineFechaLimite ? (
                        <View
                          style={[styles.dateInputContainer, { marginTop: 4 }]}
                        >
                          <TextInput
                            style={styles.dateInput}
                            placeholder="DD"
                            value={dateParts.day}
                            onChangeText={(text) =>
                              handleDatePartChange("day", text)
                            }
                            keyboardType="number-pad"
                            maxLength={2}
                            onBlur={() => handleDateBlur("day")}
                          />
                          <Text style={styles.dateSeparator}>/</Text>
                          <TextInput
                            ref={monthInputRef}
                            style={styles.dateInput}
                            placeholder="MM"
                            value={dateParts.month}
                            onChangeText={(text) =>
                              handleDatePartChange("month", text)
                            }
                            keyboardType="number-pad"
                            maxLength={2}
                            onBlur={() => handleDateBlur("month")}
                          />
                          <Text style={styles.dateSeparator}>/</Text>
                          <TextInput
                            ref={yearInputRef}
                            style={[styles.dateInput, { flex: 1.5 }]}
                            placeholder="AAAA"
                            value={dateParts.year}
                            onChangeText={(text) =>
                              handleDatePartChange("year", text)
                            }
                            keyboardType="number-pad"
                            maxLength={4}
                          />
                        </View>
                      ) : (
                        <Text style={styles.helperText}>
                          La fecha de pago es indefinida
                        </Text>
                      )}
                    </>
                  )}
                </LabeledInput>

                <LabeledInput label="Descripción">
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
                          {
                            color: isDescripcionManual ? "#4f46e5" : "#ef4444",
                          },
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
                    isSaving && styles.submitButtonDisabled, // isSaving debe ir al final para prevalecer
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
            </KeyboardAvoidingView>
          </View>
          <View
            id="ticket"
            className={isLandscape ? "" : "hidden"}
            style={styles.previewContainer}
          >
            <TicketPreview
              form={form}
              curso={selectedCursoInfo}
              totalFinal={totalFinal}
              totalConIncentivo={totalConIncentivo}
            />
          </View>
        </View>
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
    height: 42,
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
  dropdownItemText: {
    color: "#1e293b",
    fontSize: 16,
  },
  dropdownPlaceholder: {
    color: "#64748b",
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: "#1e293b",
    fontSize: 16,
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
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipDisabled: {
    backgroundColor: "#f8fafc",
    opacity: 0.6,
  },
  chipText: {
    color: "#475569",
    fontWeight: "500",
    fontSize: 12,
  },
  chipSelected: {
    backgroundColor: "#eef2ff",
    borderColor: "#a5b4fc",
  },
  chipTextSelected: {
    color: "#4338ca",
    fontWeight: "bold",
  },

  chipPrimary: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  chipTextPrimary: {
    color: "#b45309",
    fontWeight: "bold",
  },
  chipClear: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
  },
  chipTextClear: {
    color: "#b91c1c",
    fontWeight: "bold",
  },
  chipTextDisabled: {
    color: "#9ca3af",
    fontWeight: "500",
  },

  segmentedControlContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: 16,
    gap: 8, // Espacio entre los dos botones
  },
  segmentedChip: {
    // Estilo base (botón inactivo)
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "transparent",
  },
  segmentedChipActive: {
    // Estilo del botón activo
    backgroundColor: "#4f46e5", // Color principal de la app
    borderColor: "#4f46e5",
  },
  segmentedChipText: {
    // Texto del botón inactivo
    color: "#4b5563",
    fontWeight: "500",
  },
  segmentedChipTextActive: {
    // Texto del botón activo
    color: "white",
    fontWeight: "bold",
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
    paddingTop: 12,
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
  currencyInputPlaceholder: {
    color: "#9ca3af",
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
  ticketPendingLabel: {
    fontWeight: "600",
    color: "#2563eb",
  },
  ticketPendingAmount: {
    fontWeight: "600",
    color: "#2563eb",
    fontSize: 15,
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
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 8,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: "center",
  },
  dateSeparator: {
    fontSize: 16,
    color: "#9ca3af",
  },
  pagoCompletoContainer: {
    backgroundColor: "#dcfce7", // Verde claro
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  pagoCompletoText: {
    color: "#166534", // Verde oscuro
    fontWeight: "500",
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
    color: "#374151",
  },
  helperText: {
    color: "#6b7280",
    fontSize: 12,
  },
});
