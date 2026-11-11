import { PsychotherapyTechnique } from '../types/clinical';

export const PSYCHOTHERAPY_LIBRARY: PsychotherapyTechnique[] = [
  // --- TCC ---
  {
    id: 'tcc-reestructuracion',
    modality: 'TCC',
    title: 'Reestructuración Cognitiva y Registro de Pensamientos Disfuncionales',
    summary: 'Técnica nuclear para identificar, someter a prueba de realidad y reformular distorsiones cognitivas automáticas.',
    objective: 'Flexibilizar sesgos interpretativos rígidos (catastrofismo, pensamiento todo-o-nada, lectura de mente) y reducir la reactividad emocional ansioso-depresiva.',
    stepByStepProcedure: [
      '1. Psicoeducación: Explicar el modelo A-B-C (Acontecimiento detonante -> Creencia/Pensamiento -> Consecuencia emocional y conductual).',
      '2. Identificación del Pensamiento Automático Negativo (PAN) emergente en el momento de mayor malestar.',
      '3. Calificación de la intensidad emocional (0-100%) y grado de convicción en el pensamiento.',
      '4. Búsqueda de pruebas empíricas a favor y en contra del pensamiento (interrogatorio socrático).',
      '5. Identificación de la distorsión cognitiva predominante (ej. sobregeneralización).',
      '6. Construcción colaborativa de un pensamiento alternativo realista y equilibrado.',
      '7. Reevaluación de la intensidad emocional y planificación de acción constructiva.',
    ],
    recommendedCases: [
      'Trastorno Depresivo Mayor con autorreproches',
      'Trastorno de Ansiedad Generalizada y Fobia Social',
      'Ataques de Pánico con interpretaciones catastróficas somáticas',
    ],
    clinicalExampleDialogue: [
      {
        therapist: 'Cuando sentiste ese vuelco en el pecho en la reunión, ¿qué idea cruzó por tu mente en una fracción de segundo?',
        patient: 'Pensé: "Me va a dar un infarto frente a todos, voy a hacer el ridículo y tendrán que llamar a una ambulancia".',
        therapeuticIntent: 'Capturar el pensamiento automático caliente (hot cognition) asociado al pico fisiológico.',
      },
      {
        therapist: 'Entiendo que esa idea fue aterradora. En ese instante, ¿qué porcentaje de certeza sentías de que era un infarto real?',
        patient: 'Un 95%. Sentía que era mi fin.',
        therapeuticIntent: 'Cuantificar la creencia subjetiva previa al examen de evidencia.',
      },
      {
        therapist: 'Examinemos los datos objetivos: ¿cuántas veces en los últimos 6 meses has tenido esa misma palpitación exacta? Y de esas veces, ¿cuántos infartos ocurrieron?',
        patient: 'Al menos unas 15 veces... y nunca fue infarto. El cardiólogo me dijo que mi corazón está sano.',
        therapeuticIntent: 'Desmantelar el sesgo de confirmación contrastando con la realidad médica.',
      },
      {
        therapist: 'Si un amigo te dijera que siente ese aleteo por estrés tras tomar cafeína, ¿qué interpretación más compasiva y médica le darías?',
        patient: 'Le diría: "Tranquilo, es solo una descarga de adrenalina inofensiva por la tensión de la junta, va a bajar en 5 minutos si respiras".',
        therapeuticIntent: 'Generar el pensamiento alternativo adaptativo desde una perspectiva desapegada.',
      },
    ],
  },
  {
    id: 'tcc-flecha-descendente',
    modality: 'TCC',
    title: 'Técnica de la Flecha Descendente (Downward Arrow)',
    summary: 'Método de profundización para desvelar creencias intermedias (reglas, suposiciones) y creencias nucleares sobre uno mismo, los demás y el mundo.',
    objective: 'Hacer consciente el núcleo esquemático profundo (ej. "Soy incompetente", "No merezco ser amado") que nutre los pensamientos automáticos superficiales.',
    stepByStepProcedure: [
      '1. Seleccionar un pensamiento automático recurrente de alto impacto afectivo.',
      '2. Asumir temporalmente que dicho pensamiento fuera 100% verídico: "¿Si esto fuera verdad, qué significaría para ti?".',
      '3. Encadenar preguntas sucesivas de significado ("¿Y si eso fuera así, qué diría eso sobre quién eres tú?").',
      '4. Continuar la secuencia vertical hasta llegar a la creencia nuclear incondicional (esquema del self).',
      '5. Trazar el origen biográfico temprano de esa creencia y planificar su desaprendizaje.',
    ],
    recommendedCases: [
      'Perfeccionismo clínico desadaptativo y procrastinación por miedo al error',
      'Baja autoestima crónica resistente a reestructuraciones superficiales',
      'Distimia de larga data',
    ],
    clinicalExampleDialogue: [
      {
        therapist: 'Mencionas que si cometes un error en el reporte de trabajo, tus colegas pensarán mal de ti. Asumamos por un momento que cometieras ese error y lo notaran... ¿qué significaría eso para ti?',
        patient: 'Significaría que pensarán que no estoy calificado para el puesto.',
        therapeuticIntent: 'Primera bajada: del miedo a la evaluación al significado de competencia.',
      },
      {
        therapist: 'Y si ellos pensaran que no estás calificado, ¿qué implicaría eso en lo más profundo?',
        patient: 'Que tarde o temprano me van a despedir y fracasaré.',
        therapeuticIntent: 'Segunda bajada hacia la catástrofe anticipada.',
      },
      {
        therapist: 'Y si fueras despedido y pasaras por ese tropiezo laboral, ¿qué diría eso acerca de ti como ser humano?',
        patient: '(Silencio reflexivo) ... Diría que soy un fraude total. Que no valgo nada si no soy perfecto.',
        therapeuticIntent: 'Alcanzar la creencia nuclear básica condicional: Autoestima ligada al 100% de rendimiento perfecto.',
      },
    ],
  },

  // --- ACT ---
  {
    id: 'act-defusion',
    modality: 'ACT',
    title: 'Defusión Cognitiva y el "Yo como Contexto"',
    summary: 'Proceso de desapego de los contenidos mentales, transformando la relación con los pensamientos en lugar de debatir su contenido.',
    objective: 'Reducir la fusión cognitiva donde el paciente trata sus pensamientos como verdades literales, órdenes o amenazas físicas.',
    stepByStepProcedure: [
      '1. Identificar pensamientos pegajosos con los que el paciente está severamente fusionado.',
      '2. Ejercicio de reformulación lingüística: cambiar "Soy un inútil" por "Estoy teniendo el pensamiento de que soy un inútil".',
      '3. Añadir una segunda capa de consciencia: "Me doy cuenta de que estoy notando que mi mente me está diciendo que soy un inútil".',
      '4. Metáfora del Cielo y el Clima: El self es el cielo inmutable y espacioso; los pensamientos y ansiedades son nubes o tormentas pasajeras.',
      '5. Técnica de "Agradecer a la mente": Tratar a la mente como un sistema de alarma hipervigilante bienintencionado pero descalibrado.',
    ],
    recommendedCases: [
      'Rumiación depresiva obsesiva que no cede con debate lógico',
      'Trastorno de Ansiedad Generalizada con metacogniciones',
      'Dolor crónico comórbido con frustración',
    ],
    clinicalExampleDialogue: [
      {
        therapist: 'Nota cómo tu mente te repite una y otra vez: "Esto no va a funcionar, estás condenado". En lugar de pelear con esa frase para demostrar que no es cierta, inténtalo de esta manera: di en voz alta: "Noto que mi mente me está contando la vieja historia del fracaso".',
        patient: 'Noto que mi mente me está contando la vieja historia del fracaso... Se siente diferente. Menos pesado.',
        therapeuticIntent: 'Crear una distancia observadora entre el sujeto que percibe y el producto verbal de la mente.',
      },
      {
        therapist: 'Exacto. Tu mente es como una radio encendida en la esquina de la habitación transmitiendo un canal de noticias alarmistas. ¿Puedes permitir que la radio suene de fondo mientras tú continúas cocinando la cena con tu familia?',
        patient: 'Puedo oírla sin tener que subirle el volumen ni apagar la estufa.',
        therapeuticIntent: 'Fomentar la acción comprometida a pesar del ruido cognitivo interno.',
      },
    ],
  },
  {
    id: 'act-clarificacion-valores',
    modality: 'ACT',
    title: 'Clarificación de Valores Cardinales y Acción Comprometida',
    summary: 'Exploración de lo que verdaderamente importa en el corazón del paciente para orientar su conducta hacia una vida con sentido vital.',
    objective: 'Diferenciar metas finitas (cerradas) de valores de vida (direcciones continuas), promoviendo pasos conductuales guiados por el significado.',
    stepByStepProcedure: [
      '1. Evaluación de dominios vitales: Relaciones afectivas, Crecimiento personal, Salud, Espiritualidad/Trascendencia, Contribución comunitaria.',
      '2. Ejercicio del Epitafio o Cumpleaños 80: "¿Cómo desearías ser recordado por las personas que amas?".',
      '3. Identificación de discrepancias entre los valores anhelados y el tiempo real invertido por evitación experiencial.',
      '4. Establecimiento de micrometas SMART guiadas por valores para la próxima semana.',
      '5. Anticipación de barreras internas (miedos, pereza) y disposición voluntaria a experimentarlas a cambio de vivir con valor.',
    ],
    recommendedCases: [
      'Crisis existenciales, sensación de vacío o transición vital',
      'Depresión mayor con aislamiento social defensivo',
      'Duelo prolongado con pérdida de rumbo',
    ],
    clinicalExampleDialogue: [
      {
        therapist: 'Imagina que llegas a tus 80 años y miras hacia atrás en tu vida. ¿Qué te gustaría que tus hijos dijeran sobre el tipo de padre que fuiste, no en cuanto a dinero, sino en presencia?',
        patient: 'Me gustaría que dijeran que fui alguien que los escuchó, que estuvo presente con paciencia y que no vivió escondido en el trabajo o el celular.',
        therapeuticIntent: 'Activar el motor de valor intrínseco (Presencia y Amor Incondicional).',
      },
      {
        therapist: '¿Y qué paso pequeño, de apenas 15 minutos hoy al llegar a casa, encarnaría ese valor, incluso si vienes exhausto del trabajo?',
        patient: 'Sentarme en el piso con mi hija pequeña a jugar sin mirar las notificaciones del teléfono.',
        therapeuticIntent: 'Aterrizar el valor en una conducta concreta, tangible y no negociable.',
      },
    ],
  },

  // --- TERAPIA DE ESQUEMAS ---
  {
    id: 'esquemas-modo-nino',
    modality: 'Esquemas',
    title: 'Trabajo con el Modo Niño Vulnerable y Reparentalización Limitada',
    summary: 'Intervención experiencial para conectar con las necesidades emocionales básicas insatisfechas en la infancia.',
    objective: 'Sanar heridas tempranas de abandono, privación emocional o defecto, activando el Modo Adulto Sano para brindar contención.',
    stepByStepProcedure: [
      '1. Identificación del disparador actual que reactiva el Modo Niño Vulnerable (ej. un mensaje no respondido).',
      '2. Conexión somática: ubicar dónde se siente el dolor o la angustia en el cuerpo.',
      '3. Puente de afecto (Affect Bridge): evocar el recuerdo infantil más temprano donde sintió esa misma desolación.',
      '4. Diálogo de imaginería reescrita (Imagery Rescripting): el terapeuta entra en la escena infantil para proteger al niño.',
      '5. El Adulto Sano del paciente asume gradualmente el cuidado de sus propias necesidades emocionales.',
    ],
    recommendedCases: [
      'Trastorno Límite de la Personalidad y Trastorno de la Personalidad Dependiente',
      'Trauma infantil complejo (abandono o negligencia parental)',
      'Sentimientos crónicos de vacío e indignidad',
    ],
    clinicalExampleDialogue: [
      {
        therapist: 'Cierra los ojos un momento y siente esa pesadez en el pecho tras la discusión con tu pareja. Si esa sensación pudiera hablar con la voz de tu niño de 7 años, ¿qué está gritando?',
        patient: 'Está diciendo: "Nadie me ve, no le importo a nadie, me van a dejar solo otra vez en este cuarto oscuro".',
        therapeuticIntent: 'Acceder al Modo Niño Vulnerable con el esquema de Abandono/Inestabilidad.',
      },
      {
        therapist: 'Mírame aquí contigo. Entro a esa habitación de tu infancia. Me pongo entre ti y los adultos que te gritaban. Te digo: "Tú no tienes la culpa, eres valioso y yo no te voy a dejar solo". ¿Cómo lo siente tu niño?',
        patient: 'Respira más aliviado... por primera vez siente que alguien lo defiende.',
        therapeuticIntent: 'Reparentalización limitada para satisfacer la necesidad de protección y validación.',
      },
    ],
  },

  // --- ENTREVISTA MOTIVACIONAL ---
  {
    id: 'em-oars-balance',
    modality: 'Entrevista Motivacional',
    title: 'Habilidades OARS y Balance Decisional para la Ambivalencia',
    summary: 'Abordaje centrado en la persona para explorar y resolver la ambivalencia respecto al cambio de conductas perjudiciales.',
    objective: 'Evocar el "discurso de cambio" (change talk) del propio paciente en lugar de argumentar o imponer directivas desde el rol de experto.',
    stepByStepProcedure: [
      '1. Preguntas Abiertas (Open Questions): Estimular al paciente a explorar sus razones personales para cambiar.',
      '2. Afirmaciones (Affirmations): Reconocer fortalezas y esfuerzos previos de supervivencia.',
      '3. Escucha Reflexiva (Reflective Listening): Reflejar tanto el deseo de mantener el hábito como el costo de continuar igual.',
      '4. Resúmenes (Summaries): Sintetizar la ambivalencia destacando las contradicciones internas.',
      '5. Matriz de Balance Decisional: Pros y contras de mantener el statu quo vs pros y contras del cambio.',
    ],
    recommendedCases: [
      'Falta de adherencia a la psicofarmacología por ambivalencia o miedo a la dependencia',
      'Consumo problemático de sustancias o conductas adictivas',
      'Resistencia a iniciar cambios en estilo de vida (sueño, ejercicio, aislamiento)',
    ],
    clinicalExampleDialogue: [
      {
        therapist: 'Por un lado, suspender el estabilizador te hace sentir más creativo y libre; pero por otro lado, recuerdas el dolor y las deudas que dejó la última fase maníaca descompensada.',
        patient: 'Es verdad... odio tomar pastillas todos los días, pero tampoco puedo permitirme perder a mi familia ni mi empleo otra vez.',
        therapeuticIntent: 'Reflejo complejo de dos caras para hacer evidente la discrepancia con sus metas vitales.',
      },
      {
        therapist: 'En una escala del 1 al 10, donde 1 es "ningún interés" y 10 es "compromiso absoluto", ¿en qué número te sitúas hoy respecto a continuar el tratamiento?',
        patient: 'En un 7.',
        therapeuticIntent: 'Uso de la regla de importancia para elicitar discurso de cambio.',
      },
      {
        therapist: '¿Y por qué elegiste un 7 y no un número más bajo como un 3 o un 4?',
        patient: 'Porque ya estoy cansado del caos. Quiero tener una vida predecible donde mis hijos se sientan seguros a mi alrededor.',
        therapeuticIntent: 'Hacer que el propio paciente argumente verbalmente las razones para el cambio.',
      },
    ],
  },

  // --- PSICOLOGÍA POSITIVA ---
  {
    id: 'psi-pos-fortalezas-resiliencia',
    modality: 'Psicología Positiva',
    title: 'Inventario de Fortalezas del Carácter (VIA) y Gratitud Estructurada',
    summary: 'Identificación y despliegue sistemático de las virtudes y fortalezas nucleares para construir bienestar duradero.',
    objective: 'Equilibrar el modelo tradicional centrado en el déficit, promoviendo el florecimiento psicológico (PERMA) y el optimismo aprendido.',
    stepByStepProcedure: [
      '1. Exploración de las 24 fortalezas VIA (ej. perspectiva, bondad, gratitud, perseverancia, esperanza).',
      '2. Identificación de las 5 "fortalezas insignia" (signature strengths) naturales del consultante.',
      '3. Ejercicio de las 3 Cosas Buenas (Three Good Things): Registrar al final del día 3 hechos positivos y atribuir el porqué ocurrieron.',
      '4. Saboreo Consciente (Savoring): Entrenar la capacidad de prolongar e intensificar las emociones positivas placenteras.',
      '5. Carta de Gratitud y visita de agradecimiento a una figura significativa de la vida.',
    ],
    recommendedCases: [
      'Fase de mantenimiento y prevención de recaídas en depresión',
      'Síndrome de burnout y desgaste por compasión',
      'Desarrollo de resiliencia en situaciones de pérdida o adversidad',
    ],
    clinicalExampleDialogue: [
      {
        therapist: 'Durante toda la sesión hemos hablado de lo que "no funciona" en tu semana. Cuéntame ahora: ¿cuáles fueron 2 momentos específicos donde sentiste que actuaste desde tu mejor versión de ti mismo/a?',
        patient: 'El miércoles, cuando mi vecina anciana no podía cargar las compras. Dejé lo que estaba haciendo y la ayudé a subir las escaleras.',
        therapeuticIntent: 'Redirigir la atención atencional hacia las conductas altruistas y la fortaleza de la Bondad.',
      },
      {
        therapist: '¿Qué fortaleza de tu carácter se expresó en ese instante? ¿Y cómo se sintió tu pecho mientras lo hacías?',
        patient: 'Sentí calidez. Recordé que, a pesar de mis problemas de tristeza, sigo siendo una persona generosa que puede aliviar la carga de otros.',
        therapeuticIntent: 'Fortalecer el autoconcepto positivo y la autoeficacia relacional.',
      },
    ],
  },
];
