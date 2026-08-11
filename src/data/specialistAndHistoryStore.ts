import { AuthorizedSpecialist, DailyChatLog, ChatMessage } from '../types';

const SPECIALISTS_STORAGE_KEY = 'sai_authorized_specialists_v1';
const ACTIVE_SPECIALIST_KEY = 'sai_active_specialist_id_v1';
const CHAT_LOGS_STORAGE_KEY = 'sai_daily_chat_logs_v1';

export const INITIAL_SPECIALISTS: AuthorizedSpecialist[] = [
  {
    id: 'spec-1002631131',
    cedula: '1002631131',
    nombreCompleto: 'Ing. Carlos Polanco Jácome',
    tituloEspecialidad: 'Especialista en Manejo Técnico Agropecuario',
    experienciaAnos: 10,
    sectorFocus: 'mixto',
    activoEnTurno: true,
    fechaRegistro: '2026-01-01',
  },
];

export function getAuthorizedSpecialists(): AuthorizedSpecialist[] {
  try {
    const raw = localStorage.getItem(SPECIALISTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading authorized specialists', e);
  }
  return INITIAL_SPECIALISTS;
}

export function saveAuthorizedSpecialists(list: AuthorizedSpecialist[]) {
  try {
    localStorage.setItem(SPECIALISTS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('sai_specialists_updated'));
  } catch (e) {
    console.error('Error saving authorized specialists', e);
  }
}

export function getActiveSpecialist(): AuthorizedSpecialist {
  const specialists = getAuthorizedSpecialists();
  const activeId = localStorage.getItem(ACTIVE_SPECIALIST_KEY);
  if (activeId) {
    const found = specialists.find((s) => s.id === activeId);
    if (found) return found;
  }
  // Default to first active or Ing. Carlos Polanco
  const active = specialists.find((s) => s.activoEnTurno) || specialists[0] || INITIAL_SPECIALISTS[0];
  return active;
}

export function setActiveSpecialistByCedula(cedula: string): { success: boolean; specialist?: AuthorizedSpecialist; message: string } {
  const specialists = getAuthorizedSpecialists();
  const cleanCedula = cedula.trim().replace(/\D/g, '');
  const found = specialists.find((s) => s.cedula.replace(/\D/g, '') === cleanCedula);

  if (!found) {
    return {
      success: false,
      message: `Número de cédula "${cedula}" no consta en el registro oficial de especialistas habilitados.`,
    };
  }

  // Update active status
  const updated = specialists.map((s) => ({
    ...s,
    activoEnTurno: s.id === found.id,
  }));

  saveAuthorizedSpecialists(updated);
  localStorage.setItem(ACTIVE_SPECIALIST_KEY, found.id);
  window.dispatchEvent(new Event('sai_specialists_updated'));

  return {
    success: true,
    specialist: found,
    message: `¡Validación Exitosa! Especialista en turno activo: ${found.nombreCompleto} (Cédula: ${found.cedula}).`,
  };
}

export function addNewSpecialist(data: {
  cedula: string;
  nombreCompleto: string;
  tituloEspecialidad: string;
  experienciaAnos: number;
  sectorFocus: 'agricola' | 'pecuario' | 'mixto';
}): { success: boolean; specialist?: AuthorizedSpecialist; message: string } {
  const cleanCedula = data.cedula.trim().replace(/\D/g, '');
  if (!cleanCedula || cleanCedula.length < 8) {
    return { success: false, message: 'La cédula de identidad ingresada debe ser válida.' };
  }

  if (!data.nombreCompleto.trim()) {
    return { success: false, message: 'Ingrese el nombre completo del profesional especialista.' };
  }

  const specialists = getAuthorizedSpecialists();
  const exists = specialists.some((s) => s.cedula.replace(/\D/g, '') === cleanCedula);
  if (exists) {
    return { success: false, message: `Ya existe un especialista registrado con la cédula ${data.cedula}.` };
  }

  const newSpecialist: AuthorizedSpecialist = {
    id: `spec-${cleanCedula}-${Date.now()}`,
    cedula: cleanCedula,
    nombreCompleto: data.nombreCompleto.trim(),
    tituloEspecialidad: data.tituloEspecialidad.trim() || 'Especialista Técnico Agropecuario',
    experienciaAnos: data.experienciaAnos || 10,
    sectorFocus: data.sectorFocus,
    activoEnTurno: true,
    fechaRegistro: new Date().toISOString().split('T')[0],
  };

  const updatedList = [newSpecialist, ...specialists.map((s) => ({ ...s, activoEnTurno: false }))];
  saveAuthorizedSpecialists(updatedList);
  localStorage.setItem(ACTIVE_SPECIALIST_KEY, newSpecialist.id);

  return {
    success: true,
    specialist: newSpecialist,
    message: `Especialista ${newSpecialist.nombreCompleto} registrado e ingresado en turno con éxito.`,
  };
}

// ---------------- Daily Chat Logs Store ----------------

export function getDailyChatLogs(): DailyChatLog[] {
  try {
    const raw = localStorage.getItem(CHAT_LOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading daily chat logs', e);
  }
  return [];
}

export function saveOrUpdateChatLog(logData: {
  id?: string;
  advisorType: 'agricola' | 'pecuario';
  title?: string;
  messages: ChatMessage[];
}): DailyChatLog {
  const logs = getDailyChatLogs();
  const activeSpecialist = getActiveSpecialist();
  const now = new Date();
  const fechaIso = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const hora = now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

  // Generate snippet
  const userMsg = logData.messages.find((m) => m.role === 'user')?.content || 'Consulta Técnica';
  const snippet = userMsg.length > 80 ? userMsg.substring(0, 80) + '...' : userMsg;

  const logId = logData.id || `log-${Date.now()}`;
  const existingIdx = logs.findIndex((l) => l.id === logId);

  const newLog: DailyChatLog = {
    id: logId,
    fechaIso,
    hora,
    advisorType: logData.advisorType,
    specialistOnDuty: {
      nombreCompleto: activeSpecialist.nombreCompleto,
      cedula: activeSpecialist.cedula,
      titulo: activeSpecialist.tituloEspecialidad,
    },
    title: logData.title || (logData.advisorType === 'agricola' ? 'Asesoría Agrícola' : 'Asesoría Pecuaria'),
    summarySnippet: snippet,
    messages: logData.messages,
  };

  if (existingIdx >= 0) {
    logs[existingIdx] = newLog;
  } else {
    logs.unshift(newLog);
  }

  try {
    localStorage.setItem(CHAT_LOGS_STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new Event('sai_chat_logs_updated'));
  } catch (e) {
    console.error('Error saving chat log', e);
  }

  return newLog;
}

export function deleteChatLog(logId: string) {
  const logs = getDailyChatLogs().filter((l) => l.id !== logId);
  try {
    localStorage.setItem(CHAT_LOGS_STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new Event('sai_chat_logs_updated'));
  } catch (e) {
    console.error('Error deleting chat log', e);
  }
}

export function clearAllChatLogs() {
  try {
    localStorage.setItem(CHAT_LOGS_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event('sai_chat_logs_updated'));
  } catch (e) {
    console.error('Error clearing chat logs', e);
  }
}
