# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  # Be sure to include AuthenticationSystem in Application Controller instead
  include AuthenticatedSystem

  # render new.rhtml
  def new
    render :layout => false
  end

  def create
    logout_keeping_session!
    if params[:cp] != nil
      user = User.find_by_crypted_password(params[:cp])
    else
      user = User.authenticate(params[:login], params[:password])
    end
    puts user
    puts params
    if user
      # Protects against session fixation attacks, causes request forgery
      # protection if user resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset_session
      self.current_user = user
      #new_cookie_flag = (params[:remember_me] == "1")
      new_cookie_flag = true
      handle_remember_cookie! new_cookie_flag

      use_layout = 'false'
      if params[:layout] == 'true'
        use_layout = 'true'
      end

      redirect_to :controller => :groups, :action => :index, :layout => use_layout
    else
      note_failed_signin
      @login       = params[:login]
      @remember_me = params[:remember_me]
      render :inline => 'failed'
    end
  end

  def destroy
    logout_killing_session!
    render :partial => 'home/home.html.erb', :layout => false
    #redirect_back_or_default('/', :notice => "You have been logged out.")
  end

  def bar
    render :partial => 'users/user_bar'
  end

protected
  # Track failed login attempts
  def note_failed_signin
    flash.now[:error] = "Couldn't log you in as '#{params[:login]}'"
    logger.warn "Failed login for '#{params[:login]}' from #{request.remote_ip} at #{Time.now.utc}"
  end
end
