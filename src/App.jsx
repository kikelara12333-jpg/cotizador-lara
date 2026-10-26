import { useState, useMemo, useEffect } from 'react';

const DEFAULT_SERVICES = [
  {
    id: 'autonivelante',
    name: 'Sistema Epóxico Autonivelante',
    description: 'Acabado liso, higiénico, brillante y de alta resistencia química e impacto. Ideal para laboratorios, hospitales e industria limpia.',
    basePrice: 350,
    unit: 'm²',
    icon: '✨'
  },
  {
    id: 'cascara_naranja',
    name: 'Acabado Cáscara de Naranja',
    description: 'Textura antideslizante de alta durabilidad para tráfico peatonal y montacargas ligero. Excelente relación costo-beneficio.',
    basePrice: 280,
    unit: 'm²',
    icon: '🍊'
  },
  {
    id: 'flakes-hojuela',
    name: 'Sistema Flakes / Hojuela',
    description: 'Acabado decorativo y de alta durabilidad con hojuelas de vinilo encapsuladas en resina transparente. Ideal para cocheras, salas de exhibición, oficinas y comercios.',
    basePrice: 380,
    unit: 'm²',
    icon: '🎨'
  },
  {
    id: 'cuarzo-sembrado',
    name: 'Sistema Epóxico de Cuarzo',
    description: 'Matriz epóxica saturada con arenas de cuarzo pigmentadas. Ofrece altísima resistencia al desgaste, propiedades antideslizantes e impermeabilidad total.',
    basePrice: 420,
    unit: 'm²',
    icon: '💎'
  },
  {
    id: 'terrazo-epoxico',
    name: 'Sistema Terrazo Epóxico',
    description: 'Acabado arquitectónico de lujo compuesto por resina epóxica y agregados de mármol o granito, devastado y pulido a espejo. Ciclo de vida superior a 30 años.',
    basePrice: 1200,
    unit: 'm²',
    icon: '🏛️'
  },
  {
    id: 'uretano-cementicio',
    name: 'Mortero Uretano Cementicio',
    description: 'Diseñado para condiciones extremas: soporte de choque térmico (-40 °C a 120 °C), humedad severa, químicos agresivos y tráfico pesado constante. Indispensable en industria alimentaria y química.',
    basePrice: 650,
    unit: 'm²',
    icon: '🛡️'
  },
  {
    id: 'pintura-poliuretano',
    name: 'Pintura / Acabado en Poliuretano',
    description: 'Recubrimiento protector con alta estabilidad a los rayos UV (no se amarillea a la intemperie) y excelente resistencia al rayado y a solventes.',
    basePrice: 220,
    unit: 'm²',
    icon: '☀️'
  },
  {
    id: 'antiderrapante-texturizado',
    name: 'Sistema Epóxico Antiderrapante',
    description: 'Acabado texturizado con siembra de óxido de aluminio o sílice para maximizar la tracción en rampas, pasillos industriales, zonas húmedas y áreas de maniobra.',
    basePrice: 280,
    unit: 'm²',
    icon: '⚠️'
  },
  {
    id: 'mortero-epoxico',
    name: 'Mortero Epóxico de Alta Resistencia',
    description: 'Capa gruesa (3 mm a 6 mm) para nivelar o reparar pisos de concreto severamente dañados antes de la capa final, soportando altas cargas puntuales e impacto mecánico.',
    basePrice: 480,
    unit: 'm²',
    icon: '🏗️'
  },
  {
    id: 'sello_epoxico',
    name: 'Sello Epóxico',
    description: 'Recubrimiento delgado para protección contra polvo, abrasión ligera y sellado de pisos de concreto existentes.',
    basePrice: 180,
    unit: 'm²',
    icon: '🛡️'
  },
  {
    id: 'restauracion_fisuras',
    name: 'Restauración y Reparación de Fisuras',
    description: 'Tratamiento de juntas de dilatación y renivelación de grietas estructurales con resina epóxica flexible.',
    basePrice: 120,
    unit: 'ml',
    icon: '🛠️'
  }
];

const SURFACE_CONDITIONS = [
  {
    id: 'excelente',
    name: 'Excelente / Concreto Nuevo',
    description: 'Superficie nivelada, limpia, lista para perfil de anclaje superficial.',
    multiplier: 1.0,
    prepCostPerM2: 25
  },
  {
    id: 'regular',
    name: 'Regular (Desgaste Moderado)',
    description: 'Requiere desbastado de diamante, bacheo menor y limpieza profunda de contaminantes.',
    multiplier: 1.15,
    prepCostPerM2: 55
  },
  {
    id: 'deteriorado',
    name: 'Muy Deteriorado / Pintura Previa',
    description: 'Remoción de recubrimientos viejos, granallado/escarificado intensivo y resane general.',
    multiplier: 1.35,
    prepCostPerM2: 95
  }
];

const DEFAULT_EXTRAS = [
  {
    id: 'zoclo_sanitario',
    name: 'Zoclo / Curva Sanitaria',
    description: 'Elimina ángulos de 90° en juntas pared-piso (Cumple COFEPRIS)',
    unitPrice: 160,
    unit: 'ml',
    defaultQty: 20,
    useArea: false
  },
  {
    id: 'bacheo_reparacion',
    name: 'Bacheo y Calafateo Profundo',
    description: 'Demolición de concreto dañado, limpieza y relleno con mortero epóxico o uretano de alta resistencia mecánica.',
    unitPrice: 250,
    unit: 'm²',
    useArea: true
  },
  {
    id: 'demarcacion_lineas',
    name: 'Líneas de Delimitación y Señalética (10 cm)',
    description: 'Trazado y pintura epóxica/poliuretano de alta visibilidad en 10 cm de ancho para delimitación de pasillos, pasos peatonales y cajones.',
    unitPrice: 45,
    unit: 'm',
    useArea: false
  },
  {
    id: 'tratamiento_grietas',
    name: 'Sellado y Cursado de Grietas / Juntas',
    description: 'Apertura de grietas con disco de diamante, limpieza con aire a presión y sellado con elastómero o epóxico semi-rígido.',
    unitPrice: 65,
    unit: 'm',
    useArea: false
  },
  {
    id: 'curado_humedad',
    name: 'Barrera Anti-Humedad (Primer FDT)',
    description: 'Tratamiento primario epóxico tolerante a la humedad para losas de concreto con niveles de humedad relativa superiores al 4%.',
    unitPrice: 110,
    unit: 'm²',
    useArea: true
  }
];

export default function App() {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('el_custom_services');
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch(e) {
      return DEFAULT_SERVICES;
    }
  });

  const [extrasOptions, setExtrasOptions] = useState(() => {
    try {
      const saved = localStorage.getItem('el_custom_extras');
      return saved ? JSON.parse(saved) : DEFAULT_EXTRAS;
    } catch(e) {
      return DEFAULT_EXTRAS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('el_custom_services', JSON.stringify(services));
    } catch(e) {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('el_custom_extras', JSON.stringify(extrasOptions));
    } catch(e) {}
  }, [extrasOptions]);

  // Manejo de sistemas seleccionados con m2 independientes por sistema
  const [selectedSystems, setSelectedSystems] = useState([
    { serviceId: 'autonivelante', m2: 150, customPrice: undefined }
  ]);

  const [surfaceConditionId, setSurfaceConditionId] = useState('regular');
  const [includeIva, setIncludeIva] = useState(true);

  // Estados para control manual de descuento
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [customDiscountPercent, setCustomDiscountPercent] = useState(5);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [modalType, setModalType] = useState('system');
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'm²',
    icon: '🔹',
    useArea: true
  });

  const [activeExtras, setActiveExtras] = useState({});
  const [extraQuantities, setExtraQuantities] = useState({});

  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [activeTab, setActiveTab] = useState('cotizador');

  const handleResetApp = () => {
    if (window.confirm('¿Deseas restablecer el catálogo al estado maestro? Se actualizarán los servicios y adicionales.')) {
      localStorage.removeItem('el_custom_services');
      localStorage.removeItem('el_custom_extras');
      window.location.reload();
    }
  };

  const toggleSystemSelection = (serviceId) => {
    setSelectedSystems(prev => {
      const exists = prev.some(item => item.serviceId === serviceId);
      if (exists) {
        if (prev.length === 1) return prev;
        return prev.filter(item => item.serviceId !== serviceId);
      } else {
        return [...prev, { serviceId, m2: 100, customPrice: undefined }];
      }
    });
  };

  const handleM2Change = (serviceId, newM2) => {
    const val = Math.max(1, Number(newM2) || 0);
    setSelectedSystems(prev =>
      prev.map(item => item.serviceId === serviceId ? { ...item, m2: val } : item)
    );
  };

  const handlePriceChange = (serviceId, newPrice) => {
    setSelectedSystems(prev =>
      prev.map(item => {
        if (item.serviceId === serviceId) {
          return { ...item, customPrice: newPrice };
        }
        return item;
      })
    );
  };

  const handleResetPrice = (serviceId) => {
    setSelectedSystems(prev =>
      prev.map(item => {
        if (item.serviceId === serviceId) {
          return { ...item, customPrice: undefined };
        }
        return item;
      })
    );
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const id = 'custom_' + Date.now();
    const priceNum = Number(newItem.price) || 0;

    if (modalType === 'system') {
      const createdSystem = {
        id,
        name: newItem.name,
        description: newItem.description || 'Sistema personalizado',
        basePrice: priceNum,
        unit: newItem.unit || 'm²',
        icon: newItem.icon || '🔹'
      };
      setServices(prev => [...prev, createdSystem]);
    } else {
      const createdExtra = {
        id,
        name: newItem.name,
        description: newItem.description || 'Servicio complemento personalizado',
        unitPrice: priceNum,
        unit: newItem.unit || 'm²',
        useArea: newItem.useArea,
        defaultQty: 1
      };
      setExtrasOptions(prev => [...prev, createdExtra]);
    }

    setNewItem({
      name: '',
      description: '',
      price: '',
      unit: 'm²',
      icon: '🔹',
      useArea: true
    });
    setShowAddModal(false);
  };

  const handleDeleteService = (id, e) => {
    e.stopPropagation();
    if (services.length <= 1) return;
    setServices(prev => prev.filter(s => s.id !== id));
    setSelectedSystems(prev => prev.filter(s => s.serviceId !== id));
  };

  const handleDeleteExtra = (id, e) => {
    e.stopPropagation();
    setExtrasOptions(prev => prev.filter(ex => ex.id !== id));
    setActiveExtras(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const condition = useMemo(() => {
    return SURFACE_CONDITIONS.find(c => c.id === surfaceConditionId) || SURFACE_CONDITIONS[0];
  }, [surfaceConditionId]);

  // Área total suma de todos los sistemas seleccionados
  const totalAreaM2 = useMemo(() => {
    return selectedSystems.reduce((acc, sys) => acc + (Number(sys.m2) || 0), 0);
  }, [selectedSystems]);

  const activeSystemsDetailed = useMemo(() => {
    return selectedSystems.map(item => {
      const serviceObj = services.find(s => s.id === item.serviceId) || services[0];
      const effectivePrice = item.customPrice !== undefined && item.customPrice !== ''
        ? Number(item.customPrice)
        : serviceObj.basePrice;
      
      const sysM2 = item.m2 !== undefined ? Number(item.m2) : 100;
      const isModified = item.customPrice !== undefined && Number(item.customPrice) !== serviceObj.basePrice;
      const adjustedUnitPrice = effectivePrice * condition.multiplier;
      const totalCost = adjustedUnitPrice * sysM2;

      return {
        ...serviceObj,
        m2: sysM2,
        effectivePrice,
        isModified,
        adjustedUnitPrice,
        totalCost,
        rawCustomPrice: item.customPrice
      };
    });
  }, [selectedSystems, services, condition.multiplier]);

  const calculation = useMemo(() => {
    const grossMaterialLaborCost = activeSystemsDetailed.reduce((acc, sys) => acc + sys.totalCost, 0);

    // Lógica manual de porcentaje de descuento
    const discountPercentage = applyDiscount ? (customDiscountPercent / 100) : 0;

    const totalPrepCost = condition.prepCostPerM2 * totalAreaM2;

    let totalExtrasCost = 0;
    const breakdownExtras = [];

    extrasOptions.forEach(ext => {
      if (activeExtras[ext.id]) {
        let cost = 0;
        let qty = 0;
        if (ext.useArea) {
          qty = totalAreaM2;
          cost = ext.unitPrice * totalAreaM2;
        } else {
          qty = extraQuantities[ext.id] !== undefined ? extraQuantities[ext.id] : (ext.defaultQty || 1);
          cost = ext.unitPrice * qty;
        }
        totalExtrasCost += cost;
        breakdownExtras.push({
          name: ext.name,
          qty,
          unit: ext.unit || 'm²',
          unitPrice: ext.unitPrice,
          total: cost
        });
      }
    });

    const rawSubtotal = grossMaterialLaborCost + totalPrepCost + totalExtrasCost;
    const discountAmount = rawSubtotal * discountPercentage;
    const subtotalFinal = rawSubtotal - discountAmount;

    const ivaAmount = includeIva ? subtotalFinal * 0.16 : 0;
    const grandTotal = subtotalFinal + ivaAmount;

    const costPerM2Effective = totalAreaM2 > 0 ? (grandTotal / totalAreaM2) : 0;

    return {
      discountPercentage,
      discountAmount,
      grossMaterialLaborCost,
      totalPrepCost,
      totalExtrasCost,
      breakdownExtras,
      subtotalFinal,
      ivaAmount,
      grandTotal,
      costPerM2Effective
    };
  }, [activeSystemsDetailed, totalAreaM2, condition, includeIva, activeExtras, extraQuantities, extrasOptions, applyDiscount, customDiscountPercent]);

  const toggleExtra = (id) => {
    setActiveExtras(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateExtraQty = (id, val) => {
    const num = Math.max(1, parseInt(val) || 0);
    setExtraQuantities(prev => ({ ...prev, [id]: num }));
  };

  const handleDownloadPDF = () => {
    const element = document.querySelector('.pdf-container');

    if (window.html2pdf && element) {
      const opt = {
        margin:       [8, 10, 8, 10],
        filename:     `Cotizacion_Enrique_Lara_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  const handleCopyRichEmail = () => {
    const emailNode = document.getElementById('email-card-preview');
    if (!emailNode) return;

    try {
      const range = document.createRange();
      range.selectNode(emailNode);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      document.execCommand('copy');
      selection.removeAllRanges();

      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    } catch (e) {
      alert('Por favor selecciona la tarjeta visual manualmente con el cursor y presiona Copiar.');
    }
  };

  const handleSendEmailClient = () => {
    const recipient = clientInfo.email || '';
    const subject = encodeURIComponent(`Cotización de Piso Industrial - Enrique Lara (${clientInfo.company || clientInfo.name || 'Proyecto'})`);
    
    const bodyText = `Hola, ${clientInfo.name || 'Cliente'}:\n\n` +
      `Espero que tengas un excelente día. Te comparto la cotización solicitada para el proyecto de pisos epóxicos.\n\n` +
      `Proyecto: ${clientInfo.company || 'Pisos Industriales'}\n` +
      `El archivo adjunto incluye el detalle de materiales, proceso de aplicación y la inversión total estimada.\n\n` +
      `Quedo a tus órdenes para resolver cualquier duda técnica sobre el proceso.\n\n` +
      `¡Saludos!\n\n` +
      `__________________________________\n` +
      `Enrique Lara\n` +
      `PROYECTOS Y PISOS INDUSTRIALES\n` +
      `Tel: +52 55 6220 1871\n` +
      `Email: kikelara12333@gmail.com`;

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const generateWhatsAppMessage = () => {
    const systemsListText = activeSystemsDetailed
      .map(sys => `  • ${sys.name} (${sys.m2} m²): $${sys.effectivePrice.toLocaleString('es-MX')} MXN / m²`)
      .join('\n');

    const text = `*COTIZACIÓN DE PISO INDUSTRIAL*
*Enrique Lara - Pisos Industriales*
__________________________________
*Cliente:* ${clientInfo.name || 'Cliente Particular'}
*Empresa:* ${clientInfo.company || 'N/A'}
*Contacto:* ${clientInfo.phone || 'No especificado'} | ${clientInfo.email || 'N/A'}

*SISTEMAS INCLUIDOS EN LA PROPUESTA:*
${systemsListText}

*DETALLES TÉCNICOS:*
- *Área Total Acumulada:* ${totalAreaM2} m²
- *Estado de la Superficie:* ${condition.name}

*ADICIONALES INCLUIDOS:*
${calculation.breakdownExtras.length > 0 
  ? calculation.breakdownExtras.map(e => `  - ${e.name} (${e.qty} ${e.unit}): $${e.total.toLocaleString('es-MX')} MXN`).join('\n')
  : '  - Ningún adicional seleccionado'}

*DESGLOSE ECONÓMICO:*
- *Subtotal:* $${calculation.subtotalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN ${calculation.discountPercentage > 0 ? `(¡Incluye ${(calculation.discountPercentage*100).toFixed(0)}% desc. especial!)` : ''}
${includeIva ? `• *IVA (16%):* $${calculation.ivaAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN\n` : ''}• *PRECIO TOTAL ESTIMADO:* $${calculation.grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
- *Costo promedio aproximado por m²:* $${calculation.costPerM2Effective.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN

*Notas Adicionales:* ${clientInfo.notes || 'Sin observaciones.'}
__________________________________
_Generado desde Sistema de Cotización_`;

    const encodedText = encodeURIComponent(text);
    const phoneParam = clientInfo.phone ? clientInfo.phone.replace(/\D/g,'') : '';
    window.open(`https://wa.me/${phoneParam}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 pb-12 w-full">
      <style>{`
  @media print {
    @page {
      size: letter portrait;
      margin: 12mm;
    }

    *, *::before, *::after {
      background: transparent !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    html, body {
      background: #ffffff !important;
      background-color: #ffffff !important;
      color: #0f172a !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print\\:hidden, header, button, .fixed {
      display: none !important;
    }

    .pdf-container {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      background: #ffffff !important;
      font-size: 11px !important;
    }

    .pdf-table {
      width: 100% !important;
      table-layout: fixed !important;
    }

    .pdf-grid-2 {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 16px !important;
    }

    .pdf-no-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  }
`}</style>

      {/* HEADER RESPONSIVO */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl print:hidden w-full">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl sm:text-2xl shrink-0">
                EL
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase">
                    Enrique <span className="text-amber-400">Lara</span>
                  </h1>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Pisos Industriales y Recubrimientos Epóxicos
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab('cotizador')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'cotizador'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🧮 Cotizar
            </button>
            <button
              onClick={() => setActiveTab('resumen')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'resumen'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              📄 Vista PDF
            </button>
            <button
              type="button"
              onClick={handleResetApp}
              title="Restablecer catálogo maestro"
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-1 border border-slate-800 hover:border-amber-500/40"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6 w-full">
        {activeTab === 'cotizador' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
            
            {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 w-full">
              <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                      1
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        📚 Sistemas Epóxicos y Superficies
                      </h2>
                      <p className="text-[11px] sm:text-xs text-amber-400/90 font-medium mt-0.5">
                        * Asigna m² independientes a cada sistema
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setModalType('system');
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/40 text-[11px] sm:text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all shrink-0"
                  >
                    + Nuevo
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {services.map((s) => {
                    const selectedItem = selectedSystems.find(item => item.serviceId === s.id);
                    const isSelected = !!selectedItem;
                    const currentPrice = selectedItem && selectedItem.customPrice !== undefined ? selectedItem.customPrice : s.basePrice;
                    const isModified = selectedItem && selectedItem.customPrice !== undefined && Number(selectedItem.customPrice) !== s.basePrice;
                    const currentM2 = selectedItem ? selectedItem.m2 : 100;

                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleSystemSelection(s.id)}
                        className={`cursor-pointer p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col gap-3 relative group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                            : 'bg-slate-900/50 border-slate-700/60 hover:border-slate-500 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} 
                                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
                              />
                            </div>
                            <span className="text-xl sm:text-2xl p-1.5 sm:p-2 bg-slate-800 rounded-lg shrink-0">{s.icon}</span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-white text-sm sm:text-base">{s.name}</h3>
                                {isSelected && (
                                  <span className="bg-amber-500/20 text-amber-400 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                    Incluido
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                {s.description}
                              </p>
                            </div>
                          </div>

                          <div 
                            className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800 flex items-center sm:flex-col justify-between sm:justify-start sm:items-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400 font-semibold">
                                Precio Base (${s.unit}):
                              </span>
                              {s.id.startsWith('custom_') && (
                                <button
                                  onClick={(e) => handleDeleteService(s.id, e)}
                                  title="Eliminar sistema personalizado"
                                  className="text-rose-400 hover:text-rose-300 p-0.5 rounded hover:bg-rose-500/20"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-amber-400 font-bold">$</span>
                              <input
                                type="number"
                                value={currentPrice}
                                onChange={(e) => {
                                  if (!isSelected) toggleSystemSelection(s.id);
                                  handlePriceChange(s.id, e.target.value);
                                }}
                                className={`w-20 sm:w-24 bg-slate-950 border rounded-lg px-2 py-1 text-right font-extrabold text-amber-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                  isModified ? 'border-amber-400 bg-amber-500/10' : 'border-slate-700'
                                }`}
                              />
                              {isModified && (
                                <button
                                  type="button"
                                  onClick={() => handleResetPrice(s.id)}
                                  title="Restablecer precio original"
                                  className="text-slate-400 hover:text-amber-400 p-1"
                                >
                                  🔄
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* INPUT PARA SUPERFICIE INDEPENDIENTE */}
                        {isSelected && (
                          <div 
                            className="mt-1 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs bg-slate-950/40 p-2.5 rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                              📐 Área para este sistema:
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                value={currentM2}
                                onChange={(e) => handleM2Change(s.id, e.target.value)}
                                className="w-24 bg-slate-950 border border-amber-500/60 rounded-lg px-2.5 py-1 text-right font-black text-amber-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                              <span className="text-slate-400 font-bold">m²</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                    2
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      🛠️ Estado del Concreto y Descuentos
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      Área total acumulada: <strong className="text-amber-400">{totalAreaM2} m²</strong>
                    </p>
                  </div>
                </div>

                {/* CONTROL MANUAL DE DESCUENTO POR VOLUMEN / NEGOCIACIÓN */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 mb-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyDiscount}
                        onChange={(e) => setApplyDiscount(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        🏷️ Aplicar Descuento Especial / Volumen
                      </span>
                    </label>

                    {applyDiscount && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={customDiscountPercent}
                          onChange={(e) => setCustomDiscountPercent(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                          className="w-16 bg-slate-950 border border-emerald-500/60 rounded-lg px-2 py-1 text-right font-bold text-emerald-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-emerald-400 font-bold text-sm">%</span>
                      </div>
                    )}
                  </div>

                  {applyDiscount && (
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800">
                      {[5, 8, 10, 12, 15].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setCustomDiscountPercent(pct)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                            customDiscountPercent === pct
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500/50'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-3">
                    Estado Actual del Concreto (Aplica a toda la superficie):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {SURFACE_CONDITIONS.map((cond) => {
                      const isSelected = surfaceConditionId === cond.id;
                      return (
                        <button
                          key={cond.id}
                          type="button"
                          onClick={() => setSurfaceConditionId(cond.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500'
                              : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:bg-slate-900'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-slate-200 mb-1">
                              {cond.name}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight">
                              {cond.description}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400/90 mt-2 block">
                            +${cond.prepCostPerM2} MXN/m² prep.
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                      3
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      🛠️ Complementos y Adicionales
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setModalType('extra');
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/40 text-[11px] sm:text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all shrink-0"
                  >
                    + Nuevo
                  </button>
                </div>

                <div className="space-y-2.5">
                  {extrasOptions.map((ext) => {
                    const isChecked = activeExtras[ext.id];
                    return (
                      <div
                        key={ext.id}
                        className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                          isChecked
                            ? 'bg-slate-900 border-amber-500/80'
                            : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={!!isChecked}
                              onChange={() => toggleExtra(ext.id)}
                              className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-xs sm:text-sm text-slate-200 block">
                                  {ext.name}
                                </span>
                                {ext.id.startsWith('custom_') && (
                                  <button
                                    onClick={(e) => handleDeleteExtra(ext.id, e)}
                                    title="Eliminar complemento personalizado"
                                    className="text-rose-400 hover:text-rose-300 p-0.5 rounded hover:bg-rose-500/20"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block mt-0.5 leading-tight">
                                {ext.description}
                              </span>
                            </div>
                          </label>

                          <div className="text-right shrink-0">
                            <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">
                              ${ext.unitPrice} MXN /{ext.unit}
                            </span>
                          </div>
                        </div>

                        {isChecked && !ext.useArea && (
                          <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                            <span>Cantidad ({ext.unit}):</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                value={extraQuantities[ext.id] !== undefined ? extraQuantities[ext.id] : (ext.defaultQty || 1)}
                                onChange={(e) => updateExtraQty(ext.id, e.target.value)}
                                className="w-16 sm:w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-amber-400 font-bold"
                              />
                              <span>{ext.unit}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                    4
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    👤 Datos del Cliente
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      placeholder="Ej. Ing. Carlos Mendoza"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Empresa / Proyecto</label>
                    <input
                      type="text"
                      placeholder="Ej. Restaurante / Nave Industrial"
                      value={clientInfo.company}
                      onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="Ej. 55 1234 5678"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="contacto@empresa.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">Notas Especiales</label>
                    <textarea
                      rows={2}
                      placeholder="Ej. Horario nocturno, requiere levantamiento..."
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* COLUMNA DERECHA: RESUMEN DE COSTOS */}
            <div className="lg:col-span-5 w-full lg:sticky lg:top-24 lg:self-start">
              <div className="bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
                <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                      Presupuesto Estimado
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">Resumen General</h3>
                  </div>
                  <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 border border-amber-500/20 text-lg sm:text-xl">
                    📊
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1.5 uppercase text-[10px] sm:text-[11px] tracking-wider">
                      Sistemas Epóxicos Aplicados:
                    </span>
                    <div className="space-y-2 pl-2 border-l-2 border-amber-500/40">
                      {activeSystemsDetailed.map((sys) => (
                        <div key={sys.id} className="flex justify-between items-start text-slate-200 gap-2">
                          <div>
                            <span className="font-semibold block text-white text-xs sm:text-sm">{sys.name}</span>
                            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                              {sys.m2} m² × ${sys.effectivePrice.toLocaleString('es-MX')} MXN
                            </span>
                          </div>
                          <span className="font-mono font-medium text-slate-200 text-xs sm:text-sm shrink-0">
                            ${sys.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-300 pt-1 text-xs sm:text-sm">
                    <span className="text-slate-400">Preparación ({condition.name}):</span>
                    <span className="font-mono font-medium text-slate-200">
                      ${calculation.totalPrepCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {calculation.totalExtrasCost > 0 && (
                    <div className="flex justify-between items-center text-slate-300 text-xs sm:text-sm">
                      <span className="text-slate-400">Adicionales / Extras:</span>
                      <span className="font-mono font-medium text-amber-400">
                        +${calculation.totalExtrasCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  {calculation.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-400 font-medium text-xs sm:text-sm">
                      <span>Descuento Especial ({(calculation.discountPercentage * 100).toFixed(0)}%):</span>
                      <span className="font-mono">
                        -${calculation.discountAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <hr className="border-slate-800 my-2" />

                  <div className="flex justify-between items-center font-bold text-slate-200 text-xs sm:text-sm">
                    <span>Subtotal:</span>
                    <span className="font-mono">
                      ${calculation.subtotalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 pb-1">
                    <label className="text-xs text-slate-400 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeIva}
                        onChange={(e) => setIncludeIva(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 cursor-pointer"
                      />
                      Incluir IVA (16%)
                    </label>
                    <span className="text-xs font-mono text-slate-400">
                      {includeIva ? `$${calculation.ivaAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                    </span>
                  </div>

                  <hr className="border-slate-700/80 my-2" />

                  <div className="bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-amber-500/30 text-center">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Costo Total Estimado
                    </span>
                    <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
                      ${calculation.grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-xs font-sans text-slate-400 font-normal ml-1">MXN</span>
                    </div>
                    
                    <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] sm:text-xs font-medium border border-slate-700">
                      ✨ Promedio ({totalAreaM2} m²): <strong className="text-white">${calculation.costPerM2Effective.toFixed(2)} MXN / m²</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={generateWhatsAppMessage}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm uppercase tracking-wide"
                  >
                    💬 Enviar por WhatsApp
                  </button>

                  <button
                    onClick={() => setActiveTab('resumen')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
                  >
                    📄 Ver/Imprimir Formato PDF
                  </button>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[10px] sm:text-[11px] text-slate-400 flex items-start gap-1.5">
                  ⚠️ <p className="leading-tight">
                    <strong>Nota:</strong> Precios paramétricos sujetos a inspección técnica en sitio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA PREVIA FORMATO PDF */}
        {activeTab === 'resumen' && (
          <div className="space-y-5 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-700 gap-3 print:hidden">
              <button
                onClick={() => setActiveTab('cotizador')}
                className="text-slate-300 hover:text-white flex items-center gap-1.5 text-xs sm:text-sm font-semibold self-start sm:self-auto"
              >
                ← Volver al Cotizador
              </button>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="flex-1 sm:flex-none bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold px-3.5 py-2 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition-all"
                >
                  ✉️ Plantilla Correo
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition-all"
                >
                  📥 Descargar PDF
                </button>
              </div>
            </div>

            {/* CONTENEDOR PDF */}
            <div className="pdf-container bg-white text-slate-900 p-6 sm:p-12 rounded-2xl shadow-2xl font-sans border border-slate-200 mx-auto">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-6 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                    Enrique <span className="text-amber-600">Lara</span>
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    Pisos Industriales y Recubrimientos Epóxicos
                  </p>
                  <p className="text-xs text-slate-500">
                    Atención personalizada y cotización directa
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="inline-block bg-slate-900 text-white font-bold px-3 py-1 rounded uppercase mb-1 shadow-sm">
                    Cotización
                  </span>
                  <p className="text-slate-500">
                    Fecha: <strong className="text-slate-800">{new Date().toLocaleDateString('es-MX')}</strong>
                  </p>
                  <p className="text-slate-500">
                    Vigencia: <strong className="text-slate-800">15 días naturales</strong>
                  </p>
                </div>
              </div>

              <div className="pdf-grid-2 grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
                <div>
                  <h4 className="font-extrabold uppercase text-slate-400 mb-1 text-[10px]">Datos del Cliente:</h4>
                  <p className="font-bold text-slate-900 text-sm">{clientInfo.name || 'Atención: Cliente General'}</p>
                  <p className="text-slate-600">{clientInfo.company || 'Empresa no especificada'}</p>
                  <p className="text-slate-600">{clientInfo.phone ? `Tel: ${clientInfo.phone}` : 'Sin teléfono'}</p>
                  <p className="text-slate-600">{clientInfo.email || 'Sin email'}</p>
                </div>
                <div>
                  <h4 className="font-extrabold uppercase text-slate-400 mb-1 text-[10px]">Especificación Técnica:</h4>
                  <p className="text-slate-800"><strong>Área total proyecto:</strong> {totalAreaM2} m²</p>
                  <p className="text-slate-800"><strong>Estado actual del suelo:</strong> {condition.name}</p>
                </div>
              </div>

              <div className="mb-6 overflow-x-auto">
                <table className="pdf-table w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-slate-800 uppercase font-bold text-[11px]">
                      <th className="py-2 px-1" style={{ width: '45%' }}>Concepto / Descripción</th>
                      <th className="py-2 px-1 text-center" style={{ width: '12%' }}>Unidad</th>
                      <th className="py-2 px-1 text-right" style={{ width: '12%' }}>Cant.</th>
                      <th className="py-2 px-1 text-right" style={{ width: '15%' }}>P. Unitario</th>
                      <th className="py-2 px-1 text-right" style={{ width: '16%' }}>Importe Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeSystemsDetailed.map((sys, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-1">
                          <strong className="text-slate-900 block">{sys.name}</strong>
                          <span className="text-slate-500 text-[10px] block leading-tight">{sys.description}</span>
                        </td>
                        <td className="py-2.5 px-1 text-center">{sys.unit}</td>
                        <td className="py-2.5 px-1 text-right font-mono">{sys.m2}</td>
                        <td className="py-2.5 px-1 text-right font-mono">${sys.adjustedUnitPrice.toFixed(2)}</td>
                        <td className="py-2.5 px-1 text-right font-mono font-bold text-slate-900">
                          ${sys.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td className="py-2.5 px-1">
                        <strong className="text-slate-900 block">Preparación de Superficie</strong>
                        <span className="text-slate-500 text-[10px] block leading-tight">{condition.name}</span>
                      </td>
                      <td className="py-2.5 px-1 text-center">m²</td>
                      <td className="py-2.5 px-1 text-right font-mono">{totalAreaM2}</td>
                      <td className="py-2.5 px-1 text-right font-mono">${condition.prepCostPerM2.toFixed(2)}</td>
                      <td className="py-2.5 px-1 text-right font-mono font-bold text-slate-900">
                        ${calculation.totalPrepCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>

                    {calculation.breakdownExtras.map((ext, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-1">
                          <strong className="text-slate-900 block">{ext.name}</strong>
                          <span className="text-slate-500 text-[10px]">Adicional solicitado</span>
                        </td>
                        <td className="py-2.5 px-1 text-center">{ext.unit}</td>
                        <td className="py-2.5 px-1 text-right font-mono">{ext.qty}</td>
                        <td className="py-2.5 px-1 text-right font-mono">${ext.unitPrice.toFixed(2)}</td>
                        <td className="py-2.5 px-1 text-right font-mono font-bold text-slate-900">
                          ${ext.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mb-6">
                <div className="w-full sm:w-1/2 space-y-1.5 text-xs">
                  {calculation.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Descuento Especial ({(calculation.discountPercentage * 100).toFixed(0)}%):</span>
                      <span className="font-mono">-${calculation.discountAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-700 font-bold border-t border-slate-200 pt-2">
                    <span>Subtotal:</span>
                    <span className="font-mono text-sm">${calculation.subtotalFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>

                  {includeIva && (
                    <div className="flex justify-between text-slate-600">
                      <span>I.V.A. (16%):</span>
                      <span className="font-mono">${calculation.ivaAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 font-extrabold text-base border-t-2 border-slate-900 pt-2">
                    <span>TOTAL ESTIMADO:</span>
                    <span className="font-mono text-amber-600">${calculation.grandTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                  </div>
                </div>
              </div>

              {clientInfo.notes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-6 text-xs text-slate-800">
                  <strong>Observaciones del cliente:</strong> {clientInfo.notes}
                </div>
              )}

              <div className="border-t-2 border-slate-900 pt-4 text-[11px] text-slate-700 space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase text-xs">
                  🛡️ Garantías y Requerimientos del Proyecto
                </h4>
                <p>• <strong>Garantía:</strong> 12 meses contra defectos de adherencia y vicios ocultos bajo condiciones normales de uso.</p>
                <p>• <strong>Requerimientos:</strong> Área libre de obstáculos, energía eléctrica 110/220v y concreto con mínimo 28 días de curado.</p>
                <p>• <strong>Condiciones de Pago:</strong> 60% Anticipo para materiales / 40% al finalizar el proyecto.</p>
              </div>

              <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-end text-center text-xs">
                <div>
                  <div className="w-36 border-b border-slate-400 mb-1 mx-auto"></div>
                  <p className="font-bold text-slate-800">Aceptado por el Cliente</p>
                  <p className="text-slate-500 text-[10px]">Firma / Sello de conformidad</p>
                </div>
                <div>
                  <div className="w-36 border-b border-slate-400 mb-1 mx-auto"></div>
                  <p className="font-bold text-slate-800">Enrique Lara</p>
                  <p className="text-slate-500 text-[10px]">Pisos Industriales</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL EMAIL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                ✉️ Vista Previa de la Plantilla Elegante
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-slate-300 text-slate-800 text-xs sm:text-sm">
              <div id="email-card-preview" className="bg-white rounded-xl shadow-xl border border-amber-500/30 overflow-hidden font-sans">
                <div className="bg-slate-50 text-slate-900 px-6 py-4 flex justify-between items-center border-b-2 border-amber-500">
                  <span className="font-black text-sm uppercase tracking-wider text-slate-900">
                    ENRIQUE <span className="text-amber-600">LARA</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    PROPUESTA COMERCIAL
                  </span>
                </div>

                <div className="p-6 space-y-4 bg-white">
                  <p className="text-slate-800 font-semibold text-sm">
                    Hola, <span className="text-amber-700 font-bold">{clientInfo.name || 'Estimado Cliente'}</span>:
                  </p>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                    Espero que tengas un excelente día. Te comparto la cotización solicitada para el proyecto de recubrimientos y pisos epóxicos.
                  </p>

                  <div className="bg-slate-50 border-l-4 border-amber-500 p-4 rounded-r-xl border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 block text-xs sm:text-sm font-bold">
                      Proyecto: {clientInfo.company || 'Pisos Industriales'}
                    </strong>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      El archivo adjunto incluye el desglose de conceptos, especificaciones técnicas y la inversión total estimada.
                    </p>
                  </div>

                  <p className="text-slate-600 text-xs">
                    Quedo a tus órdenes para coordinar la inspección técnica o resolver cualquier duda sobre el proceso.
                  </p>
                  <p className="text-slate-800 font-bold text-xs pt-1">¡Saludos cordiales!</p>
                </div>

                <div className="bg-slate-50 text-slate-800 p-5 border-t border-slate-200 text-center space-y-1">
                  <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    Enrique Lara
                  </h4>
                  <p className="text-[10px] text-amber-600 uppercase tracking-widest font-extrabold mb-2">
                    PISOS INDUSTRIALES Y RECUBRIMIENTOS
                  </p>
                  <div className="flex justify-center items-center gap-4 text-[11px] font-medium pt-1 text-slate-600">
                    <span>📞 +52 55 6220 1871</span>
                    <span>✉️ kikelara12333@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {copiedSuccess && (
              <div className="bg-emerald-600 text-white text-xs text-center py-2 font-bold animate-fade-in">
                ¡Diseño elegante copiado! Abre Gmail y presiona Pegar (Ctrl + V)
              </div>
            )}

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={handleCopyRichEmail}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                📋 Copiar Diseño Elegante
              </button>

              <button
                onClick={handleSendEmailClient}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                🚀 Abrir App de Correo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESPONSIVO AGREGAR SISTEMA / EXTRA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
              ➕ {modalType === 'system' ? 'Agregar Sistema' : 'Agregar Complemento'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Se guardará localmente en tu dispositivo.
            </p>

            <form onSubmit={handleAddNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder={modalType === 'system' ? 'Ej. Poliuretano Cementicio' : 'Ej. Chaflán Elastomérico'}
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Descripción breve..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Precio (MXN) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="450"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Unidad</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="m²">m²</option>
                    <option value="ml">ml</option>
                    <option value="pza">pza</option>
                  </select>
                </div>
              </div>

              {modalType === 'system' ? (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Emoji / Icono</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="🧪"
                    value={newItem.icon}
                    onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg p-2 text-center text-base text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              ) : (
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newItem.useArea}
                      onChange={(e) => setNewItem({ ...newItem, useArea: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                    />
                    <span>¿Multiplicar por área total (m²)?</span>
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}