import { Observable } from 'rxjs';

import { MessageType, PortModeName } from '../../constants';
import { PortValueInboundMessage, RawMessage } from '../../types';
import { IInboundMessageListenerFactory, IReplyParser } from '../../hub';

export class PortsFeaturePortValueListenerFactory {
    private readonly portValueParsers: { [m in PortModeName]?: IReplyParser<MessageType.portValueSingle> };

    constructor(
        private readonly portValueAbsolutePositionReplyParserService: IReplyParser<MessageType.portValueSingle>,
        private readonly portValueSpeedReplyParserService: IReplyParser<MessageType.portValueSingle>,
        private readonly portValuePositionReplyParserService: IReplyParser<MessageType.portValueSingle>,
        private readonly messageListenerFactory: IInboundMessageListenerFactory,
        private readonly characteristicDataStream: Observable<RawMessage<MessageType>>,
        private readonly onDisconnected$: Observable<void>,
    ) {
        this.portValueParsers = {
            [PortModeName.absolutePosition]: this.portValueAbsolutePositionReplyParserService,
            [PortModeName.speed]: this.portValueSpeedReplyParserService,
            [PortModeName.position]: this.portValuePositionReplyParserService,
        };
    }

    public createForMode(
        modeName: PortModeName
    ): Observable<PortValueInboundMessage> {
        const replyParserService = this.portValueParsers[modeName];
        if (!replyParserService) {
            throw new Error(`No reply parser for mode ${modeName}`);
        }
        return this.messageListenerFactory.create(
            this.characteristicDataStream,
            replyParserService,
            this.onDisconnected$,
        );
    }
}
