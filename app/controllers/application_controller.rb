# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit

  include ApiResponders
  include ApiRescuable
  include Authenticable
  include Pundit

  private

    def handle_validation_error(exception)
      respond_with_error(exception)
    end

    def handle_record_not_found(exception)
      respond_with_error(exception.message, :not_found)
    end

    def handle_record_not_unique(exception)
      respond_with_error(exception)
    end

    def handle_api_error(exception)
      respond_with_error(exception, :internal_server_error)
    end

    def respond_with_error(message, status = :unprocessable_entity, context = {})
      is_exception = message.kind_of?(StandardError)
      error_message = is_exception ? message.record&.errors_to_sentence : message
      render status: status, json: { error: error_message }.merge(context)
    end

    def respond_with_success(message, status = :ok, context = {})
      render status: status, json: { notice: message }.merge(context)
    end

    def respond_with_json(json = {}, status = :ok)
      render status: status, json: json
    end

    def authenticate_user_using_x_auth_token
      user_email = request.headers["X-Auth-Email"].presence
      auth_token = request.headers["X-Auth-Token"].to_s
      user = user_email && User.find_by!(email: user_email)
      is_valid_token = auth_token && ActiveSupport::SecurityUtils.secure_compare(user.authentication_token, auth_token)
      if is_valid_token
        @current_user = user
      else
        respond_with_error("Could not authenticate with the provided credentials", :unauthorized)
      end
    end

    def current_user
      @current_user
    end

    def handle_authorization_error
      respond_with_error(t("authorization.denied"), :forbidden)
    end
end
