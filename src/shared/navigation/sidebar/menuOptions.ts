import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PersonalInjuryIcon from '@mui/icons-material/PersonalInjury';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

import type { ElementType } from "react";

export interface MenuOption {
  label: string;
  path: string;
  icon: ElementType;
}

export const primaryMenuOptions: MenuOption[] = [
  { label: "Consultas", path: "/consultas", icon: EventNoteOutlinedIcon },
  { label: "Pacientes", path: "/pacientes", icon: PersonalInjuryIcon },
  { label: "Médicos", path: "/personal-medico", icon: PeopleIcon },
  { label: "Especialidades", path: "/especialidades", icon: VaccinesIcon },
  { label: "Enfermeria", path: "/personal-enfermeria", icon: MedicationIcon },
  { label: "Consultorios", path: "/consultorios", icon: MedicationIcon },
  { label: "Programación", path: "/programacion-consultas", icon: CalendarMonthIcon },
  { label: "Reportes", path: "/reportes", icon: MonitorHeartIcon },
];

// Add configuration options here when their screens have routes in App.tsx.
export const configurationMenuOptions: MenuOption[] = [
  { label: "Configuracion", path: "/locaciones", icon: PersonalInjuryIcon },
  { label: "Roles y Usuarios", path: "/usuarios", icon: EventNoteOutlinedIcon },
];
