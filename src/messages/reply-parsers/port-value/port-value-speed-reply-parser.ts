import { IReplyParser } from '../../i-reply-parser';
import { MessageType, PortModeName } from '../../../constants';
import { PortValueSpeedInboundMessage, RawMessage } from '../../../types';
import { convertUint8ToSignedInt } from '../../../helpers';
import { injectable } from 'tsyringe';

@injectable()
export class PortValueSpeedReplyParser implements IReplyParser<MessageType.portValueSingle> {
    public readonly messageType = MessageType.portValueSingle;

    public parseMessage(
        message: RawMessage<MessageType.portValueSingle>
    ): PortValueSpeedInboundMessage {
        return {
            messageType: this.messageType,
            portId: message.payload[0],
            modeName: PortModeName.speed,
            speed: convertUint8ToSignedInt(message.payload[1]),
        };
    }
}
