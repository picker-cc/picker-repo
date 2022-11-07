import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ComponentService } from './component.service';
import { ComponentModuleOptions, ComponentModuleRootOptions } from '../types';
import { COMPONENT_MODULE_OPTIONS } from '../wechat/wechat.constants';

@Module({})
export class WeChatComponentModule {

  public static register (options: ComponentModuleOptions) : DynamicModule {
    return {
      global: options.isGlobal,
      module: WeChatComponentModule,
      providers: [{
        provide: ComponentService,
        useValue: new ComponentService(options),
      }],
      exports: [ComponentService],
    };
  }

  public static forRootAsync (options: ComponentModuleRootOptions) {
    const providers: Provider[] = [];
    if (options.useFactory) {
      providers.push({
        provide: COMPONENT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      });
    }
    providers.push({
      provide: ComponentService,
      inject: [COMPONENT_MODULE_OPTIONS],
      useFactory: (opt: ComponentModuleOptions) => {
        return new ComponentService(opt);
      },
    });
    return {
      global: options.isGlobal,
      module: WeChatComponentModule,
      imports: options.imports,
      providers,
      exports: [ComponentService],
    };
  }
}
