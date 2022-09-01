# frozen_string_literal: true

class UserNotificationsWorkerJob
  include Sidekiq::Job

  def perform(user_id)
    TaskMailer.delay.pending_tasks_email(user_id)
  end
end
