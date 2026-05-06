import { ThemeName } from '../enums/Theme';
import { ColorMode } from '../enums/ColorMode';

export interface IThemeState {
  theme: ThemeName;
  colorMode: ColorMode;
}