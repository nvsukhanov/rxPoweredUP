import { HubProperty } from '../../constants';
import { Observable } from 'rxjs';
import { HubPropertyBatteryInboundMessage, HubPropertyButtonStateInboundMessage, HubPropertyInboundMessage, HubPropertyRssiInboundMessage } from '../../types';

export interface IHubPropertiesFeature {
    readonly batteryLevel$: Observable<HubPropertyBatteryInboundMessage>;
    readonly rssiLevel$: Observable<HubPropertyRssiInboundMessage>;
    readonly buttonState$: Observable<HubPropertyButtonStateInboundMessage>;
    readonly advertisingName: string;

    setHubAdvertisingName(
        advertisingName: string
    ): Promise<void>;

    disconnect(): Promise<void>;

    getPropertyValue$<T extends HubProperty>(
        property: T
    ): Observable<HubPropertyInboundMessage & { propertyType: T }>;
}