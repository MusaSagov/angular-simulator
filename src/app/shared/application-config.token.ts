import { InjectionToken } from '@angular/core';
import { IApplicationConfig } from './interfaces/IApplicationConfig';

export const APPLICATION_CONFIG = new InjectionToken<IApplicationConfig>('APPLICATION_CONFIG');