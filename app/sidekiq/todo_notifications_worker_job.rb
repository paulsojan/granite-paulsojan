# frozen_string_literal: true

class TodoNotificationsWorkerJob
  include Sidekiq::Job

  def perform
    todo_notification_service = TodoNotificationService.new
    todo_notification_service.process
  end
end
