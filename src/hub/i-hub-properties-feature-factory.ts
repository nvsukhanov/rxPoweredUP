import { Observable } from 'rxjs';
import { InjectionToken } from 'tsyringe';

import { IDisposable, ILogger, RawMessage } from '../types';
import { MessageType } from '../constants';
import { IOutboundMessenger } from './i-outbound-messenger';
import { IHubPropertiesFeature } from './i-hub-properties-feature';

export interface IHubPropertiesFeatureFactory {
    create(
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        onHubDisconnected: Observable<void>,
        messenger: IOutboundMessenger,
        logger: ILogger
    ): IHubPropertiesFeature & IDisposable;
}

export const HUB_PROPERTY_FEATURE_FACTORY: InjectionToken<IHubPropertiesFeatureFactory> = Symbol('HUB_PROPERTY_FEATURE_FACTORY');
