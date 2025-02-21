/* eslint-disable no-case-declarations */
import { weeklyAnalyticsEmailsWorker } from './analytics/workers/weeklyAnalyticsEmailsWorker'
import {
  AutomationMessage,
  NewActivityAutomationMessage,
  NewMemberAutomationMessage,
  NodeMicroserviceMessage,
  ProcessAutomationMessage,
  ProcessWebhookAutomationMessage,
} from './messageTypes'
import { AutomationTrigger, AutomationType } from '../../../types/automationTypes'
import newActivityWorker from './automation/workers/newActivityWorker'
import newMemberWorker from './automation/workers/newMemberWorker'
import webhookWorker from './automation/workers/webhookWorker'

/**
 * Worker factory for spawning different microservices
 * according to event.service
 * @param event
 * @returns worker function promise
 */

async function workerFactory(event: NodeMicroserviceMessage): Promise<any> {
  // console.log('Starting main worker with event, ', event)

  const { service, tenant } = event as any

  switch (service.toLowerCase()) {
    case 'weekly-analytics-emails':
      return weeklyAnalyticsEmailsWorker(tenant)
    case 'automation-process':
      const automationProcessRequest = event as ProcessAutomationMessage

      switch (automationProcessRequest.automationType) {
        case AutomationType.WEBHOOK:
          const webhookProcessRequest = event as ProcessWebhookAutomationMessage
          return webhookWorker(
            tenant,
            webhookProcessRequest.automationId,
            webhookProcessRequest.eventId,
            webhookProcessRequest.payload,
          )
        default:
          throw new Error(`Invalid automation type ${automationProcessRequest.automationType}!`)
      }

    case 'automation':
      const automationRequest = event as AutomationMessage

      switch (automationRequest.trigger) {
        case AutomationTrigger.NEW_ACTIVITY:
          const newActivityAutomationRequest = event as NewActivityAutomationMessage
          return newActivityWorker(tenant, newActivityAutomationRequest.activityId)
        case AutomationTrigger.NEW_MEMBER:
          const newMemberAutomationRequest = event as NewMemberAutomationMessage
          return newMemberWorker(tenant, newMemberAutomationRequest.memberId)
        default:
          throw new Error(`Invalid automation trigger ${automationRequest.trigger}!`)
      }
    default:
      throw new Error(`Invalid microservice ${service}`)
  }
}

export default workerFactory
