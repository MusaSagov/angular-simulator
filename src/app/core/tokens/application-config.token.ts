import { InjectionToken } from '@angular/core';
import { IApplicationConfig } from '../../shared/interfaces/IApplicationConfig';

export const APPLICATION_CONFIG = new InjectionToken<IApplicationConfig>('APPLICATION_CONFIG');