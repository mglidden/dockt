class UserObserver < ActiveRecord::Observer

  def after_create(user)
    Thread.new() {
      UserMailer.signup_notification(user).deliver
    }
  end

  def after_save(user)
  end

end
