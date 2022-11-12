import { DynamicModule } from '@nestjs/common';
import { WeChatModuleOptions, WeChatModuleRootOptions } from '../types';
export declare class WeChatModule {
    static register(options: WeChatModuleOptions): DynamicModule;
    static forRootAsync(options: WeChatModuleRootOptions): DynamicModule;
}
