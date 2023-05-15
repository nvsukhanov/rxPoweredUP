import { container } from 'tsyringe';
import { NEVER, Observable } from 'rxjs';

import { DEFAULT_CONFIG, LEGO_HUB_CONFIG } from './types';
import { HubScannerFactory } from './hub-scanner';
import { COMMANDS_FEATURE_FACTORY, HubFactory, IHub, OUTBOUND_MESSAGE_FACTORY } from './hub';
import { IMessageMiddleware } from './middleware';
import {
    AttachedIoReplyParser,
    HubPropertiesOutboundMessageFactory,
    HubPropertiesReplyParser,
    OutboundMessengerFactory,
    PortInformationReplyParser,
    PortInformationRequestOutboundMessageFactory,
    PortInputFormatSetupSingleOutboundMessageFactory,
    PortModeInformationReplyParser,
    PortModeInformationRequestOutboundMessageFactory,
    PortOutputCommandFeedbackReplyParser,
    PortOutputCommandOutboundMessageFactory,
    PortValueAbsolutePositionReplyParser,
    PortValueSpeedReplyParser
} from './messages';
import {
    ATTACHED_IO_REPLIES_PARSER,
    CommandsFeatureFactory,
    HUB_PROPERTIES_FEATURE_ERRORS_FACTORY,
    HUB_PROPERTIES_MESSAGE_FACTORY,
    HUB_PROPERTIES_REPLIES_PARSER,
    HubPropertiesFeatureFactory,
    INBOUND_MESSAGE_LISTENER_FACTORY,
    InboundMessageListenerFactory,
    IoFeatureFactory,
    PORT_INFORMATION_REPLY_PARSER,
    PORT_INFORMATION_REQUEST_MESSAGE_FACTORY,
    PORT_INPUT_FORMAT_SETUP_MESSAGE_FACTORY,
    PORT_MODE_INFORMATION_REPLY_PARSER,
    PORT_MODE_INFORMATION_REQUEST_MESSAGE_FACTORY,
    PORT_OUTPUT_COMMAND_FEEDBACK_REPLY_PARSER,
    PORT_OUTPUT_COMMAND_MESSAGE_FACTORY,
    PORT_VALUE_ABSOLUTE_POSITION_REPLY_PARSER,
    PORT_VALUE_SPEED_REPLY_PARSER
} from './features';
import { HUB_PROPERTY_FEATURE_FACTORY } from './hub/i-hub-properties-feature-factory';
import { IO_FEATURE_FACTORY } from './hub/i-io-feature-factory';
import { ConnectionErrorFactory } from './errors';

container.register(LEGO_HUB_CONFIG, { useValue: DEFAULT_CONFIG });
container.register(OUTBOUND_MESSAGE_FACTORY, OutboundMessengerFactory);
container.register(PORT_OUTPUT_COMMAND_MESSAGE_FACTORY, PortOutputCommandOutboundMessageFactory);
container.register(INBOUND_MESSAGE_LISTENER_FACTORY, InboundMessageListenerFactory);
container.register(PORT_OUTPUT_COMMAND_FEEDBACK_REPLY_PARSER, PortOutputCommandFeedbackReplyParser);
container.register(HUB_PROPERTIES_REPLIES_PARSER, HubPropertiesReplyParser);
container.register(PORT_INFORMATION_REPLY_PARSER, PortInformationReplyParser);
container.register(ATTACHED_IO_REPLIES_PARSER, AttachedIoReplyParser);
container.register(PORT_VALUE_ABSOLUTE_POSITION_REPLY_PARSER, PortValueAbsolutePositionReplyParser);
container.register(PORT_VALUE_SPEED_REPLY_PARSER, PortValueSpeedReplyParser);
container.register(PORT_MODE_INFORMATION_REPLY_PARSER, PortModeInformationReplyParser);
container.register(PORT_INFORMATION_REQUEST_MESSAGE_FACTORY, PortInformationRequestOutboundMessageFactory);
container.register(PORT_MODE_INFORMATION_REQUEST_MESSAGE_FACTORY, PortModeInformationRequestOutboundMessageFactory);
container.register(PORT_INPUT_FORMAT_SETUP_MESSAGE_FACTORY, PortInputFormatSetupSingleOutboundMessageFactory);
container.register(HUB_PROPERTIES_MESSAGE_FACTORY, HubPropertiesOutboundMessageFactory);
container.register(HUB_PROPERTY_FEATURE_FACTORY, HubPropertiesFeatureFactory);
container.register(COMMANDS_FEATURE_FACTORY, CommandsFeatureFactory);
container.register(IO_FEATURE_FACTORY, IoFeatureFactory);
container.register(HUB_PROPERTIES_FEATURE_ERRORS_FACTORY, ConnectionErrorFactory);

export async function connectHub(
    bluetooth: Bluetooth,
    incomingMessageMiddleware: IMessageMiddleware[] = [],
    outgoingMessageMiddleware: IMessageMiddleware[] = [],
    externalDisconnectEvents$: Observable<unknown> = NEVER
): Promise<IHub> {
    const factory = container.resolve(HubScannerFactory).create(bluetooth);
    const device = await factory.discoverHub();
    const hubFactory = container.resolve(HubFactory);
    const hub = await hubFactory.create(device, incomingMessageMiddleware, outgoingMessageMiddleware, externalDisconnectEvents$);
    await hub.connect();
    return hub;
}
