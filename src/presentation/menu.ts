import type { City } from "../types/City.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import type { Settings } from "../types/Settings.ts";
import { APP_TITLE, LINE, TITLE_INDENT } from "../utils/constants.ts";
import { colors } from "../utils/colors.ts";
import { unitLabel } from "../utils/format.ts";

export function buildMenuOptions(cityCount: number, settings: Settings): MenuOption[] {
  return [
    { id: "1", label: "Clima de ciudad default" },
    { id: "2", label: `Clima de todas las ciudades (${cityCount})` },
    { id: "3", label: "Buscar y agregar ciudad" },
    { id: "4", label: "Eliminar ciudad" },
    { id: "5", label: "Establecer ciudad default" },
    { id: "6", label: "Pronóstico 7 días" },
    { id: "8", label: `Ajustes (${unitLabel(settings.unit)})` },
    { id: "9", label: "Salir" },
  ];
}

export function renderMenu(cities: City[], settings: Settings): void {
  console.log(colors.cyan(LINE));
  console.log(colors.cyan(`${" ".repeat(TITLE_INDENT)}${APP_TITLE}`));
  console.log(colors.cyan(LINE));

  for (const option of buildMenuOptions(cities.length, settings)) {
    console.log(`  ${option.id}. ${option.label}`);
  }

  console.log(colors.cyan(LINE));
}
