import { ThemeName } from '../enums/Theme';
import { ColorMode } from '../enums/ColorMode';

export interface ThemeState {
  theme: ThemeName;
  colorMode: ColorMode;
}