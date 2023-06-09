import { injectable } from 'tsyringe';
import { Observable } from 'rxjs';

import { TaskQueueFactory } from './task-queue-factory';
import { ITaskVisitor } from './i-task-visitor';
import { IChannel } from '../i-channel';
import { GenericErrorInboundMessage, ILogger } from '../../../types';

@injectable()
export class TaskQueueFactoryFactory {
    public create(
        channel: IChannel,
        messageSendTimeout: number,
        maxMessageSendRetries: number,
        logger: ILogger,
        genericErrorsStream: Observable<GenericErrorInboundMessage>,
        taskVisitor: ITaskVisitor
    ): TaskQueueFactory {
        return new TaskQueueFactory(
            channel,
            messageSendTimeout,
            maxMessageSendRetries,
            logger,
            genericErrorsStream,
            taskVisitor
        );
    }
}
