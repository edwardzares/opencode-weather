import { askUnit } from "../presentation/input.ts";
import { showMessage } from "../presentation/output.ts";
import { loadSettings, saveSettings } from "../storage/settingsStorage.ts";
import { unitLabel } from "../utils/format.ts";

export async function updateSettings(): Promise<void> {
  const settings = await loadSettings();

  console.log(`\n  Unidad actual: ${unitLabel(settings.unit)}`);
  console.log("  1. Celsius (°C)");
  console.log("  2. Fahrenheit (°F)");

  const unit = askUnit();
  if (!unit) {
    showMessage("Opción inválida.");
    return;
  }

  await saveSettings({ ...settings, unit });
  showMessage(`Unidad establecida: ${unitLabel(unit)}`);
}
