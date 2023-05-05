import {
    HubPropertiesOutboundMessageFactory,
    HubPropertiesReplyParser,
    InboundMessageListenerFactory,
    OutboundMessenger,
    RawMessage
} from '../messages';
import { Observable } from 'rxjs';
import { MessageType } from '../constants';
import { HubPropertiesFeature } from './hub-properties-feature';
import { ConnectionErrorFactory } from '../errors';
import { injectable } from 'tsyringe';
import { ILogger } from '../logging';

@injectable()
export class HubPropertiesFeatureFactory {
    constructor(
        private readonly featureMessageProviderFactoryService: InboundMessageListenerFactory,
        private readonly replyParserService: HubPropertiesReplyParser,
        private readonly messageFactoryService: HubPropertiesOutboundMessageFactory,
        private readonly errorsFactory: ConnectionErrorFactory
    ) {
    }

    public create(
        advertisingName: string,
        characteristicDataStream: Observable<RawMessage<MessageType>>,
        onHubDisconnected: Observable<void>,
        messenger: OutboundMessenger,
        logger: ILogger
    ): HubPropertiesFeature {
        const repliesProvider = this.featureMessageProviderFactoryService.create(
            characteristicDataStream,
            this.replyParserService,
            onHubDisconnected,
        );
        return new HubPropertiesFeature(
            advertisingName,
            this.messageFactoryService,
            messenger,
            logger,
            repliesProvider,
            this.errorsFactory
        );
    }
}
